import React, { useState, useContext } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
// Reutilizamos la misma librería de íconos
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { VisitsContext } from './context/VisitsContext';

export default function AgendaScreen({ navigation }) {
    // Simulamos que el usuario ha lavado su carro 3 veces
    const [lavadasAcumuladas, setLavadasAcumuladas] = useState(3);
    const lavadasParaPremio = 5; // El total necesario para el premio

    // Simulamos una visita ya programada
    // Extraemos la lista real de visitas
    const { visitas } = useContext(VisitsContext);

    const handleAgendar = () => {
        console.log("Ir a la pantalla de Nueva Visita");
        navigation.navigate('NewVisit');
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>

            {/* 1. Icono Gigante de la Libreta */}
            <View style={styles.headerIconContainer}>
                <MaterialCommunityIcons name="notebook-outline" size={100} color="#b3d4ff" />
            </View>

            {/* 2. Texto de Fidelización */}
            <View style={styles.loyaltyContainer}>
                <Text style={styles.loyaltyTitle}>
                    ¡Te faltan {lavadasParaPremio - lavadasAcumuladas} lavadas para alcanzar tu premio!
                </Text>
                {/* Opcional: una barra de progreso sencilla con Views */}
                <View style={styles.progressBarBackground}>
                    <View style={[styles.progressBarFill, { width: `${(lavadasAcumuladas / lavadasParaPremio) * 100}%` }]} />
                </View>
                <Text style={styles.loyaltySubtext}>
                    Llevas {lavadasAcumuladas} de {lavadasParaPremio} lavadas.
                </Text>
            </View>

            {/* 3. Lista de Visitas */}
            <View style={styles.cardHeader}>
                <Text style={styles.sectionTitle}>Mis Visitas</Text>
                <MaterialCommunityIcons name="calendar-clock" size={24} color="#0066cc" />
            </View>

            {/* Ahora recorremos el arreglo de visitas y generamos una tarjeta para cada una */}
            {visitas.map((visita) => (
                <View key={visita.id} style={styles.card}>
                    <Text style={styles.cardText}>Fecha: <Text style={styles.cardData}>{visita.fecha}</Text></Text>
                    <Text style={styles.cardText}>Tipo de lavado: <Text style={styles.cardData}>{visita.tipoLavado}</Text></Text>
                    <Text style={styles.cardText}>Encargado: <Text style={styles.cardData}>{visita.encargado}</Text></Text>
                    <Text style={styles.cardText}>Vehículo: <Text style={styles.cardData}>{visita.vehiculo}</Text></Text>
                </View>
            ))}

            {/* 4. Botón verde para Agendar (como en tu dibujo) */}
            <TouchableOpacity style={styles.addButton} onPress={handleAgendar}>
                <Text style={styles.addButtonText}>Agendar Nueva Visita</Text>
            </TouchableOpacity>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    contentContainer: {
        padding: 20,
        alignItems: 'center',
    },
    // Estilos de la cabecera (iguales que los de Vehicles)
    headerIconContainer: {
        marginBottom: 20,
        padding: 20,
        backgroundColor: '#e6f0fa',
        borderRadius: 80,
    },
    // Estilos para el bloque de premios (fidelización)
    loyaltyContainer: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 30,
    },
    loyaltyTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#003366',
        textAlign: 'center',
        marginBottom: 10,
    },
    loyaltySubtext: {
        fontSize: 14,
        color: '#666',
        marginTop: 5,
    },
    progressBarBackground: {
        width: '80%',
        height: 10,
        backgroundColor: '#ddd',
        borderRadius: 5,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#4caf50', // Verde para indicar progreso
    },
    // Estilos del título de la sección y la tarjeta azul
    cardHeader: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        paddingHorizontal: 5,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
    },
    card: {
        width: '100%',
        backgroundColor: '#e6f0fa', // Fondo azul clarito de la tarjeta
        borderRadius: 10,
        padding: 20,
        marginBottom: 25,
        // Borde izquierdo más grueso y oscuro, tal cual como en tus mockups
        borderLeftWidth: 6,
        borderLeftColor: '#0066cc',
        elevation: 2,
    },
    cardText: {
        fontSize: 15,
        color: '#555',
        marginBottom: 8,
    },
    cardData: {
        fontWeight: 'bold',
        color: '#000',
    },
    // Botón verde
    addButton: {
        width: '80%',
        backgroundColor: '#4caf50',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 30,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    }
});
