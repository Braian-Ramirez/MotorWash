import React, { useContext } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { VisitsContext } from '../context/VisitsContext';

export default function StatsScreen() {
    const { visitas } = useContext(VisitsContext);

    // Cálculos dinámicos
    const completados = visitas.filter(v => v.estado === 'completado').length;
    const ingresos = completados * 20;

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

                {/* Tarjeta de Lavados (CORREGIDA) */}
                <View style={[styles.card, { borderLeftColor: '#1a237e' }]}>
                    <MaterialCommunityIcons name="car-wash" size={30} color="#1a237e" />
                    <Text style={styles.statNumber}>{completados}</Text>
                    <Text style={styles.statLabel}>Vehículos Lavados</Text>
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
                            <MaterialCommunityIcons name="check-circle" size={24} color="#4caf50" />
                            <View style={styles.itemInfo}>
                                <Text style={styles.recentVehicle}>{visit.vehiculo}</Text>
                                <Text style={styles.recentService}>{visit.tipoLavado}</Text>
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
        width: '48%',
        padding: 15,
        borderRadius: 12,
        borderLeftWidth: 5,
        elevation: 4,
    },
    statNumber: { fontSize: 22, fontWeight: 'bold', color: '#333', marginVertical: 5 },
    statLabel: { fontSize: 13, color: '#666' },


    subtitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 15 },
    recentList: { backgroundColor: '#fff', borderRadius: 12, padding: 10, elevation: 2 },
    recentItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
    itemInfo: { marginLeft: 15 },
    recentVehicle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
    recentService: { fontSize: 13, color: '#777' },
    emptyText: { textAlign: 'center', color: '#aaa', paddingVertical: 20 }
});
