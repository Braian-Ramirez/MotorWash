import React, { useContext, useState, useMemo } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker'; // Importamos el selector
import { VisitsContext } from '../application/context/VisitsContext';
import { ServicesContext } from '../application/context/ServicesContext';

export default function StatsScreen() {
    const { visitas } = useContext(VisitsContext);
    const { servicios } = useContext(ServicesContext);

    // Estados para los filtros
    const [filtroEmpleado, setFiltroEmpleado] = useState('Todos');
    const [filtroTiempo, setFiltroTiempo] = useState('Todos');

    // 1. Obtener una lista dinámica de empleados que SÍ han lavado carros
    const empleadosUnicos = useMemo(() => {
        const completadas = visitas.filter(v => v.estado === 'completado' && v.encargado);
        const nombres = completadas.map(v => v.encargado);
        return ['Todos', ...new Set(nombres)]; // El set borra los duplicados mágicamente
    }, [visitas]);

    // 2. Motor de Filtrado Cruzado (Tiempo + Empleado)
    const visitasFiltradas = useMemo(() => {
        let base = visitas.filter(v => v.estado === 'completado');
        
        // Aplica filtro de empleado
        if (filtroEmpleado !== 'Todos') {
            base = base.filter(v => v.encargado === filtroEmpleado);
        }

        // Aplica filtro de tiempo
        if (filtroTiempo !== 'Todos') {
            const hoy = new Date();
            base = base.filter(v => {
                // Tratamos de buscar la fecha exacta en la que se creó o inició el lavado
                const fechaStr = v.fechaCreado || v.horaInicio || null; 
                if (!fechaStr) return true; // Si no tiene fecha, lo mostramos por si acaso
                
                const fechaVisita = new Date(fechaStr);
                if (isNaN(fechaVisita.getTime())) return true;
                
                if (filtroTiempo === 'Hoy') {
                    return fechaVisita.toDateString() === hoy.toDateString();
                } else if (filtroTiempo === 'Semana') {
                    const diffDias = (hoy - fechaVisita) / (1000 * 60 * 60 * 24);
                    return diffDias <= 7;
                } else if (filtroTiempo === 'Mes') {
                    const diffDias = (hoy - fechaVisita) / (1000 * 60 * 60 * 24);
                    return diffDias <= 30;
                }
                return true;
            });
        }
        return base;
    }, [visitas, filtroEmpleado, filtroTiempo]);

    // -----------------------------------------------------
    // 3. RECÁLCULO DE KPIs BASADO EN EL FILTRO RESULTANTE
    // -----------------------------------------------------
    const completados = visitasFiltradas.length;

    const sumaIngresos = visitasFiltradas.reduce((sum, v) => {
        if (v.precio !== undefined) return sum + v.precio;
        const servicioMatch = servicios.find(s => s.titulo === v.tipoLavado);
        return sum + (servicioMatch ? servicioMatch.precio : 0);
    }, 0);

    // Formateador UI "Estilo Redes Sociales" para ahorrar espacio visual
    let ingresosFormateados = sumaIngresos.toLocaleString();
    if (sumaIngresos >= 1000000) {
        ingresosFormateados = (sumaIngresos / 1000000).toFixed(1) + 'M';
    } else if (sumaIngresos >= 1000) {
        ingresosFormateados = (sumaIngresos / 1000).toFixed(1) + 'k';
    }

    const visitasCalificadas = visitasFiltradas.filter(v => v.calificacion);
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

            {/* SECCIÓN DE FILTROS SUPERIORES */}
            <View style={styles.filtersContainer}>
                <View style={styles.filterBox}>
                    <Text style={styles.filterLabel}>Tiempo:</Text>
                    <View style={styles.pickerWrapper}>
                        <Picker selectedValue={filtroTiempo} onValueChange={setFiltroTiempo} style={styles.picker}>
                            <Picker.Item label="Todos" value="Todos" />
                            <Picker.Item label="Hoy" value="Hoy" />
                            <Picker.Item label="7 días" value="Semana" />
                            <Picker.Item label="30 días" value="Mes" />
                        </Picker>
                    </View>
                </View>

                <View style={styles.filterBox}>
                    <Text style={styles.filterLabel}>Empleado:</Text>
                    <View style={styles.pickerWrapper}>
                        <Picker selectedValue={filtroEmpleado} onValueChange={setFiltroEmpleado} style={styles.picker}>
                            {empleadosUnicos.map(emp => (
                                <Picker.Item key={emp} label={emp} value={emp} />
                            ))}
                        </Picker>
                    </View>
                </View>
            </View>

            {/* KPIs RECIENTEMENTE FILTRADOS */}
            <View style={styles.statsRow}>
                <View style={[styles.card, { borderLeftColor: '#4caf50' }]}>
                    <MaterialCommunityIcons name="currency-usd" size={30} color="#4caf50" />
                    <Text style={styles.statNumber}>${ingresosFormateados}</Text>
                    <Text style={styles.statLabel}>Ganancias</Text>
                </View>

                <View style={[styles.card, { borderLeftColor: '#1a237e' }]}>
                    <MaterialCommunityIcons name="car-wash" size={30} color="#1a237e" />
                    <Text style={styles.statNumber}>{completados}</Text>
                    <Text style={styles.statLabel}>Lavados</Text>
                </View>

                <View style={[styles.card, { borderLeftColor: '#ffc107' }]}>
                    <MaterialCommunityIcons name="star-circle" size={30} color="#ffc107" />
                    <Text style={styles.statNumber}>{promedio}</Text>
                    <Text style={styles.statLabel}>Puntuación</Text>
                </View>
            </View>

            {/* ACTIVIDAD RECIENTE */}
            <Text style={styles.subtitle}>Actividad Reciente ({completados})</Text>

            <View style={styles.recentList}>
                {visitasFiltradas.length === 0 ? (
                    <Text style={styles.emptyText}>No hay resultados con estos filtros.</Text>
                ) : (
                    visitasFiltradas.reverse().slice(0, 10).map(visit => ( // Mostramos hasta 10 para más detalle
                        <View key={visit.id} style={styles.recentItem}>
                            <MaterialCommunityIcons name={getIconForType(visit.vehiculo)} size={24} color="#1a237e" />
                            
                            <View style={styles.itemInfo}>
                                <Text style={styles.recentVehicle}>{visit.vehiculo}</Text>
                                
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 3 }}>
                                    <Text style={styles.recentService}>{visit.tipoLavado}</Text>
                                    
                                    {/* MUESTRA DEL EMPLEADO QUE REALIZÓ EL LAVADO */}
                                    <Text style={styles.recentEmployee}> • 👤 {visit.encargado || 'Sin asignar'}</Text>
                                </View>

                                {visit.calificacion ? (
                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                                        <MaterialCommunityIcons name="star" size={14} color="#ffc107" />
                                        <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#ffc107', marginLeft: 2 }}>
                                            {visit.calificacion}/5
                                        </Text>
                                        {visit.comentario ? (
                                            <Text style={styles.commentText} numberOfLines={1}> - "{visit.comentario}"</Text>
                                        ) : null}
                                    </View>
                                ) : null}
                            </View>
                        </View>
                    ))
                )}
            </View>
            <View style={{height: 40}} />{/* Espaciador Final */}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f0f2f5', padding: 15 },
    header: { marginBottom: 15, marginTop: 10 },
    title: { fontSize: 26, fontWeight: 'bold', color: '#1a237e' },
    
    // Filtros
    filtersContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
    filterBox: { width: '48%' },
    filterLabel: { fontSize: 12, fontWeight: 'bold', color: '#555', marginBottom: 5, marginLeft: 2 },
    pickerWrapper: { backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#ddd', height: 45, justifyContent: 'center' },
    picker: { width: '100%', height: '100%' },

    // KPIs
    statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
    card: { backgroundColor: '#fff', width: '31%', padding: 10, borderRadius: 12, borderLeftWidth: 5, elevation: 4, alignItems: 'center' },
    statNumber: { fontSize: 20, fontWeight: 'bold', color: '#333', marginVertical: 5 },
    statLabel: { fontSize: 11, color: '#666', textAlign: 'center' },

    // Lista
    subtitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 15 },
    recentList: { backgroundColor: '#fff', borderRadius: 12, padding: 10, elevation: 2 },
    recentItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
    itemInfo: { marginLeft: 15, flex: 1 },
    recentVehicle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
    recentService: { fontSize: 13, color: '#555', fontWeight: 'bold' },
    recentEmployee: { fontSize: 12, color: '#777', fontStyle: 'italic' },
    commentText: { fontSize: 12, color: '#888', fontStyle: 'italic', flexShrink: 1 },
    emptyText: { textAlign: 'center', color: '#aaa', paddingVertical: 20 }
});
