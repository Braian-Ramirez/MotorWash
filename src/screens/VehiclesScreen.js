import React, { useState } from 'react';
// ScrollView permite que la pantalla se pueda deslizar si hay muchas tarjetas
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function VehiclesScreen({ navigation }) {
    // Simulamos una base de datos con los dos vehículos iniciales de tu PDF
    const [vehiculos, setVehiculos] = useState([
        { id: 1, tipo: 'Carro', color: 'Rojo', marca: 'Toyota', placa: 'ABC-123' },
        { id: 2, tipo: 'Camioneta', color: 'Gris', marca: 'Ford', placa: 'XYZ-987' },
    ]);

    // Funciones vacías para cuando toquemos los botones
    const handleEdit = (vehiculo) => {
        // En vez de solo hacer print, navegamos a AddVehicle y le enviamos el objeto entero
        navigation.navigate('AddVehicle', { vehiculoAEditar: vehiculo });
    };

    const handleAddVehicle = () => {
        console.log("Pantalla de agregar vehículo");
        navigation.navigate('AddVehicle');
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>

            {/* Dibujo del carro arriba */}
            <View style={styles.headerIconContainer}>
                <MaterialCommunityIcons name="car-wash" size={100} color="#b3d4ff" />
            </View>

            {/* .map() toma nuestro arreglo y crea una tarjeta <View> por cada auto */}
            {vehiculos.map((vehiculo, index) => (
                // La "key" es obligatoria en React al hacer map() para saber qué elemento es cuál
                <View key={vehiculo.id} style={styles.card}>

                    <View style={styles.cardHeader}>
                        <Text style={styles.cardTitle}>Vehículo #{index + 1}</Text>
                        <MaterialCommunityIcons name="car-side" size={24} color="#0066cc" />
                    </View>

                    <Text style={styles.cardText}>Tipo: <Text style={styles.cardData}>{vehiculo.tipo}</Text></Text>
                    <Text style={styles.cardText}>Color: <Text style={styles.cardData}>{vehiculo.color}</Text></Text>
                    <Text style={styles.cardText}>Marca: <Text style={styles.cardData}>{vehiculo.marca}</Text></Text>
                    <Text style={styles.cardText}>Placa: <Text style={styles.cardData}>{vehiculo.placa}</Text></Text>

                    {/* Botón Editar que está dentro de cada tarjeta */}
                    <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(vehiculo)}>
                        <Text style={styles.editButtonText}>Editar</Text>
                    </TouchableOpacity>

                </View>
            ))}

            {/* Botón verde para Agregar (fuera de las tarjetas) */}
            <TouchableOpacity style={styles.addButton} onPress={handleAddVehicle}>
                <Text style={styles.addButtonText}>Agregar nuevo vehículo</Text>
            </TouchableOpacity>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5', // Fondo gris claro
    },
    contentContainer: {
        padding: 20,
        alignItems: 'center', // Centra todo lo general
    },
    headerIconContainer: {
        marginBottom: 20,
        padding: 20,
        backgroundColor: '#e6f0fa',
        borderRadius: 80, // Circulo perfecto
    },
    card: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        // Sombras para que parezca una tarjeta real flotando
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        borderLeftWidth: 5,
        borderLeftColor: '#0066cc', // Borde azulito a la izquierda
    },
    cardHeader: {
        flexDirection: 'row', // Título y carrito en la misma línea
        justifyContent: 'space-between', // Separados a los extremos
        alignItems: 'center',
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingBottom: 5,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    cardText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 5,
    },
    cardData: {
        fontWeight: 'bold', // Hace que "Rojo" o "Toyota" resalte
        color: '#000',
    },
    editButton: {
        alignSelf: 'flex-end', // Empuja el botón a la derecha
        paddingVertical: 6,
        paddingHorizontal: 15,
        backgroundColor: '#f0f0f0', // Gris claro
        borderRadius: 5,
        marginTop: 5,
    },
    editButtonText: {
        color: '#0066cc',
        fontWeight: 'bold',
    },
    addButton: {
        width: '80%',
        backgroundColor: '#4caf50', // Color verde
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 30, // Para que el scroll baje lo suficiente
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    }
});
