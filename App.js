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
import QRScannerScreen from './src/screens/QRScannerScreen';
import ManageServicesScreen from './src/screens/ManageServicesScreen';
import EditServiceScreen from './src/screens/EditServiceScreen';
import EditUserRoleScreen from './src/screens/EditUserRoleScreen';

// Importamos el grupo de pestañas
import ClientTabs from './src/navigation/ClientTabs';
import EmployeeTabs from './src/navigation/EmployeeTabs';
import AdminTabs from './src/navigation/AdminTabs';

// Contextos
import { VehiclesProvider } from './src/context/VehiclesContext';
import { VisitsProvider } from './src/context/VisitsContext';
import { AuthProvider } from './src/context/AuthContext';
import { UsersProvider } from './src/context/UserContext';
import { ServicesProvider } from './src/context/ServicesContext';

// 3. Creamos el objeto "Stack" que manejará nuestra pila de pantallas
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <ServicesProvider>
      <UsersProvider>
        <AuthProvider>
          <VehiclesProvider>
            <VisitsProvider>
              <NavigationContainer>
                <Stack.Navigator initialRouteName="Login">

                  <Stack.Screen
                    name="Login"
                    component={LoginScreen}
                    options={{ headerShown: false }}
                  />

                  <Stack.Screen
                    name="Register"
                    component={RegisterScreen}
                    options={{ headerShown: false }}
                  />

                  {/* Pantalla principal para Clientes */}
                  <Stack.Screen
                    name="Home"
                    component={ClientTabs}
                    options={{ headerShown: false }}
                  />

                  {/* Pantalla principal para Empleados */}
                  <Stack.Screen
                    name="EmployeeHome"
                    component={EmployeeTabs}
                    options={{ headerShown: false }}
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
                    options={{ title: 'Tu Código QR', headerShown: false }}
                  />

                  <Stack.Screen name="ScanQR"
                    component={QRScannerScreen}
                    options={{ title: 'Escanea código QR' }}
                  />

                  {/* Pantalla principal para Administradores */}
                  <Stack.Screen
                    name="AdminHome"
                    component={AdminTabs}
                    options={{ headerShown: false }}
                  />

                  <Stack.Screen name="ManageServices"
                    component={ManageServicesScreen}
                    options={{ title: 'Gestionar Servicios' }}
                  />

                  <Stack.Screen name="EditService"
                    component={EditServiceScreen}
                    options={{ title: 'Editar Servicio' }}
                  />
                  <Stack.Screen name="EditUserRole"
                    component={EditUserRoleScreen}
                    options={{ title: 'Cambiar Rol de Usuario' }}
                  />
                </Stack.Navigator>
              </NavigationContainer>
            </VisitsProvider>
          </VehiclesProvider>
        </AuthProvider>
      </UsersProvider>
    </ServicesProvider>
  );
}
