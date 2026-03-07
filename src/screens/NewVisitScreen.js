import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { VisitsContext } from './context/VisitsContext';
import { VehiclesContext } from './context/VehiclesContext';

export default function NewVisitScreen({ navigation }) {

    const { addVisit } = useContext(VisitsContext);
    const { vehiculos } = useContext(VehiclesContext);

    // 1. ESTADOS (Aquí es donde estaba el problema, ya restaurados)
    const [vehiculo, setVehiculo] = useState('');
    const [date, setDate] = useState(new Date());
    const [mode, setMode] = useState('date');
    const [showPicker, setShowPicker] = useState(false);
    const [fechaWeb, setFechaWeb] = useState('');
    const [encargado, setEncargado] = useState('Cualquiera');
    const [tipoLavado, setTipoLavado] = useState('Lavado Sencillo');

    // 2. EL VIGILANTE: Pone el primer auto de la lista como opción por defecto
    useEffect(() => {
        if (vehiculos && vehiculos.length > 0 && vehiculo === '') {
            const v = vehiculos[0];
            setVehiculo(`${v.marca} ${v.color} (${v.placa})`);
        }
    }, [vehiculos]);

    // 3. Funciones del calendario
    const onChangeDate = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShowPicker(Platform.OS === 'ios');
        setDate(currentDate);
    };

    const showMode = (currentMode) => {
        setShowPicker(true);
        setMode(currentMode);
    };

    const handleSave = () => {
        const nuevaCita = {
            fecha: Platform.OS === 'web' ? fechaWeb : date.toLocaleDateString(),
            tipoLavado,
            encargado,
            vehiculo
        };
        addVisit(nuevaCita);
        const informacionVisita = JSON.stringify(nuevaCita);
        navigation.navigate('VisitQR', { visitaData: informacionVisita });
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <Text style={styles.title}>Nueva Visita</Text>
            <View style={styles.formContainer}>
                <Text style={styles.label}>Fecha y Hora:</Text>
                {Platform.OS === 'web' ? (
                    <TextInput style={styles.input} placeholder="DD/MM/AAAA" value={fechaWeb} onChangeText={setFechaWeb} />
                ) : (
                    <View style={styles.dateTimeRow}>
                        <TouchableOpacity style={styles.dateTimeButton} onPress={() => showMode('date')}>
                            <Text style={styles.dateTimeText}>📅 {date.toLocaleDateString()}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.dateTimeButton} onPress={() => showMode('time')}>
                            <Text style={styles.dateTimeText}>🕒 {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {showPicker && (
                    <DateTimePicker value={date} mode={mode} is24Hour={true} display="default" onChange={onChangeDate} />
                )}

                <Text style={styles.label}>Encargado:</Text>
                <View style={styles.pickerContainer}>
                    <Picker selectedValue={encargado} onValueChange={setEncargado}>
                        <Picker.Item label="Cualquiera" value="Cualquiera" />
                        <Picker.Item label="Carlos Ruiz" value="Carlos Ruiz" />
                        <Picker.Item label="Ana Gómez" value="Ana Gómez" />
                    </Picker>
                </View>

                <Text style={styles.label}>Vehículo:</Text>
                <View style={styles.pickerContainer}>
                    <Picker selectedValue={vehiculo} onValueChange={setVehiculo}>
                        {vehiculos.map((v) => (
                            <Picker.Item key={v.id} label={`${v.marca} ${v.color} (${v.placa})`} value={`${v.marca} ${v.color} (${v.placa})`} />
                        ))}
                    </Picker>
                </View>

                <Text style={styles.label}>Servicio:</Text>
                <View style={styles.pickerContainer}>
                    <Picker selectedValue={tipoLavado} onValueChange={setTipoLavado}>
                        <Picker.Item label="Lavado Sencillo ($10)" value="Lavado Sencillo" />
                        <Picker.Item label="Lavado Completo ($25)" value="Lavado Completo" />
                        <Picker.Item label="Tapicería ($40)" value="Limpieza Tapiceria" />
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
    input: { width: '100%', height: 50, backgroundColor: '#fff', borderRadius: 8, paddingHorizontal: 15, marginBottom: 15, borderWidth: 1, borderColor: '#ddd' },
    dateTimeRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
    dateTimeButton: { width: '48%', height: 50, backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#ddd', justifyContent: 'center', alignItems: 'center' },
    dateTimeText: { fontSize: 16, color: '#333', fontWeight: 'bold' },
    pickerContainer: { backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#ddd', marginBottom: 15, height: 50, justifyContent: 'center' },
    buttonRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 10 },
    actionButton: { width: '48%', height: 50, justifyContent: 'center', alignItems: 'center', borderRadius: 8 },
    saveButton: { backgroundColor: '#4caf50' },
    cancelButton: { backgroundColor: '#f44336' },
    buttonTextWhite: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});
