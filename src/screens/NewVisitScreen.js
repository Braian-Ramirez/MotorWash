import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { VisitsContext } from '../application/context/VisitsContext';
import { VehiclesContext } from '../application/context/VehiclesContext';
import { ServicesContext } from '../application/context/ServicesContext';
import { UsersContext } from '../application/context/UserContext';
// 🔗 Kotlin: validación final del precio (sin recargos)
import { calcularPrecioFinal } from '../infrastructure/native/NativeBridge';

export default function NewVisitScreen({ navigation }) {

    const { addVisit } = useContext(VisitsContext);
    const { vehiculos } = useContext(VehiclesContext);
    const { servicios } = useContext(ServicesContext);
    const { usuarios } = useContext(UsersContext);

    // Filtramos los usuarios para obtener solo los empleados
    const empleados = usuarios.filter(u => u.rol === 'employee');

    // 1. ESTADOS
    const [vehiculo, setVehiculo] = useState('');
    const [tipoVehiculo, setTipoVehiculo] = useState(''); // tipo puro para enviar a Kotlin
    const [date, setDate] = useState(new Date());
    const [mode, setMode] = useState('date');
    const [showPicker, setShowPicker] = useState(false);
    const [fechaWeb, setFechaWeb] = useState('');
    const [encargado, setEncargado] = useState('Cualquiera');
    const [tipoLavado, setTipoLavado] = useState('');
    // Estado del precio calculado por Kotlin
    const [precioInfo, setPrecioInfo] = useState({ precioFinal: 0, recargoPorcentaje: 0 });

    // 2. EL VIGILANTE: Pone el primer auto y el primer servicio como opción por defecto
    useEffect(() => {
        if (vehiculos && vehiculos.length > 0 && vehiculo === '') {
            const v = vehiculos[0];
            setVehiculo(`${v.tipo} - ${v.marca} ${v.color} (${v.placa})`);
            setTipoVehiculo(v.tipo); // guardamos el tipo puro para Kotlin
        }
        if (servicios && servicios.length > 0 && tipoLavado === '') {
            setTipoLavado(servicios[0].titulo);
        }
    }, [vehiculos, servicios]);

    // 3. Filtramos servicios y seleccionamos uno por defecto si es necesario
    const serviciosFiltrados = servicios.filter(s => 
        !s.tipoVehiculo || s.tipoVehiculo === 'Todos' || s.tipoVehiculo === tipoVehiculo
    );

    useEffect(() => {
        if (serviciosFiltrados.length > 0) {
            // Si el servicio actual no está en la lista filtrada, cambiamos al primero
            const existe = serviciosFiltrados.find(s => s.titulo === tipoLavado);
            if (!existe) setTipoLavado(serviciosFiltrados[0].titulo);
        } else {
            setTipoLavado('');
        }
    }, [tipoVehiculo, serviciosFiltrados]);

    // 4. KOTLIN: Valida el precio exacto
    useEffect(() => {
        const recalcular = async () => {
            const servicioElegido = serviciosFiltrados.find(s => s.titulo === tipoLavado);
            if (!servicioElegido || !tipoVehiculo) {
                setPrecioInfo({ precioFinal: 0, recargoPorcentaje: 0 });
                return;
            }

            // 🔗 Kotlin ahora solo valida el precio sin aplicar recargos extra
            const resultado = await calcularPrecioFinal(
                servicioElegido.precio,
                tipoVehiculo
            );
            setPrecioInfo(resultado);
        };
        recalcular();
    }, [tipoLavado, tipoVehiculo, serviciosFiltrados]);

    // 3. Funciones del calendario
    const onChangeDate = (event, selectedDate) => {
        if (Platform.OS === 'ios') {
            setShowPicker(false);
        }

        if (event.type === 'dismissed' || !selectedDate) {
            return;
        }

        setDate(selectedDate);
    };

    const showMode = (currentMode) => {
        if (Platform.OS === 'android') {
            DateTimePickerAndroid.open({
                value: date,
                onChange: (event, selectedDate) => {
                    if (event.type === 'set' && selectedDate) {
                        setDate(selectedDate);
                    }
                },
                mode: currentMode,
                is24Hour: true,
            });
        } else {
            setMode(currentMode);
            setShowPicker(true);
        }
    };

    const handleSave = async () => {
        const hoy = new Date();
        hoy.setSeconds(0, 0);

        let fechaCita = new Date(date);
        fechaCita.setSeconds(0, 0);
        if (Platform.OS === 'web') {
            if (fechaWeb.includes('/')) {
                const partes = fechaWeb.split('/');
                if (partes.length === 3) {
                    const dia = parseInt(partes[0], 10);
                    const mes = parseInt(partes[1], 10) - 1;
                    const anio = parseInt(partes[2], 10);
                    fechaCita = new Date(anio, mes, dia);
                }
            }
        }

        // Validación local de fecha con tolerancia de 24 horas para desfase de huso horario (ej. UTC vs Local)
        const limitePasado = new Date(hoy.getTime() - 24 * 60 * 60 * 1000);
        
        if (fechaCita.getTime() < limitePasado.getTime()) {
            alert('La fecha de la cita debe ser igual o superior a la fecha actual.');
            return;
        }

        // Si la cita es para hoy mismo (según el día del emulador), validar que la hora no haya pasado
        const hoySoloFecha = new Date(hoy);
        hoySoloFecha.setHours(0, 0, 0, 0);

        const citaSoloFecha = new Date(fechaCita);
        citaSoloFecha.setHours(0, 0, 0, 0);

        if (citaSoloFecha.getTime() === hoySoloFecha.getTime()) {
            if (fechaCita.getTime() < hoy.getTime()) {
                alert('La hora de la cita no puede ser anterior a la hora actual.');
                return;
            }
        }

        const servicioElegido = servicios.find(s => s.titulo === tipoLavado);

        const pad = (n) => n.toString().padStart(2, '0');
        const formattedDate = `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}`;

        const nuevaCita = {
            fecha: Platform.OS === 'web' 
                ? fechaWeb 
                : formattedDate,
            tipoLavado,
            tiempoEstimado: servicioElegido ? servicioElegido.tiempoEstimado : 30,
            // 🔗 Usamos el precio calculado por Kotlin (con recargo incluido)
            precio: precioInfo.precioFinal || (servicioElegido ? servicioElegido.precio : 0),
            encargado,
            vehiculo
        };
        // VisitsContext llamará a Kotlin para validar antes de guardar en Firebase
        const result = await addVisit(nuevaCita);
        if (result && result.success) {
            navigation.navigate('VisitQR', { visitaData: result.id });
        } else {
            alert(result?.error || 'No se pudo guardar la cita, intenta de nuevo.');
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
                    <DateTimePicker
                        value={date}
                        mode={mode}
                        is24Hour={true}
                        display="spinner"
                        onChange={onChangeDate}
                    />
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
                    <Picker
                        selectedValue={vehiculo}
                        onValueChange={(val) => {
                            setVehiculo(val);
                            // Extraemos el tipo del vehículo para enviarlo a Kotlin
                            const vObj = vehiculos.find(v =>
                                `${v.tipo} - ${v.marca} ${v.color} (${v.placa})` === val
                            );
                            if (vObj) setTipoVehiculo(vObj.tipo);
                        }}
                    >
                        {vehiculos.map((v) => (
                            <Picker.Item
                                key={v.id}
                                label={`${v.tipo} - ${v.marca} ${v.color} (${v.placa})`}
                                value={`${v.tipo} - ${v.marca} ${v.color} (${v.placa})`}
                            />
                        ))}
                    </Picker>
                </View>

                <Text style={styles.label}>Servicio:</Text>
                <View style={styles.pickerContainer}>
                    {serviciosFiltrados.length > 0 ? (
                        <Picker selectedValue={tipoLavado} onValueChange={setTipoLavado}>
                            {serviciosFiltrados.map((s) => (
                                <Picker.Item
                                    key={s.id}
                                    label={`${s.titulo} ($${s.precio})`}
                                    value={s.titulo}
                                />
                            ))}
                        </Picker>
                    ) : (
                        <Text style={{ padding: 15, color: '#666' }}>No hay servicios para este vehículo.</Text>
                    )}
                </View>

                {/* 🔗 Precio final validado por Kotlin */}
                <View style={styles.precioContainer}>
                    <Text style={styles.precioLabel}>Precio final:</Text>
                    <Text style={styles.precioValor}>${precioInfo.precioFinal?.toFixed(2) ?? '0.00'}</Text>
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
    // Bloque de precio calculado por Kotlin
    precioContainer: { backgroundColor: '#e8f5e9', borderRadius: 10, padding: 15, marginBottom: 15, alignItems: 'center', borderWidth: 1, borderColor: '#a5d6a7' },
    precioLabel: { fontSize: 14, color: '#388e3c', fontWeight: '600' },
    precioValor: { fontSize: 28, fontWeight: 'bold', color: '#1b5e20', marginVertical: 4 },
    recargoBadge: { fontSize: 12, color: '#e65100', backgroundColor: '#fff3e0', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10, overflow: 'hidden', fontWeight: '600' },
    buttonRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 10 },
    actionButton: { width: '48%', height: 50, justifyContent: 'center', alignItems: 'center', borderRadius: 8 },
    saveButton: { backgroundColor: '#4caf50' },
    cancelButton: { backgroundColor: '#f44336' },
    buttonTextWhite: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});
