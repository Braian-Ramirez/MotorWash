import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useContext } from 'react';
import { AuthContext } from '../application/context/AuthContext';
import { VisitsContext } from '../application/context/VisitsContext';

export default function ActiveJobsScreen({ navigation }) {
    const { visitas, completarVisita, iniciarVisita } = useContext(VisitsContext);
    const trabajosPendientes = visitas.filter(job => job.estado !== 'completado');

    const getIconForType = (tipo) => {
        const t = String(tipo || '').trim().toLowerCase();
        if (t.includes('moto')) return 'motorbike';
        if (t.includes('camioneta') || t.includes('pickup') || t.includes('suv')) return 'truck';
        return 'car-side';
    };

    // Si la lista de visitas está vacía...
    if (visitas.length === 0) {
        return (
            <View style={styles.container}>
                <MaterialCommunityIcons name="emoticon-happy-outline" size={80} color="#3b5998" />
                <Text style={styles.text}>¡Todo listo!</Text>
                <Text style={styles.subtext}>No hay carros pendientes por ahora.</Text>
            </View>
        );
    }
    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            {/* Encabezado */}
            <View style={styles.header}>
                <MaterialCommunityIcons name="car-wash" size={50} color="#3b5998" />
                <Text style={styles.text}>Trabajos de Hoy</Text>
                <TouchableOpacity
                    style={styles.scannerButton}
                    onPress={() => navigation.navigate('ScanQR')}
                >
                    <MaterialCommunityIcons name="qrcode-scan" size={24} color="#fff" />
                    <Text style={styles.buttonTextWhite}> Escanear Ticket QR</Text>
                </TouchableOpacity>
            </View>

            {/* 🚀 AQUÍ ESTÁ EL MAPA: Generamos una tarjeta por cada visita */}
            {trabajosPendientes.map((job) => (
                <View key={job.id} style={styles.jobCard}>
                    <View style={styles.cardHeader}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                            <MaterialCommunityIcons name={getIconForType(job.vehiculo)} size={22} color="#3b5998" style={{ marginRight: 5 }} />
                            <Text style={styles.vehicleText} numberOfLines={1}>{job.vehiculo}</Text>
                        </View>
                        <MaterialCommunityIcons name="clock-outline" size={20} color="#666" />
                        <Text style={styles.timeText}>{job.fecha}</Text>
                    </View>

                    {/* Detalles del Servicio */}
                    <Text style={styles.serviceText}>
                        Servicio: <Text style={styles.boldText}>{job.tipoLavado}</Text>
                    </Text>
                    <Text style={styles.atendanteText}>
                        Encargado: <Text style={styles.boldText}>{job.encargado}</Text>
                    </Text>

                    {/* Botón de acción para el empleado */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                        {/* Botón Iniciar (Solo si está pendiente) */}
                        {job.estado === 'pendiente' && (
                            <TouchableOpacity
                                style={[styles.completeButton, { backgroundColor: '#ff9800', flex: 1, marginRight: 5 }]}
                                onPress={() => iniciarVisita(job.id)}
                            >
                                <MaterialCommunityIcons name="play-circle" size={20} color="#fff" />
                                <Text style={styles.buttonText}>Iniciar Lavado</Text>
                            </TouchableOpacity>
                        )}

                        {/* Botón Finalizar (Solo si ya inició) */}
                        {job.estado === 'en_progreso' && (
                            <TouchableOpacity
                                style={[styles.completeButton, { flex: 1 }]}
                                onPress={() => completarVisita(job.id)}
                            >
                                <MaterialCommunityIcons name="check-circle" size={20} color="#fff" />
                                <Text style={styles.buttonText}>Marcar Listo</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                </View>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    contentContainer: { padding: 20 },
    header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, justifyContent: 'center' },
    text: { fontSize: 24, fontWeight: 'bold', color: '#003366', marginLeft: 10 },

    jobCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 15,
        marginBottom: 15,
        elevation: 3, // Sombra para Android
        borderLeftWidth: 6,
        borderLeftColor: '#3b5998', // Borde azul de "trabajo"
    },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
    vehicleText: { fontSize: 18, fontWeight: 'bold', color: '#333' },
    timeText: { fontSize: 14, color: '#666' },
    serviceText: { fontSize: 15, color: '#444', marginBottom: 5 },
    atendanteText: { fontSize: 14, color: '#666', marginBottom: 15 },
    boldText: { fontWeight: 'bold', color: '#000' },

    completeButton: {
        backgroundColor: '#4caf50',
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },

    scannerButton: {
        backgroundColor: '#3b5998',
        flexDirection: 'row',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
        marginLeft: 10
    },
    buttonTextWhite: { color: '#fff', fontWeight: 'bold' },

});



