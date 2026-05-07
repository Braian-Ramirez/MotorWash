import React, { useContext } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { UsersContext } from '../application/context/UserContext';

export default function ManageUsersScreen({ navigation }) {
    const { usuarios } = useContext(UsersContext);

    const handleEditRole = (user) => {
        navigation.navigate('EditUserRole', { user });
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>Gestión de Personal y Clientes</Text>

            {usuarios.map(u => (
                <View key={u.id} style={styles.userCard}>
                    <View style={styles.userInfo}>
                        <MaterialCommunityIcons
                            name={u.rol === 'admin' ? "shield-check" : "account"}
                            size={40}
                            color={u.rol === 'admin' ? "#1a237e" : "#555"}
                        />
                        <View style={{ marginLeft: 15 }}>
                            <Text style={styles.userName}>{u.nombre}</Text>
                            <Text style={styles.userRole}>{u.rol.toUpperCase()}</Text>
                        </View>
                    </View>

                    {/* El Admin no puede quitarse el rol a sí mismo por seguridad */}
                    {u.rol !== 'admin' && (
                        <TouchableOpacity
                            style={styles.editButton}
                            onPress={() => handleEditRole(u)}
                        >
                            <MaterialCommunityIcons name="account-edit" size={24} color="#1a237e" />
                        </TouchableOpacity>
                    )}
                </View>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5', padding: 15 },
    header: { fontSize: 22, fontWeight: 'bold', color: '#1a237e', marginBottom: 20 },
    userCard: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        borderRadius: 12,
        marginBottom: 10,
        elevation: 2,
    },
    userInfo: { flexDirection: 'row', alignItems: 'center' },
    userName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
    userRole: { fontSize: 12, color: '#666' },
    editButton: { padding: 10, backgroundColor: '#e8eaf6', borderRadius: 8 }
});
