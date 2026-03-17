import React, { useState, useContext } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
// Reutilizamos la misma librería de íconos
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { VisitsContext } from '../context/VisitsContext';

export default function AgendaScreen({ navigation }) {
    // Extraemos la lista real de visitas y la función de calificación
    const { visitas, calificarVisita } = useContext(VisitsContext);

    // Calculamos las lavadas acumuladas reales (solo las completadas)
    const lavadasAcumuladas = visitas.filter(v => v.estado === 'completado').length;
    const lavadasParaPremio = 5; // El total necesario para el premio

    // Estado local para recordar lo que el cliente selecciona antes de darle "Enviar"
    const [calificacionesTemp, setCalificacionesTemp] = useState({});

    // Función que actualiza las estrellas antes de enviar
    const handleStarPress = (id, estrellas) => {
        setCalificacionesTemp(prev => ({
            ...prev,
            [id]: { ...prev[id], estrellas }
        }));
    };

    // Función que actualiza el texto del comentario antes de enviar
    const handleCommentChange = (id, comentario) => {
        setCalificacionesTemp(prev => ({
            ...prev,
            [id]: { ...prev[id], comentario }
        }));
    };

    // Función para enviar definitivamente
    const handleSubmitRating = (id) => {
        const calif = calificacionesTemp[id];
        if (!calif || !calif.estrellas) {
            Alert.alert("Aviso", "Por favor selecciona al menos una estrella para calificar el servicio.");
            return;
        }
        // Guardamos todo en el contexto de la base de datos
        calificarVisita(id, calif.estrellas, calif.comentario || '');
        Alert.alert("¡Gracias!", "Tu calificación ha sido enviada con éxito.");
    };

    const handleAgendar = () => {
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
            {visitas.map((visita) => {
                // ---- Lógica del Temporizador ----
                let tiempoRestanteStr = null;
                let progressBarWidth = '0%';
                let isDelayed = false;

                if (visita.estado === 'en_progreso' && visita.horaInicio) {
                    // Tiempo transcurrido en minutos
                    const minutosTranscurridos = Math.floor((Date.now() - visita.horaInicio) / 60000);
                    // Tiempo restante estimado
                    const tiempoEstimado = visita.tiempoEstimado || 0; 
                    const minutosRestantes = tiempoEstimado - minutosTranscurridos;

                    if (tiempoEstimado === 0) {
                        tiempoRestanteStr = "Calculando tiempo...";
                        progressBarWidth = "50%";
                    } else if (minutosRestantes > 0) {
                        tiempoRestanteStr = `Faltan aprox. ${minutosRestantes} minutos`;
                        progressBarWidth = `${(minutosTranscurridos / tiempoEstimado) * 100}%`;
                    } else {
                        tiempoRestanteStr = "¡Ya casi terminamos! (Afinando detalles)";
                        progressBarWidth = "100%";
                        isDelayed = true;
                    }
                }
                // ---------------------------------

                return (
                    <View key={visita.id} style={styles.card}>
                        {/* Estado del Lavado */}
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                            <Text style={styles.cardText}>Fecha: <Text style={styles.cardData}>{visita.fecha}</Text></Text>
                            {visita.estado && (
                                <View style={[styles.statusBadge, visita.estado === 'en_progreso' ? styles.statusProgress :
                                    visita.estado === 'completado' ? styles.statusDone : null]}>
                                    <Text style={styles.statusText}>{visita.estado.toUpperCase()}</Text>
                                </View>
                            )}
                        </View>

                        <Text style={styles.cardText}>Tipo de lavado: <Text style={styles.cardData}>{visita.tipoLavado}</Text></Text>
                        <Text style={styles.cardText}>Encargado: <Text style={styles.cardData}>{visita.encargado}</Text></Text>
                        <Text style={styles.cardText}>Vehículo: <Text style={styles.cardData}>{visita.vehiculo}</Text></Text>

                        {/* 🔥 Mostrar el Progreso si está siendo lavado */}
                        {visita.estado === 'en_progreso' && (
                            <View style={styles.timerContainer}>
                                <MaterialCommunityIcons
                                    name={isDelayed ? "clock-alert" : "clock-fast"}
                                    size={20}
                                    color={isDelayed ? "#f44336" : "#ff9800"}
                                />
                                <View style={{ flex: 1, marginLeft: 10 }}>
                                    <Text style={[styles.timeText, isDelayed && { color: '#f44336' }]}>
                                        {tiempoRestanteStr}
                                    </Text>
                                    <View style={styles.miniProgressBarBg}>
                                        <View style={[styles.miniProgressBarFill, { width: progressBarWidth, backgroundColor: isDelayed ? '#f44336' : '#ff9800' }]} />
                                    </View>
                                </View>
                            </View>
                        )}

                        {/* ⭐ Mostrar Calificación si el lavado ya terminó */}
                        {visita.estado === 'completado' && (
                            <View style={styles.ratingContainer}>
                                <Text style={styles.ratingText}>
                                    {visita.calificacion ? 'Tu calificación sobre el servicio:' : '¿Qué tal quedó tu vehículo?'}
                                </Text>
                                <View style={styles.starsRow}>
                                    {[1, 2, 3, 4, 5].map((star) => {
                                        // Estrellas doradas si ya se envió la reseña, o si seleccionó temporalmente
                                        const ratingValue = visita.calificacion || (calificacionesTemp[visita.id]?.estrellas || 0);
                                        return (
                                            <TouchableOpacity
                                                key={star}
                                                onPress={() => handleStarPress(visita.id, star)}
                                                disabled={!!visita.calificacion} // Se bloquean si ya se envío al sistema
                                            >
                                                <MaterialCommunityIcons
                                                    name={ratingValue >= star ? "star" : "star-outline"}
                                                    size={32}
                                                    color={ratingValue >= star ? "#ffc107" : "#ccc"}
                                                />
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>

                                {/* Zona interactiva antes de Enviar */}
                                {!visita.calificacion && (
                                    <View style={{ width: '100%', marginTop: 15 }}>
                                        <TextInput
                                            style={styles.commentInput}
                                            placeholder="Observaciones (opcional)..."
                                            value={calificacionesTemp[visita.id]?.comentario || ''}
                                            onChangeText={(text) => handleCommentChange(visita.id, text)}
                                            multiline
                                        />
                                        <TouchableOpacity
                                            style={styles.submitRatingButton}
                                            onPress={() => handleSubmitRating(visita.id)}
                                        >
                                            <Text style={styles.submitRatingText}>Enviar Calificación</Text>
                                        </TouchableOpacity>
                                    </View>
                                )}

                                {/* Mostrar observaciones ya enviadas si existen */}
                                {visita.calificacion && visita.comentario ? (
                                    <Text style={styles.savedCommentText}>
                                        <Text style={{ fontWeight: 'bold' }}>Comentario:</Text> {visita.comentario}
                                    </Text>
                                ) : null}
                            </View>
                        )}
                    </View>
                );
            })}

            {/* 4. Botón verde para Agendar */}
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
    headerIconContainer: {
        marginBottom: 20,
        padding: 20,
        backgroundColor: '#e6f0fa',
        borderRadius: 80,
    },
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
        backgroundColor: '#4caf50',
    },
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
        backgroundColor: '#e6f0fa',
        borderRadius: 10,
        padding: 20,
        marginBottom: 25,
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
    },
    statusBadge: { backgroundColor: '#ddd', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
    statusProgress: { backgroundColor: '#ff9800' },
    statusDone: { backgroundColor: '#4caf50' },
    statusText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
    timerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 8,
        marginTop: 10,
        borderWidth: 1,
        borderColor: '#ddd'
    },
    timeText: { fontSize: 13, fontWeight: 'bold', color: '#ff9800', marginBottom: 5 },
    miniProgressBarBg: { width: '100%', height: 6, backgroundColor: '#eee', borderRadius: 3, overflow: 'hidden' },
    miniProgressBarFill: { height: '100%' },

    // Estilos de la calificación por estrellas
    ratingContainer: {
        marginTop: 15,
        paddingTop: 15,
        borderTopWidth: 1,
        borderTopColor: '#d6e8fa',
        alignItems: 'center'
    },
    ratingText: { fontSize: 14, color: '#003366', fontWeight: 'bold', marginBottom: 10 },
    starsRow: { flexDirection: 'row', justifyContent: 'center', gap: 5 },
    commentInput: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        minHeight: 60,
        textAlignVertical: 'top'
    },
    submitRatingButton: {
        backgroundColor: '#ff9800',
        paddingVertical: 10,
        borderRadius: 8,
        marginTop: 10,
        alignItems: 'center'
    },
    submitRatingText: { color: '#fff', fontWeight: 'bold' },
    savedCommentText: { marginTop: 10, fontSize: 13, color: '#555', fontStyle: 'italic', textAlign: 'center' }
});
