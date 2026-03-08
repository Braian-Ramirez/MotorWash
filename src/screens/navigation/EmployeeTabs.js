import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ProfileScreen from '../ProfileScreen';
import ActiveJobsScreen from '../ActiveJobsScreen';
import HistoryScreen from '../HistoryScreen';

// Pantallas placeholder para el empleado


const Tab = createBottomTabNavigator();

export default function EmployeeTabs() {
    return (
        <Tab.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: '#3b5998' },
                headerTintColor: '#fff',
                tabBarActiveTintColor: '#3b5998',
            }}
        >
            <Tab.Screen
                name="Trabajos"
                component={ActiveJobsScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="clipboard-list-outline" color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen
                name="Historial"
                component={HistoryScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="check-circle-outline" color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen
                name="Perfil"
                component={ProfileScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="account" color={color} size={size} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5', alignItems: 'center', justifyContent: 'center', padding: 20 },
    text: { fontSize: 22, fontWeight: 'bold', color: '#003366', marginTop: 15 },
    subtext: { fontSize: 16, color: '#666', textAlign: 'center', marginTop: 5 }
});
