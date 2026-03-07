import React from 'react';
// 1. Importamos las herramientas de navegación
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// 2. Importamos nuestras pantallas
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import AddVehicleScreen from './src/screens/AddVehicleScreen';
import NewVisitScreen from './src/screens/NewVisitScreen';
import VisitQRScreen from './src/screens/VisitQRScreen';
// Importamos el grupo de pestañas del cliente
import ClientTabs from './src/screens/navigation/ClientTabs';
import { VehiclesProvider } from './src/screens/context/VehiclesContext';

// 3. Creamos el objeto "Stack" que manejará nuestra pila de pantallas
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    // NavigationContainer debe envolver TODA la aplicación (solo se usa una vez)
    <VehiclesProvider>
      <NavigationContainer>
        {/* Stack.Navigator contiene todas nuestras pantallas */}
        <Stack.Navigator initialRouteName="Login">

          {/* Definimos la primera pantalla: Login */}
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }} // Ocultamos la barra superior (header) en el login
          />

          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{ headerShown: false }} // Ocultamos la barra superior (header) en el registro
          />

          {/* Home ahora carga las pestañas en lugar de una pantalla simple */}
          <Stack.Screen
            name="Home"
            component={ClientTabs}
            options={{ headerShown: false }} // Ocultamos el header del Stack porque el Tab ya trae el suyo
          />

          <Stack.Screen name="AddVehicle"
            component={AddVehicleScreen}
            options={{ title: 'Agregar Vehículo' }}
          />

          <Stack.Screen name="NewVisit"
            component={NewVisitScreen}
            options={{ title: 'Agendar Visita' }}
          />

          <Stack.Screen name="VisitQR"
            component={VisitQRScreen}
            options={{ title: 'Tu Código QR', headerShown: false }} // Sin header para que se vea más limpio
          />

        </Stack.Navigator>
      </NavigationContainer>
    </VehiclesProvider>
  );
}
