import React, { useState, useContext } from 'react';
import { Text, View, StyleSheet, Button, TouchableOpacity, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { VisitsContext } from '../context/VisitsContext';
import { AuthContext } from '../context/AuthContext'; // Importado para saber quién escanea

export default function QRScannerScreen({ navigation }) {
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);

    // ✅ Ahora extraemos 'iniciarVisita' del contexto de visitas
    const { visitas, iniciarVisita } = useContext(VisitsContext);
    const { user } = useContext(AuthContext); // Extraemos al empleado

    if (!permission) return <View />;
    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={styles.centerText}>Necesitamos permiso para usar la cámara</Text>
                <Button onPress={requestPermission} title="Dar permiso" />
            </View>
        );
    }

    const handleBarcodeScanned = async ({ data }) => {
        setScanned(true);
        try {
            // El QR ya es directamente el ID del lavado
            const idEscaneado = data;

            // Buscamos el trabajo en nuestra lista global por su ID
            const trabajoEncontrado = visitas.find(v => v.id === idEscaneado);

            if (trabajoEncontrado) {
                if (trabajoEncontrado.estado === 'pendiente') {
                    // Si el cliente eligió 'Cualquiera', le asignamos el nombre de este empleado
                    const nombreEmpleado = trabajoEncontrado.encargado === 'Cualquiera' ? user.nombre : null;
                    
                    Alert.alert(
                        "¡Trabajo Identificado!",
                        `Vehículo: ${trabajoEncontrado.vehiculo}\nServicio: ${trabajoEncontrado.tipoLavado}\n¿Deseas iniciar este lavado ahora mismo?`,
                        [
                            { text: "Cancelar", onPress: () => setScanned(false) },
                            {
                                text: "Iniciar Lavado", onPress: async () => {
                                    // Pasa el ID y opcionalmente el nombre del empleado a la base de datos
                                    await iniciarVisita(trabajoEncontrado.id, nombreEmpleado);
                                    // Te devuelve a la pantalla ActiveJobs de inmediato
                                    navigation.goBack(); 
                                }
                            }
                        ]
                    );
                } else if (trabajoEncontrado.estado === 'en_progreso') {
                    Alert.alert("Aviso", "Este lavado ya comenzó.");
                    setScanned(false);
                } else {
                    Alert.alert("Aviso", "Este lavado ya está completado.");
                    setScanned(false);
                }
            } else {
                Alert.alert("Aviso", "No se encontró el lavado en la base de datos.");
                setScanned(false);
            }
        } catch (e) {
            Alert.alert("Error", "El código escaneado no es válido.");
            setScanned(false);
        }
    };

    return (
        <View style={styles.container}>
            <CameraView
                style={StyleSheet.absoluteFillObject}
                onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
                barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
            />

            <View style={styles.overlay}>
                <View style={styles.unfocusedContainer} />
                <View style={styles.focusedContainer}>
                    <View style={styles.marker} />
                </View>
                <View style={styles.unfocusedContainer} />
            </View>

            {scanned && (
                <TouchableOpacity style={styles.scanAgainBtn} onPress={() => setScanned(false)}>
                    <Text style={styles.scanAgainText}>Escanear de nuevo</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    centerText: { color: '#fff', textAlign: 'center', marginBottom: 20 },
    overlay: {
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        justifyContent: 'space-between', alignItems: 'center'
    },
    unfocusedContainer: { flex: 1, width: '100%', backgroundColor: 'rgba(0,0,0,0.7)' },
    focusedContainer: { width: 280, height: 280, backgroundColor: 'transparent' },
    marker: { flex: 1, borderWidth: 2, borderColor: '#3b5998', borderRadius: 10 },
    scanAgainBtn: { position: 'absolute', bottom: 50, alignSelf: 'center', backgroundColor: '#3b5998', padding: 15, borderRadius: 10 },
    scanAgainText: { color: '#fff', fontWeight: 'bold' }
});
