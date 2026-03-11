import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { VisitsContext } from '../context/VisitsContext';

export default function HistoryScreen() {
    const { visitas, completarVisita } = useContext(VisitsContext);
    const trabajosCompletados = visitas.filter(job => job.estado === 'completado');

    const getIconForType = (tipo) => {
        const t = String(tipo || '').trim().toLowerCase();
        if (t.includes('moto')) return 'motorbike';
        if (t.includes('camioneta') || t.includes('pickup') || t.includes('suv')) return 'truck';
        return 'car-side';
    };

    // Si la lista de visitas está vacía...
    if (trabajosCompletados.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <MaterialCommunityIcons name="emoticon-happy-outline" size={80} color="#3b5998" />
                <Text style={styles.text}>Historial vacío</Text>
                <Text style={styles.subtext}>Aún no has completado ningún lavado.</Text>
            </View>
        );
    }
    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            {/* Encabezado */}
            <View style={styles.header}>
                <MaterialCommunityIcons name="car-wash" size={50} color="#3b5998" />
                <Text style={styles.text}>Trabajos Completados</Text>
            </View>

            {/* 🚀 AQUÍ ESTÁ EL MAPA: Generamos una tarjeta por cada visita */}
            {trabajosCompletados.map((job) => (
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

                    {/* ⭐ Añadir la calificación si el cliente ya puntuó */}
                    {job.calificacion && (
                        <View style={styles.ratingSection}>
                            <View style={styles.starsRow}>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <MaterialCommunityIcons
                                        key={star}
                                        name={job.calificacion >= star ? "star" : "star-outline"}
                                        size={20}
                                        color={job.calificacion >= star ? "#ffc107" : "#ccc"}
                                    />
                                ))}
                                <Text style={styles.ratingLabel}>{job.calificacion}/5</Text>
                            </View>

                            {/* 💬 Si dejó comentarios, los mostramos también */}
                            {job.comentario ? (
                                <View style={styles.commentBox}>
                                    <MaterialCommunityIcons name="format-quote-open" size={16} color="#666" />
                                    <Text style={styles.commentText}>{job.comentario}</Text>
                                </View>
                            ) : null}
                        </View>
                    )}
                </View>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5', padding: 20 },
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

    ratingSection: {
        marginTop: 10,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    starsRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingLabel: {
        marginLeft: 8,
        fontSize: 14,
        fontWeight: 'bold',
        color: '#ffc107'
    },
    commentBox: {
        flexDirection: 'row',
        backgroundColor: '#f9f9f9',
        padding: 10,
        borderRadius: 8,
        marginTop: 8,
        alignItems: 'flex-start'
    },
    commentText: {
        fontSize: 13,
        color: '#555',
        fontStyle: 'italic',
        marginLeft: 5,
        flex: 1
    }
});



