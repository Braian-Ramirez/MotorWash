import React, { useState, useContext } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, Modal } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AuthContext } from '../application/context/AuthContext';

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const { login, user } = useContext(AuthContext);

    // Efecto para navegar automáticamente cuando el usuario esté cargado
    React.useEffect(() => {
        console.log("[LoginScreen] Efecto de usuario disparado. Usuario actual:", user?.email);
        if (user) {
            console.log("[LoginScreen] Navegando según rol:", user.role);
            if (user.role === 'admin') {
                navigation.navigate('AdminHome');
            } else if (user.role === 'employee') {
                navigation.navigate('EmployeeHome');
            } else {
                navigation.navigate('Home');
            }
        }
    }, [user]);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Por favor ingresa correo y contraseña.");
            return;
        }

        console.log("[LoginScreen] Intentando login para:", email);
        setLoading(true);
        const result = await login(email, password);
        console.log("[LoginScreen] Resultado del login:", result.success ? "ÉXITO" : "ERROR", result.error || "");
        setLoading(false);

        if (!result.success) {
            if (result.code === 'auth/user-not-found' || result.code === 'auth/invalid-credential') {
                setShowModal(true);
            } else {
                Alert.alert("Error de Inicio de Sesión", result.error);
            }
        }
    };

    const handleRegister = () => {
        console.log("Ir a registrarse");
        navigation.navigate('Register');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>MotorWash</Text>

            <TextInput
                style={styles.input}
                placeholder="Correo electrónico"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            <TextInput
                style={styles.input}
                placeholder="Contraseña"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={true}
            />

            <TouchableOpacity 
                style={[styles.buttonPrimary, loading && { opacity: 0.7 }]} 
                onPress={handleLogin}
                disabled={loading}
            >
                <Text style={styles.buttonText}>
                    {loading ? 'Cargando...' : 'Iniciar Sesión'}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttonSecondary} onPress={handleRegister}>
                <Text style={styles.buttonTextSecondary}>Registrarse</Text>
            </TouchableOpacity>

            {/* Modal de Usuario No Registrado */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={showModal}
                onRequestClose={() => setShowModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalIconContainer}>
                            <MaterialCommunityIcons name="account-search-outline" size={60} color="#003366" />
                        </View>
                        <Text style={styles.modalTitle}>¡Ups! No te encontramos</Text>
                        <Text style={styles.modalText}>
                            Parece que no tienes una cuenta con nosotros. ¿Te gustaría registrarte para empezar a lavar tu motor?
                        </Text>
                        
                        <TouchableOpacity 
                            style={styles.modalButtonPrimary} 
                            onPress={() => {
                                setShowModal(false);
                                navigation.navigate('Register');
                            }}
                        >
                            <Text style={styles.modalButtonText}>Registrarme ahora</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={styles.modalButtonSecondary} 
                            onPress={() => setShowModal(false)}
                        >
                            <Text style={styles.modalButtonTextSecondary}>Intentar de nuevo</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#003366',
        marginBottom: 40,
    },
    input: {
        width: '100%',
        height: 50,
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    buttonPrimary: {
        width: '100%',
        height: 50,
        backgroundColor: '#3b5998',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    buttonSecondary: {
        width: '100%',
        height: 50,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 15,
    },
    buttonTextSecondary: {
        color: '#3b5998',
        fontSize: 16,
        fontWeight: 'bold',
    },
    // Estilos del Modal
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '85%',
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 25,
        alignItems: 'center',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    modalIconContainer: {
        backgroundColor: '#f0f4f8',
        padding: 20,
        borderRadius: 50,
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#003366',
        marginBottom: 10,
        textAlign: 'center',
    },
    modalText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 25,
        lineHeight: 22,
    },
    modalButtonPrimary: {
        width: '100%',
        height: 50,
        backgroundColor: '#003366',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    modalButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalButtonSecondary: {
        width: '100%',
        height: 50,
        backgroundColor: 'transparent',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
    },
    modalButtonTextSecondary: {
        color: '#666',
        fontSize: 16,
        fontWeight: '600',
    },
});
