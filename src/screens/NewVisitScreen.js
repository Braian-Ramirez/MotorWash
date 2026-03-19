import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { VisitsContext } from '../context/VisitsContext';
import { VehiclesContext } from '../context/VehiclesContext';
import { ServicesContext } from '../context/ServicesContext';
import { UsersContext } from '../context/UserContext';

export default function NewVisitScreen({ navigation }) {

    const { addVisit } = useContext(VisitsContext);
    const { vehiculos } = useContext(VehiclesContext);
    const { servicios } = useContext(ServicesContext);
    const { usuarios } = useContext(UsersContext);

    // Filtramos los usuarios para obtener solo los empleados
    const empleados = usuarios.filter(u => u.rol === 'employee');

    // 1. ESTADOS (Aquí es donde estaba el problema, ya restaurados)
    const [vehiculo, setVehiculo] = useState('');
    const [date, setDate] = useState(new Date());
    const [mode, setMode] = useState('date');
    const [showPicker, setShowPicker] = useState(false);
    const [fechaWeb, setFechaWeb] = useState('');
    const [encargado, setEncargado] = useState('Cualquiera');
    const [tipoLavado, setTipoLavado] = useState(''); // Empezamos vacío para detectar el cambio

    // 2. EL VIGILANTE: Pone el primer auto y el primer servicio como opción por defecto
    useEffect(() => {
        // Inicializar vehículo
        if (vehiculos && vehiculos.length > 0 && vehiculo === '') {
            const v = vehiculos[0];
            setVehiculo(`${v.tipo} - ${v.marca} ${v.color} (${v.placa})`);
        }
        // Inicializar servicio (¡Aquí estaba el error del tiempo de 30 min!)
        if (servicios && servicios.length > 0 && tipoLavado === '') {
            setTipoLavado(servicios[0].titulo);
        }
    }, [vehiculos, servicios]);

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

    const handleSave = async () => {
        const servicioElegido = servicios.find(s => s.titulo === tipoLavado);
        
        const nuevaCita = {
            fecha: Platform.OS === 'web' ? fechaWeb : date.toLocaleDateString(),
            tipoLavado,
            tiempoEstimado: servicioElegido ? servicioElegido.tiempoEstimado : 30, // 30 por defecto
            precio: servicioElegido ? servicioElegido.precio : 0, // ¡Guardamos el precio real!
            encargado,
            vehiculo
        };
        const result = await addVisit(nuevaCita);
        if (result && result.success) {
             navigation.navigate('VisitQR', { visitaData: result.id });
        } else {
             alert('No se pudo guardar la cita, intenta de nuevo.');
        }
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
                        <Picker.Item label="Cualquiera (Asignación automática)" value="Cualquiera" />
                        {empleados.map((emp) => (
                            <Picker.Item key={emp.id} label={emp.nombre} value={emp.nombre} />
                        ))}
                    </Picker>
                </View>

                <Text style={styles.label}>Vehículo:</Text>
                <View style={styles.pickerContainer}>
                    <Picker selectedValue={vehiculo} onValueChange={setVehiculo}>
                        {vehiculos.map((v) => (
                            <Picker.Item key={v.id} label={`${v.tipo} - ${v.marca} ${v.color} (${v.placa})`} value={`${v.tipo} - ${v.marca} ${v.color} (${v.placa})`} />
                        ))}
                    </Picker>
                </View>

                <Text style={styles.label}>Servicio:</Text>
                <View style={styles.pickerContainer}>
                    <Picker selectedValue={tipoLavado} onValueChange={setTipoLavado}>
                        {servicios.map((s) => (
                            <Picker.Item
                                key={s.id}
                                label={`${s.titulo} ($${s.precio})`}
                                value={s.titulo}
                            />
                        ))}
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
