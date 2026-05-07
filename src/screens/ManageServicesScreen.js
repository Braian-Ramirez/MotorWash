import React, { useContext } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ServicesContext } from '../application/context/ServicesContext';

export default function ManageServicesScreen({ navigation }) {
    const { servicios, actualizarServicio } = useContext(ServicesContext);

    const handleEditPrice = (servicio) => {

        navigation.navigate('EditService', { servicioAEditar: servicio });
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>Configuración de Precios</Text>

            {servicios.map(s => (
                <View key={s.id} style={styles.serviceCard}>
                    <View style={styles.serviceInfo}>
                        <MaterialCommunityIcons name="spray" size={32} color="#1a237e" />
                        <View style={{ marginLeft: 15, flex: 1 }}>
                            <Text style={styles.serviceTitle}>{s.titulo}</Text>
                            <Text style={styles.serviceDesc}>{s.descripcion}</Text>
                            <Text style={styles.servicePrice}>Precio: ${s.precio}</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 3 }}>
                                <MaterialCommunityIcons name="clock-outline" size={14} color="#666" />
                                <Text style={{ fontSize: 13, color: '#666', marginLeft: 4 }}>
                                    {s.tiempoEstimado ? `${s.tiempoEstimado} min` : 'No definido'}
                                </Text>
                            </View>
                            <View style={styles.badgeContainer}>
                                <Text style={styles.badgeText}>
                                    {s.tipoVehiculo ? `Aplica: ${s.tipoVehiculo}` : 'Aplica: Todos'}
                                </Text>
                            </View>
                        </View>
                    </View>

                    <TouchableOpacity
                        style={styles.priceButton}
                        onPress={() => handleEditPrice(s)}
                    >
                        <MaterialCommunityIcons name="tag-plus" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>
            ))}

            <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('EditService')}>
                <Text style={styles.addButtonText}>+ Agregar Nuevo Servicio</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5', padding: 15 },
    header: { fontSize: 22, fontWeight: 'bold', color: '#1a237e', marginBottom: 20 },
    serviceCard: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        padding: 15,
        borderRadius: 12,
        marginBottom: 12,
        elevation: 3,
        alignItems: 'center'
    },
    serviceInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    serviceTitle: { fontSize: 17, fontWeight: 'bold', color: '#333' },
    serviceDesc: { fontSize: 13, color: '#666', marginVertical: 3 },
    servicePrice: { fontSize: 15, fontWeight: 'bold', color: '#4caf50' },
    badgeContainer: { backgroundColor: '#e8eaf6', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, alignSelf: 'flex-start', marginTop: 5 },
    badgeText: { fontSize: 11, color: '#1a237e', fontWeight: 'bold' },
    priceButton: { backgroundColor: '#1a237e', padding: 10, borderRadius: 8, marginLeft: 10 },
    addButton: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#1a237e',
        borderStyle: 'dashed',
        marginTop: 10,
        alignItems: 'center'
    },
    addButtonText: { color: '#1a237e', fontWeight: 'bold', fontSize: 16 }
});
