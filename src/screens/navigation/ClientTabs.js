import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// 1. Importamos la librería de íconos (usaremos MaterialCommunityIcons que tiene muchos de autos)
import { MaterialCommunityIcons } from '@expo/vector-icons';

import ProfileScreen from '../ProfileScreen';
import VehiclesScreen from '../VehiclesScreen';
import AgendaScreen from '../AgendaScreen';

const Tab = createBottomTabNavigator();

export default function ClientTabs() {
    return (
        <Tab.Navigator
            // 2. Aquí añadimos la lógica para mostrar el ícono correcto según el nombre de la pestaña
            screenOptions={({ route }) => ({
                headerTitleAlign: 'center',
                tabBarActiveTintColor: '#0066cc',
                tabBarInactiveTintColor: 'gray',
                // Esto define el ícono para cada pestaña
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    // Si el nombre de la ruta es...
                    if (route.name === 'Vehículos') {
                        // Usa el icono del auto si está seleccionado (focused), o solo el contorno si no
                        iconName = focused ? 'car' : 'car-outline';
                    } else if (route.name === 'Agenda') {
                        iconName = focused ? 'calendar' : 'calendar-outline';
                    } else if (route.name === 'Perfil') {
                        iconName = focused ? 'account' : 'account-outline';
                    }

                    // Retornamos el componente del ícono para que React Navigation lo dibuje
                    return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
                },
            })}
        >
            <Tab.Screen name="Vehículos" component={VehiclesScreen} />
            <Tab.Screen name="Agenda" component={AgendaScreen} />
            <Tab.Screen name="Perfil" component={ProfileScreen} />
        </Tab.Navigator>
    );
}
