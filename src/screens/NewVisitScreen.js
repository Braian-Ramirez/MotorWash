import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function NewVisitScreen({ navigation }) {
    // Estados para la fecha y hora usando Date (Para Celular)
    const [date, setDate] = useState(new Date());
    const [mode, setMode] = useState('date');
    const [showPicker, setShowPicker] = useState(false);

    // Estado para la fecha manualmente (Para Web)
    const [fechaWeb, setFechaWeb] = useState('');

    // Estados para el resto del formulario
    const [encargado, setEncargado] = useState('Cualquiera');
    const [vehiculo, setVehiculo] = useState('Toyota Rojo');
    const [tipoLavado, setTipoLavado] = useState('Lavado Sencillo');

    // Funciones del calendario del celular
    const onChangeDate = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShowPicker(Platform.OS === 'ios');
        setDate(currentDate);
    };

    const showMode = (currentMode) => {
        setShowPicker(true);
        setMode(currentMode);
    };

    const showDatepicker = () => showMode('date');
    const showTimepicker = () => showMode('time');

    const handleSave = () => {
        // Dependiendo de si es web o celular, agarramos la fecha de un lado o de otro
        const fechaFinal = Platform.OS === 'web'
            ? fechaWeb
            : `${date.toLocaleDateString()} a las ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

        // Empaquetamos toda la visita en un texto (formato JSON)
        const informacionVisita = JSON.stringify({
            fecha: fechaFinal,
            encargado: encargado,
            vehiculo: vehiculo,
            servicio: tipoLavado
        });

        console.log("Generando QR para la visita...");
        // Navegamos a la nueva pantalla y le mandamos la "informacionVisita" como equipaje (params)
        navigation.navigate('VisitQR', {
            visitaData: informacionVisita
        });
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <Text style={styles.title}>Nueva Visita</Text>

            <View style={styles.formContainer}>

                <Text style={styles.label}>Fecha y Hora de la cita:</Text>

                {/* MAGIA DE PLATAFORMAS: Verificamos dónde estamos corriendo */}
                {Platform.OS === 'web' ? (
                    // Si es WEB (Navegador): Mostramos un Input normal de texto
                    <TextInput
                        style={styles.input}
                        placeholder="Ej: 25/11/2026 - 15:30"
                        value={fechaWeb}
                        onChangeText={setFechaWeb}
                    />
                ) : (
                    // Si es MÓVIL (Android o iOS): Mostramos los botones nativos del sistema
                    <View>
                        <View style={styles.dateTimeRow}>
                            <TouchableOpacity style={styles.dateTimeButton} onPress={showDatepicker}>
                                <Text style={styles.dateTimeText}>📅 {date.toLocaleDateString()}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.dateTimeButton} onPress={showTimepicker}>
                                <Text style={styles.dateTimeText}>🕒 {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                            </TouchableOpacity>
                        </View>

                        {showPicker && (
                            <DateTimePicker
                                testID="dateTimePicker"
                                value={date}
                                mode={mode}
                                is24Hour={true}
                                display="default"
                                onChange={onChangeDate}
                            />
                        )}
                    </View>
                )}

                <Text style={styles.label}>Encargado preferido:</Text>
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={encargado}
                        onValueChange={(itemValue) => setEncargado(itemValue)}
                    >
                        <Picker.Item label="Cualquiera" value="Cualquiera" />
                        <Picker.Item label="Carlos Ruiz" value="Carlos Ruiz" />
                        <Picker.Item label="Ana Gómez" value="Ana Gómez" />
                    </Picker>
                </View>

                <Text style={styles.label}>¿Qué vehículo?:</Text>
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={vehiculo}
                        onValueChange={(itemValue) => setVehiculo(itemValue)}
                    >
                        <Picker.Item label="Toyota Rojo (ABC-123)" value="Toyota Rojo" />
                        <Picker.Item label="Ford Gris (XYZ-987)" value="Ford Gris" />
                    </Picker>
                </View>

                <Text style={styles.label}>Tipo de Lavado:</Text>
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={tipoLavado}
                        onValueChange={(itemValue) => setTipoLavado(itemValue)}
                    >
                        <Picker.Item label="Lavado Sencillo ($10)" value="Lavado Sencillo" />
                        <Picker.Item label="Lavado Completo + Encerado ($25)" value="Lavado Completo" />
                        <Picker.Item label="Limpieza de Tapicería ($40)" value="Limpieza Tapiceria" />
                    </Picker>
                </View>
            </View>

            <View style={styles.buttonRow}>
                <TouchableOpacity style={[styles.actionButton, styles.saveButton]} onPress={handleSave}>
                    <Text style={styles.buttonTextWhite}>Guardar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionButton, styles.cancelButton]} onPress={() => navigation.goBack()}>
                    <Text style={styles.buttonTextWhite}>Descartar</Text>
                </TouchableOpacity>
            </View>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    contentContainer: { padding: 20, alignItems: 'center' },
    title: { fontSize: 28, fontWeight: 'bold', color: '#003366', marginBottom: 25 },
    formContainer: { width: '100%', marginBottom: 20 },
    label: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 5, marginLeft: 5 },

    input: {
        width: '100%', height: 50, backgroundColor: '#fff', borderRadius: 8,
        paddingHorizontal: 15, marginBottom: 15, borderWidth: 1, borderColor: '#ddd',
        fontSize: 16,
    },

    dateTimeRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
    dateTimeButton: {
        width: '48%', height: 50, backgroundColor: '#fff', borderRadius: 8,
        borderWidth: 1, borderColor: '#ddd', justifyContent: 'center', alignItems: 'center',
    },
    dateTimeText: { fontSize: 16, color: '#333', fontWeight: 'bold' },

    pickerContainer: {
        backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#ddd',
        marginBottom: 15, height: 50, justifyContent: 'center'
    },
    buttonRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 10 },
    actionButton: { width: '48%', height: 50, justifyContent: 'center', alignItems: 'center', borderRadius: 8 },
    saveButton: { backgroundColor: '#4caf50' },
    cancelButton: { backgroundColor: '#f44336' },
    buttonTextWhite: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});
