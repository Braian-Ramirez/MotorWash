import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
// Importamos el Picker que acabas de instalar
import { Picker } from '@react-native-picker/picker';

export default function AddVehicleScreen({ navigation }) {
    // Estados para cada uno de los campos
    const [tipo, setTipo] = useState('Carro'); // Valor por defecto
    const [color, setColor] = useState('');
    const [marca, setMarca] = useState('');
    const [placa, setPlaca] = useState('');

    const handleSave = () => {
        console.log("Guardando:", tipo, color, marca, placa);
        // Aquí enviaríamos los datos a la base de datos.
        alert('Vehículo guardado con éxito!');
        // Volvemos a la pantalla anterior (Mis Vehículos)
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Nuevo Vehículo</Text>

            <View style={styles.pickerContainer}>
                <Text style={styles.label}>Tipo de Vehículo:</Text>
                {/* Así funciona el Picker: recibe un valor seleccionado y una función para cambiarlo */}
                <Picker
                    selectedValue={tipo}
                    onValueChange={(itemValue) => setTipo(itemValue)}
                    style={styles.picker}
                >
                    {/* Y aquí definimos las opciones del desplegable */}
                    <Picker.Item label="Carro" value="Carro" />
                    <Picker.Item label="Camioneta" value="Camioneta" />
                    <Picker.Item label="Motocicleta" value="Moto" />
                </Picker>
            </View>

            <TextInput style={styles.input} placeholder="Color (Ej: Rojo)" value={color} onChangeText={setColor} />
            <TextInput style={styles.input} placeholder="Marca (Ej: Toyota)" value={marca} onChangeText={setMarca} />
            <TextInput style={styles.input} placeholder="Placa (Ej: ABC-123)" value={placa} onChangeText={setPlaca} autoCapitalize="characters" />

            <TouchableOpacity style={styles.buttonPrimary} onPress={handleSave}>
                <Text style={styles.buttonText}>Guardar Vehículo</Text>
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
