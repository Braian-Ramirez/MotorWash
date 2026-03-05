import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';

export default function RegisterScreen({ navigation }) {
    // En tu diseño, el registro pide Nombre, Correo, Contraseña y Confirmar Contraseña
    const [nombre, setNombre] = useState('');
    const [telefono, setTelefono] = useState('');
    const [correo, setCorreo] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleRegister = () => {
        // Aquí en el futuro enviarías los datos a la base de datos
        console.log("Registrando a:", nombre, correo);

        // Por ahora, simularemos que al registrarse se devuelve a la pantalla de Login
        alert('¡Usuario creado con éxito!');
        navigation.navigate('Login');
    };

    const handleBackToLogin = () => {
        // navigation.goBack() simplemente regresa a la pantalla anterior de la pila (como la flecha de atrás del navegador)
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Crear Usuario</Text>

            <TextInput style={styles.input} placeholder="Nombre:" value={nombre} onChangeText={setNombre} />
            <TextInput style={styles.input} placeholder="Telefono:" value={telefono} onChangeText={setTelefono} />
            <TextInput style={styles.input} placeholder="Correo:" value={correo} onChangeText={setCorreo} keyboardType="email-address" autoCapitalize="none" />
            <TextInput style={styles.input} placeholder="Contraseña:" value={password} onChangeText={setPassword} secureTextEntry={true} />
            <TextInput style={styles.input} placeholder="Conf. Contraseña:" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry={true} />

            {/* Botón Principal: Crear Usuario */}
            <TouchableOpacity style={styles.buttonPrimary} onPress={handleRegister}>
                <Text style={styles.buttonText}>Crear Usuario</Text>
            </TouchableOpacity>

            {/* Botón Secundario: Volver al Login */}
            <TouchableOpacity style={styles.buttonSecondary} onPress={handleBackToLogin}>
                <Text style={styles.buttonTextSecondary}>Ya tengo cuenta, iniciar sesión</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5', alignItems: 'center', justifyContent: 'center', padding: 20 },
    title: { fontSize: 32, fontWeight: 'bold', color: '#003366', marginBottom: 40 },
    input: { width: '100%', height: 50, backgroundColor: '#fff', borderRadius: 8, paddingHorizontal: 15, marginBottom: 15, borderWidth: 1, borderColor: '#ddd' },
    buttonPrimary: { width: '100%', height: 50, backgroundColor: '#3b5998', justifyContent: 'center', alignItems: 'center', borderRadius: 8, marginTop: 10 },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    buttonSecondary: { width: '100%', height: 50, backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'center', marginTop: 15 },
    buttonTextSecondary: { color: '#3b5998', fontSize: 16, fontWeight: 'bold', textDecorationLine: 'underline' }
});
