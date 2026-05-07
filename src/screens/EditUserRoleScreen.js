import React, { useState, useContext } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { UsersContext } from '../application/context/UserContext';

export default function EditUserRoleScreen({ route, navigation }) {
    const { user } = route.params;
    const { cambiarRol } = useContext(UsersContext);
    const [nuevoRol, setNuevoRol] = useState(user.rol);

    const handleSave = () => {
        if (nuevoRol === user.rol) {
            navigation.goBack();
            return;
        }

        cambiarRol(user.id, nuevoRol);
        Alert.alert("Éxito", `El rol de ${user.nombre} ha sido actualizado a ${nuevoRol.toUpperCase()}.`);
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <MaterialCommunityIcons
                    name={user.rol === 'admin' ? "shield-check" : "account-circle"}
                    size={80}
                    color="#1a237e"
                    style={styles.icon}
                />
                <Text style={styles.userName}>{user.nombre}</Text>
                <Text style={styles.userEmail}>{user.correo}</Text>

                <View style={styles.divider} />

                <Text style={styles.label}>Seleccionar Nuevo Rol:</Text>
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={nuevoRol}
                        onValueChange={(itemValue) => setNuevoRol(itemValue)}
                    >
                        <Picker.Item label="Cliente" value="client" />
                        <Picker.Item label="Empleado (Lavador)" value="employee" />
                        {user.rol === 'admin' && <Picker.Item label="Administrador" value="admin" />}
                    </Picker>
                </View>

                <Text style={styles.infoText}>
                    * Los empleados tienen acceso a la agenda de lavados y escaneo de QR.
                </Text>

                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.saveButtonText}>Actualizar Rol</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
                    <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5', padding: 20, justifyContent: 'center' },
    card: { backgroundColor: '#fff', borderRadius: 20, padding: 25, elevation: 5, alignItems: 'center' },
    icon: { marginBottom: 15 },
    userName: { fontSize: 22, fontWeight: 'bold', color: '#333' },
    userEmail: { fontSize: 14, color: '#666', marginBottom: 20 },
    divider: { width: '100%', height: 1, backgroundColor: '#eee', marginBottom: 20 },
    label: { fontSize: 16, fontWeight: 'bold', color: '#1a237e', alignSelf: 'flex-start', marginBottom: 10 },
    pickerContainer: { width: '100%', backgroundColor: '#f9f9f9', borderRadius: 10, borderWidth: 1, borderColor: '#ddd', marginBottom: 15 },
    infoText: { fontSize: 12, color: '#888', fontStyle: 'italic', marginBottom: 25, textAlign: 'center' },
    saveButton: { width: '100%', backgroundColor: '#1a237e', padding: 15, borderRadius: 10, alignItems: 'center', marginBottom: 10 },
    saveButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    cancelButton: { width: '100%', padding: 15, alignItems: 'center' },
    cancelButtonText: { color: '#f44336', fontWeight: 'bold' }
});
