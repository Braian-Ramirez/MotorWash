import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// 1. REUTILIZAMOS pantallas por ahora para que el código funcione
// Luego las cambiaremos por las reales de Admin
import ProfileScreen from '../screens/ProfileScreen';
import StatsScreen from '../screens/StatsScreen';
import ManageUsersScreen from '../screens/ManageUsersScreen';
import ManageServicesScreen from '../screens/ManageServicesScreen';

const Tab = createBottomTabNavigator();

export default function AdminTabs() {
    return (
        <Tab.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: '#1a237e' }, // Un azul más oscuro para el Admin
                headerTintColor: '#fff',
                tabBarActiveTintColor: '#1a237e',
            }}
        >
            {/* 📊 Pestaña 1: ESTADÍSTICAS */}
            <Tab.Screen
                name="Estadísticas"
                component={StatsScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="chart-bar" color={color} size={size} />
                    ),
                }}
            />

            {/* 👥 Pestaña 2: USUARIOS */}
            <Tab.Screen
                name='Gestión Usuarios'
                component={ManageUsersScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="account-group" color={color} size={size} />
                    ),
                }}
            />

            {/* 🚿 Pestaña 3: SERVICIOS */}
            <Tab.Screen
                name='Servicios'
                component={ManageServicesScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="car-wash" color={color} size={size} />
                    )
                }}
            />

            {/* 👤 Pestaña 4: MI PERFIL */}
            <Tab.Screen
                name="Perfil"
                component={ProfileScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="account-cog" color={color} size={size} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}
