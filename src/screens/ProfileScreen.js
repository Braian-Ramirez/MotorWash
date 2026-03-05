import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

export default function ProfileScreen({ navigation }) {
    // Simulamos los datos actuales del usuario logueado
    const [nombre, setNombre] = useState('Juan Pérez');
    const [telefono, setTelefono] = useState('555-1234'); // Agregamos el teléfono
    const [correo, setCorreo] = useState('juan.perez@email.com');
    const [password, setPassword] = useState('123456');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [image, setImage] = useState(null); // Estado para la foto de perfil

    // Modo edición: Si es false, los campos son de solo lectura. Si es true, se pueden modificar.
    const [isEditing, setIsEditing] = useState(false);

    const handleSave = () => {
        // Validación: Si estamos editando la contraseña, deben coincidir
        if (password !== confirmPassword && confirmPassword !== '') {
            Alert.alert("Error", "Las contraseñas no coinciden. Por favor verifica.");
            return; // Detenemos el guardado si no coinciden
        }

        console.log("Guardando nuevos datos del perfil:", nombre, telefono, correo);
        setIsEditing(false); // Apagamos el modo edición al guardar
        setConfirmPassword(''); // Limpiamos el campo de confirmar contraseña por seguridad
        // Usamos Alert en lugar de alert para que se vea nativo en el celular
        Alert.alert('Éxito', 'Perfil actualizado con éxito');
    };

    const pickImage = async () => {
        // Pedimos permiso a la galería y abrimos la cámara
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'], // Solo fotos
            allowsEditing: true, // Permite recortar
            aspect: [1, 1], // Un cuadrado perfecto para la foto
            quality: 0.5, // Le baja un poquito la calidad para no pesar tanto
        });

        // Si el usuario no presionó "Cancelar", guardamos la foto
        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const handleDescartar = () => {
        setIsEditing(false);
        setConfirmPassword(''); // Limpiamos el campo si cancela
    };

    const handleLogout = () => {
        console.log("Cerrando sesión...");
        navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
        });
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>

            {/* Foto de Perfil circular */}
            <View style={styles.avatarContainer}>
                {image ? (
                    <Image source={{ uri: image }} style={styles.avatarImage} />
                ) : (
                    <MaterialCommunityIcons name="account-circle" size={120} color="#0066cc" />
                )}

                {/* Botón flotante de camarita (solo visible si editable) */}
                {isEditing && (
                    <TouchableOpacity style={styles.editAvatarButton} onPress={pickImage}>
                        <MaterialCommunityIcons name="camera" size={24} color="#fff" />
                    </TouchableOpacity>
                )}
            </View>

            {/* Inputs del Perfil */}
            <View style={styles.formContainer}>
                <Text style={styles.label}>Nombre:</Text>
                <TextInput
                    style={[styles.input, isEditing ? styles.inputEditable : styles.inputReadonly]}
                    value={nombre}
                    onChangeText={setNombre}
                    editable={isEditing}
                />

                <Text style={styles.label}>Teléfono:</Text>
                <TextInput
                    style={[styles.input, isEditing ? styles.inputEditable : styles.inputReadonly]}
                    value={telefono}
                    onChangeText={setTelefono}
                    editable={isEditing}
                    keyboardType="phone-pad"
                />

                <Text style={styles.label}>Correo:</Text>
                <TextInput
                    style={[styles.input, isEditing ? styles.inputEditable : styles.inputReadonly]}
                    value={correo}
                    onChangeText={setCorreo}
                    editable={isEditing}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                <Text style={styles.label}>Contraseña:</Text>
                <TextInput
                    style={[styles.input, isEditing ? styles.inputEditable : styles.inputReadonly]}
                    value={password}
                    onChangeText={setPassword}
                    editable={isEditing}
                    secureTextEntry={true}
                />

                {/* Mostrar Confirmar Contraseña SOLO si estamos en modo edición */}
                {isEditing && (
                    <>
                        <Text style={styles.label}>Confirmar Contraseña:</Text>
                        <TextInput
                            style={[styles.input, styles.inputEditable]}
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry={true}
                            placeholder="Repite tu nueva contraseña"
                        />
                    </>
                )}
            </View>

            {/* Botones dinámicos según el modo */}
            {isEditing ? (
                // Si está editando, mostramos Guardar y Descartar
                <View style={styles.buttonRow}>
                    <TouchableOpacity style={[styles.actionButton, styles.saveButton]} onPress={handleSave}>
                        <Text style={styles.buttonTextWhite}>Guardar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.actionButton, styles.cancelButton]} onPress={handleDescartar}>
                        <Text style={styles.buttonTextWhite}>Descartar</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                // Si no está editando, mostramos Editar y Cerrar Sesión
                <View style={styles.buttonColumn}>
                    <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}>
                        <Text style={styles.buttonTextBlue}>Editar Perfil</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                        <Text style={styles.buttonTextRed}>Cerrar Sesión</Text>
                    </TouchableOpacity>
                </View>
            )}

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    contentContainer: { padding: 20, alignItems: 'center' },
    avatarContainer: {
        marginBottom: 30,
        backgroundColor: '#e6f0fa',
        borderRadius: 100, // Lo mantiene circular
        padding: 5,
        elevation: 4,
        position: 'relative', // Para poder poner la camarita sobre el avatar
    },
    avatarImage: {
        width: 120,
        height: 120,
        borderRadius: 60, // Mitad del ancho para que sea circular perfecto
    },
    editAvatarButton: {
        position: 'absolute',
        bottom: 5,
        right: 0,
        backgroundColor: '#0066cc', // Azul
        padding: 8,
        borderRadius: 20, // Circular
        elevation: 5, // Sombrita
    },
    formContainer: {
        width: '100%',
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
        marginLeft: 5,
    },
    // Añadida la lógica de opacidad si no es editable
    input: {
        width: '100%',
        height: 50,
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 15,
        fontSize: 16,
        color: '#333',
    },
    inputReadonly: {
        backgroundColor: 'transparent',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        color: '#666', // Texto un poco más gris cuando no se edita
    },
    inputEditable: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#0066cc',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 10,
    },
    actionButton: {
        width: '48%',
        height: 45,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
    },
    saveButton: { backgroundColor: '#4caf50' },
    cancelButton: { backgroundColor: '#f44336' },
    buttonColumn: {
        width: '100%',
        alignItems: 'center',
        marginTop: 20,
    },
    editButton: {
        width: '80%',
        height: 50,
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: '#0066cc',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        marginBottom: 15,
    },
    logoutButton: {
        width: '80%',
        height: 50,
        backgroundColor: '#ffebeb',
        borderWidth: 2,
        borderColor: '#f44336',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
    },
    buttonTextWhite: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    buttonTextBlue: { color: '#0066cc', fontSize: 16, fontWeight: 'bold' },
    buttonTextRed: { color: '#f44336', fontSize: 16, fontWeight: 'bold' },
});
