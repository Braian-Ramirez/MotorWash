import React, { useContext } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { VisitsContext } from '../context/VisitsContext';

export default function StatsScreen() {
    const { visitas } = useContext(VisitsContext);

    // Cálculos dinámicos
    const visitasCompletadas = visitas.filter(v => v.estado === 'completado');
    const completados = visitasCompletadas.length;

    // (Opcional recomendado: calcular ingresos sumando v.precio si existe en el contexto, 
    // pero por ahora mantenemos la regla de $20 x lavado para no romper nada viejo).
    const ingresos = completados * 20;

    // Cálculo de calificación promedio
    const visitasCalificadas = visitasCompletadas.filter(v => v.calificacion);
    const promedio = visitasCalificadas.length > 0
        ? (visitasCalificadas.reduce((sum, v) => sum + v.calificacion, 0) / visitasCalificadas.length).toFixed(1)
        : "0.0";

    const getIconForType = (tipo) => {
        const t = String(tipo || '').trim().toLowerCase();
        if (t.includes('moto')) return 'motorbike';
        if (t.includes('camioneta') || t.includes('pickup') || t.includes('suv')) return 'truck';
        return 'car-side';
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Panel de Control</Text>
            </View>

            <View style={styles.statsRow}>
                {/* Tarjeta de Ingresos */}
                <View style={[styles.card, { borderLeftColor: '#4caf50' }]}>
                    <MaterialCommunityIcons name="currency-usd" size={30} color="#4caf50" />
                    <Text style={styles.statNumber}>${ingresos}</Text>
                    <Text style={styles.statLabel}>Ganancias Hoy</Text>
                </View>

                {/* Tarjeta de Lavados */}
                <View style={[styles.card, { borderLeftColor: '#1a237e' }]}>
                    <MaterialCommunityIcons name="car-wash" size={30} color="#1a237e" />
                    <Text style={styles.statNumber}>{completados}</Text>
                    <Text style={styles.statLabel}>Lavados Hoy</Text>
                </View>

                {/* Tarjeta de Calificación Promedio */}
                <View style={[styles.card, { borderLeftColor: '#ffc107' }]}>
                    <MaterialCommunityIcons name="star-circle" size={30} color="#ffc107" />
                    <Text style={styles.statNumber}>{promedio}</Text>
                    <Text style={styles.statLabel}>Puntuación</Text>
                </View>
            </View>

            {/*NUEVA SECCIÓN: ACTIVIDAD RECIENTE */}
            <Text style={styles.subtitle}>Actividad Reciente</Text>

            <View style={styles.recentList}>
                {visitas.filter(v => v.estado === 'completado').length === 0 ? (
                    <Text style={styles.emptyText}>No hay actividad hoy aún.</Text>
                ) : (
                    visitas.filter(v => v.estado === 'completado').reverse().slice(0, 5).map(visit => (
                        <View key={visit.id} style={styles.recentItem}>
                            <MaterialCommunityIcons name={getIconForType(visit.vehiculo)} size={24} color="#1a237e" />
                            <View style={styles.itemInfo}>
                                <Text style={styles.recentVehicle}>{visit.vehiculo}</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                                    <Text style={styles.recentService}>{visit.tipoLavado}</Text>
                                    {visit.calificacion && (
                                        <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
                                            <MaterialCommunityIcons name="star" size={14} color="#ffc107" />
                                            <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#ffc107', marginLeft: 2 }}>
                                                {visit.calificacion}/5
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            </View>
                        </View>
                    ))
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f0f2f5', padding: 15 },
    header: { marginBottom: 20, marginTop: 10 },
    title: { fontSize: 26, fontWeight: 'bold', color: '#1a237e' },
    statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
    card: {
        backgroundColor: '#fff',
        width: '31%', // Cambiado a 31% para que quepan 3 tarjetas (Dólares, Lavados, Estrellas)
        padding: 10,
        borderRadius: 12,
        borderLeftWidth: 5,
        elevation: 4,
        alignItems: 'center' // Centramos la tarjeta para que quede más simétrica
    },
    statNumber: { fontSize: 20, fontWeight: 'bold', color: '#333', marginVertical: 5 },
    statLabel: { fontSize: 11, color: '#666', textAlign: 'center' },


    subtitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 15 },
    recentList: { backgroundColor: '#fff', borderRadius: 12, padding: 10, elevation: 2 },
    recentItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
    itemInfo: { marginLeft: 15 },
    recentVehicle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
    recentService: { fontSize: 13, color: '#777' },
    emptyText: { textAlign: 'center', color: '#aaa', paddingVertical: 20 }
});
