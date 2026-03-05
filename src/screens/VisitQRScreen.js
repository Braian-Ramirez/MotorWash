import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
// Importamos la librería para dibujar Códigos QR
import QRCode from 'react-native-qrcode-svg';

export default function VisitQRScreen({ route, navigation }) {
    // Recibimos los datos de la visita desde la pantalla anterior
    // Si por alguna razón llega vacío, ponemos un texto por defecto
    const visita = route.params?.visitaData || 'Visita Genérica';

    return (
        <View style={styles.container}>
            <Text style={styles.title}>¡Cita Agendada!</Text>

            <Text style={styles.subtitle}>
                Muestra este código QR al encargado cuando llegues al lavadero para iniciar el servicio.
            </Text>

            <View style={styles.qrContainer}>
                <QRCode
                    // Aquí es donde metemos todos los datos (Fecha, Vehiculo, etc)
                    // que serán transformados en el dibujo del QR
                    value={visita}
                    size={250}
                    color="black"
                    backgroundColor="white"
                />
            </View>

            {/* Para asegurarnos de qué datos tiene escondidos el QR, lo podemos escribir abajo */}
            <Text style={styles.dataText}>ID de Cita segura generada.</Text>

            <TouchableOpacity style={styles.buttonSecondary} onPress={() => navigation.navigate('Home')}>
                <Text style={styles.buttonTextBlue}>Volver al Inicio</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#4caf50', // Verde de éxito
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#555',
        textAlign: 'center',
        marginBottom: 40,
        paddingHorizontal: 20,
    },
    qrContainer: {
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 20,
        elevation: 5, // Sombra
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        marginBottom: 30,
    },
    dataText: {
        fontSize: 14,
        color: '#aaa',
        marginBottom: 30,
    },
    buttonSecondary: {
        width: '80%',
        height: 50,
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: '#0066cc',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
    },
    buttonTextBlue: {
        color: '#0066cc',
        fontSize: 16,
        fontWeight: 'bold',
    }
});
