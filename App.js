import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View, Text } from 'react-native';

// Pantallas
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import AddVehicleScreen from './src/screens/AddVehicleScreen';
import NewVisitScreen from './src/screens/NewVisitScreen';
import VisitQRScreen from './src/screens/VisitQRScreen';
import QRScannerScreen from './src/screens/QRScannerScreen';
import ManageServicesScreen from './src/screens/ManageServicesScreen';
import EditServiceScreen from './src/screens/EditServiceScreen';
import EditUserRoleScreen from './src/screens/EditUserRoleScreen';

// Navegación
import ClientTabs from './src/navigation/ClientTabs';
import EmployeeTabs from './src/navigation/EmployeeTabs';
import AdminTabs from './src/navigation/AdminTabs';

// Contextos (Application Layer — Clean Architecture)
import { AuthProvider, AuthContext } from './src/application/context/AuthContext';
import { VehiclesProvider } from './src/application/context/VehiclesContext';
import { VisitsProvider } from './src/application/context/VisitsContext';
import { UsersProvider } from './src/application/context/UserContext';
import { ServicesProvider } from './src/application/context/ServicesContext';

const Stack = createNativeStackNavigator();

const AppContent = () => {
  const { initializing } = React.useContext(AuthContext);

  if (initializing) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' }}>
        <ActivityIndicator size="large" color="#003366" />
        <Text style={{ marginTop: 10, color: '#003366' }}>Cargando MotorWash...</Text>
      </View>
    );
  }

  return (
    <ServicesProvider>
      <UsersProvider>
        <VehiclesProvider>
          <VisitsProvider>
            <NavigationContainer>
              <Stack.Navigator initialRouteName="Login">
                <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Home" component={ClientTabs} options={{ headerShown: false }} />
                <Stack.Screen name="EmployeeHome" component={EmployeeTabs} options={{ headerShown: false }} />
                <Stack.Screen name="AdminHome" component={AdminTabs} options={{ headerShown: false }} />
                
                <Stack.Screen name="AddVehicle" component={AddVehicleScreen} options={{ title: 'Agregar Vehículo' }} />
                <Stack.Screen name="NewVisit" component={NewVisitScreen} options={{ title: 'Agendar Visita' }} />
                <Stack.Screen name="VisitQR" component={VisitQRScreen} options={{ title: 'Tu Código QR', headerShown: false }} />
                <Stack.Screen name="ScanQR" component={QRScannerScreen} options={{ title: 'Escanea QR' }} />
                <Stack.Screen name="ManageServices" component={ManageServicesScreen} options={{ title: 'Gestionar Servicios' }} />
                <Stack.Screen name="EditService" component={EditServiceScreen} options={{ title: 'Editar Servicio' }} />
                <Stack.Screen name="EditUserRole" component={EditUserRoleScreen} options={{ title: 'Cambiar Rol' }} />
              </Stack.Navigator>
            </NavigationContainer>
          </VisitsProvider>
        </VehiclesProvider>
      </UsersProvider>
    </ServicesProvider>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
// Force HMR reload (Updated with fully unconstrained timezone-tolerant date-time pickers)
