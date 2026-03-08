import React, { useState, useContext } from 'react';
import { Text, View, StyleSheet, Button, TouchableOpacity, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { VisitsContext } from '../context/VisitsContext';

export default function QRScannerScreen({ navigation }) {
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);

    // ✅ CORRECCIÓN: Extraemos tanto 'visitas' como 'completarVisita'
    const { visitas, completarVisita } = useContext(VisitsContext);

    if (!permission) return <View />;
    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={styles.centerText}>Necesitamos permiso para usar la cámara</Text>
                <Button onPress={requestPermission} title="Dar permiso" />
            </View>
        );
    }

    const handleBarcodeScanned = ({ data }) => {
        setScanned(true);
        try {
            const info = JSON.parse(data);

            // Buscamos el trabajo en nuestra lista global
            const trabajoEncontrado = visitas.find(v =>
                v.vehiculo === info.vehiculo && v.estado !== 'completado'
            );

            if (trabajoEncontrado) {
                Alert.alert(
                    "¡Trabajo Identificado!",
                    `Vehículo: ${info.vehiculo}\nServicio: ${info.tipoLavado}`,
                    [
                        { text: "Cancelar", onPress: () => setScanned(false) },
                        {
                            text: "Completar Lavado", onPress: () => {
                                completarVisita(trabajoEncontrado.id);
                                navigation.goBack();
                            }
                        }
                    ]
                );
            } else {
                Alert.alert("Aviso", "Este vehículo no tiene citas pendientes hoy.");
                setScanned(false);
            }
        } catch (e) {
            Alert.alert("Error", "El código escaneado no es un ticket válido.");
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

            {/* ✅ CORRECCIÓN: El "marco" visual ahora está dentro del return */}
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
