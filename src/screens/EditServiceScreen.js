import React, { useState, useContext } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { ServicesContext } from '../application/context/ServicesContext';

export default function EditServiceScreen({ route, navigation }) {
    const servicioAEditar = route.params?.servicioAEditar;
    const { agregarServicio, actualizarServicio } = useContext(ServicesContext);

    // TAREA: Crea los estados para 'titulo', 'descripcion' y 'precio'
    // Recuerda usar los datos de servicioAEditar si existen
    const [titulo, setTitulo] = useState(servicioAEditar ? servicioAEditar.titulo : '');
    const [descripcion, setDescripcion] = useState(servicioAEditar ? servicioAEditar.descripcion : '');
    const [precio, setPrecio] = useState(servicioAEditar ? servicioAEditar.precio.toString() : '');
    const [tiempoEstimado, setTiempoEstimado] = useState(servicioAEditar && servicioAEditar.tiempoEstimado ? servicioAEditar.tiempoEstimado.toString() : '');
    const [tipoVehiculo, setTipoVehiculo] = useState(servicioAEditar && servicioAEditar.tipoVehiculo ? servicioAEditar.tipoVehiculo : 'Todos');

    const handleSave = () => {
        // TAREA: Valida que los campos no estén vacíos
        if (!titulo || !descripcion || !precio || !tiempoEstimado) {
            Alert.alert("Error", "Todos los campos (incluyendo el tiempo estimado) son obligatorios.");
            return;
        }

        const datos = { 
            titulo, 
            descripcion, 
            precio: parseFloat(precio),
            tiempoEstimado: parseInt(tiempoEstimado, 10),
            tipoVehiculo
        };

        if (servicioAEditar) {
            actualizarServicio(servicioAEditar.id, datos);
            Alert.alert("Éxito", "Servicio actualizado correctamente.");
        } else {
            agregarServicio(datos);
            Alert.alert("Éxito", "Nuevo servicio agregado.");
        }
        navigation.goBack();
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>{servicioAEditar ? 'Editar Servicio' : 'Nuevo Servicio'}</Text>

            <Text style={styles.label}>Nombre del Servicio:</Text>
            <TextInput style={styles.input} value={titulo} onChangeText={setTitulo} placeholder="Ej: Lavado de Motor" />

            <Text style={styles.label}>Descripción:</Text>
            <TextInput style={styles.input} value={descripcion} onChangeText={setDescripcion} placeholder="Descripción del servicio" />

            <Text style={styles.label}>Precio ($):</Text>
            <TextInput style={styles.input} value={precio} onChangeText={setPrecio} keyboardType="numeric" placeholder="Ej: 15" />

            <Text style={styles.label}>Tiempo Estimado (Minutos):</Text>
            <TextInput style={styles.input} value={tiempoEstimado} onChangeText={setTiempoEstimado} keyboardType="numeric" placeholder="Ej: 45" />

            <Text style={styles.label}>Aplica para Vehículo:</Text>
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={tipoVehiculo}
                    onValueChange={(itemValue) => setTipoVehiculo(itemValue)}
                    style={styles.picker}
                >
                    <Picker.Item label="Todos los Vehículos" value="Todos" />
                    <Picker.Item label="Moto" value="Moto" />
                    <Picker.Item label="Carro" value="Carro" />
                    <Picker.Item label="Camioneta" value="Camioneta" />
                </Picker>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleSave}>
                <Text style={styles.buttonText}>Guardar Cambios</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5', padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', color: '#1a237e', marginBottom: 20, textAlign: 'center' },
    label: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 5 },
    input: { backgroundColor: '#fff', borderRadius: 8, padding: 15, marginBottom: 15, borderWidth: 1, borderColor: '#ddd' },
    pickerContainer: { backgroundColor: '#fff', borderRadius: 8, marginBottom: 15, borderWidth: 1, borderColor: '#ddd', height: 55, justifyContent: 'center' },
    picker: { width: '100%' },
    button: { backgroundColor: '#1a237e', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10, marginBottom: 40 },
    buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});
