import React, { useState, useContext } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
// Importamos el Picker que instalaste
import { Picker } from '@react-native-picker/picker';
import { VehiclesContext } from './context/VehiclesContext';

// Ahora recibimos "route" además de "navigation"
export default function AddVehicleScreen({ route, navigation }) {

    // 1. PRIMERO: Extraemos el vehículo de la maleta (si es que viene uno para editar)
    const vehiculoAEditar = route.params?.vehiculoAEditar;

    // 2. SEGUNDO: Sacamos las funciones de la nube (Asegúrate que terminen en 'e', no en 'o')
    const { addVehicle, updateVehicle } = useContext(VehiclesContext);

    // Estados para cada uno de los campos
    // Si viene un vehículo a editar, usamos sus datos. Si no, usamos texto vacío (Modo Agregar)
    const [tipo, setTipo] = useState(vehiculoAEditar ? vehiculoAEditar.tipo : 'Carro');
    const [color, setColor] = useState(vehiculoAEditar ? vehiculoAEditar.color : '');
    const [marca, setMarca] = useState(vehiculoAEditar ? vehiculoAEditar.marca : '');
    const [placa, setPlaca] = useState(vehiculoAEditar ? vehiculoAEditar.placa : '');

    const handleSave = () => {
        if (!color || !marca || !placa) {
            Alert.alert("Error", "Todos los campos son obligatorios.");
            return;
        }

        // Creamos el objeto con los datos de los inputs
        const datosVehiculo = { tipo, color, marca, placa };

        if (vehiculoAEditar) {
            // SI ESTAMOS EDITANDO: 
            // Le pasamos el ID que ya tenía para que el contexto sepa cuál reemplazar
            updateVehicle({ ...datosVehiculo, id: vehiculoAEditar.id });
            Alert.alert('Éxito', 'Vehículo actualizado con éxito.');
        } else {
            // SI ES NUEVO:
            addVehicle(datosVehiculo);
            Alert.alert('Éxito', 'Vehículo guardado con éxito.');
        }

        navigation.goBack();
    };


    return (
        <View style={styles.container}>
            {/* El Título cambia dinámicamente según si estamos editando o agredando */}
            <Text style={styles.title}>
                {vehiculoAEditar ? 'Editar Vehículo' : 'Nuevo Vehículo'}
            </Text>

            <View style={styles.pickerContainer}>
                <Text style={styles.label}>Tipo de Vehículo:</Text>
                <Picker
                    selectedValue={tipo}
                    onValueChange={(itemValue) => setTipo(itemValue)}
                    style={styles.picker}
                >
                    <Picker.Item label="Carro" value="Carro" />
                    <Picker.Item label="Camioneta" value="Camioneta" />
                    <Picker.Item label="Motocicleta" value="Moto" />
                </Picker>
            </View>

            <TextInput style={styles.input} placeholder="Color (Ej: Rojo)" value={color} onChangeText={setColor} />
            <TextInput style={styles.input} placeholder="Marca (Ej: Toyota)" value={marca} onChangeText={setMarca} />
            <TextInput style={styles.input} placeholder="Placa (Ej: ABC-123)" value={placa} onChangeText={setPlaca} autoCapitalize="characters" />

            <TouchableOpacity style={styles.buttonPrimary} onPress={handleSave}>
                <Text style={styles.buttonText}>
                    {vehiculoAEditar ? 'Actualizar Vehículo' : 'Guardar Vehículo'}
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5', padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', color: '#003366', marginBottom: 20, textAlign: 'center' },
    pickerContainer: { marginBottom: 15 },
    label: { fontSize: 16, color: '#333', marginBottom: 5, fontWeight: 'bold' },
    picker: { backgroundColor: '#fff', height: 50, borderRadius: 8, borderWidth: 1, borderColor: '#ddd' },
    input: { width: '100%', height: 50, backgroundColor: '#fff', borderRadius: 8, paddingHorizontal: 15, marginBottom: 15, borderWidth: 1, borderColor: '#ddd' },
    buttonPrimary: { width: '100%', height: 50, backgroundColor: '#4caf50', justifyContent: 'center', alignItems: 'center', borderRadius: 8, marginTop: 10 },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});
