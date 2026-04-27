/**
 * PUENTE NATIVO (NativeBridge.js)
 *
 * Este es el ÚNICO archivo JavaScript que se comunica con los módulos Kotlin.
 * Ninguna pantalla ni contexto llama a NativeModules directamente.
 * Todo pasa por aquí, lo que facilita el mantenimiento y las pruebas.
 *
 * Patrón de uso:
 *   import { calcularPrecioFinal } from '../native/NativeBridge';
 *   const resultado = await calcularPrecioFinal(100, 'SUV');
 *
 * Si la app corre en web/iOS o en Expo Go (sin módulos nativos compilados),
 * cada función cae en su "fallback" JavaScript para no romperse.
 */

import { NativeModules, Platform } from 'react-native';

// Extraemos los módulos Kotlin registrados en MotorWashPackage.kt
const { VisitsBusinessLogic, VehicleBusinessLogic } = NativeModules;

// ─── GUARDIA: detectar si los módulos Kotlin están disponibles ───────────────
// En Expo Go o en web, NativeModules no tiene nuestros módulos personalizados.
// El dev build (npx expo run:android) sí los tiene.
const isKotlinAvailable = Platform.OS === 'android' && !!VisitsBusinessLogic;

if (!isKotlinAvailable && Platform.OS === 'android') {
    console.warn(
        '[NativeBridge] Los módulos Kotlin no están disponibles. ' +
        'Ejecuta "npx expo run:android" en lugar de Expo Go para activarlos. ' +
        'Usando fallback JavaScript.'
    );
}


// ─── MÓDULO DE VISITAS ────────────────────────────────────────────────────────

/**
 * Calcula el precio final de una visita aplicando recargo por tipo de vehículo.
 * Delega a Kotlin (VisitsBusinessModule.calcularPrecioFinal).
 *
 * @param {number} precioBase  Precio base del servicio (de Firebase)
 * @param {string} tipoVehiculo Tipo del vehículo (ej: "SUV", "Sedán")
 * @returns {Promise<{precioFinal, precioBase, recargoPorcentaje, tipoVehiculo}>}
 */
export const calcularPrecioFinal = async (precioBase, tipoVehiculo) => {
    if (isKotlinAvailable) {
        // ✅ CAMINO REAL: Kotlin aplica las reglas de negocio
        return await VisitsBusinessLogic.calcularPrecioFinal(precioBase, tipoVehiculo);
    }

    // ⚠️ FALLBACK JS: Misma lógica, pero en JavaScript (para Expo Go / web)
    const tipo = tipoVehiculo.toLowerCase().trim();
    let factor = 1.0;
    if (['suv', 'camioneta', 'crossover'].includes(tipo)) factor = 1.25;
    else if (['pickup', 'van', 'minivan'].includes(tipo)) factor = 1.40;
    else if (['bus', 'camión', 'camion', 'furgón', 'furgon'].includes(tipo)) factor = 1.80;

    return {
        precioFinal: precioBase * factor,
        precioBase,
        factor,
        tipoVehiculo,
        recargoPorcentaje: Math.round((factor - 1.0) * 100),
    };
};

/**
 * Valida los datos de una nueva visita antes de guardarla en Firebase.
 * Delega a Kotlin (VisitsBusinessModule.validarNuevaVisita).
 *
 * @param {{ vehiculo, tipoLavado, fecha, precio }} visitaData
 * @returns {Promise<{ esValida: boolean, errores: string[] }>}
 */
export const validarNuevaVisita = async (visitaData) => {
    if (isKotlinAvailable) {
        return await VisitsBusinessLogic.validarNuevaVisita(visitaData);
    }

    // Fallback JS
    const errores = [];
    if (!visitaData.vehiculo?.trim()) errores.push('Debes seleccionar un vehículo.');
    if (!visitaData.tipoLavado?.trim()) errores.push('Debes seleccionar un tipo de lavado.');
    if (!visitaData.fecha?.trim()) errores.push('La fecha de la cita es obligatoria.');
    if (!visitaData.precio || visitaData.precio <= 0) errores.push('El precio del servicio no es válido.');
    return { esValida: errores.length === 0, errores };
};

/**
 * Verifica si un cambio de estado de visita es válido según las reglas del negocio.
 * Delega a Kotlin (VisitsBusinessModule.validarTransicionEstado).
 *
 * @param {string} estadoActual Estado actual ("pendiente", "en_progreso", etc.)
 * @param {string} estadoNuevo  Estado destino
 * @returns {Promise<{ permitido: boolean, mensaje: string }>}
 */
export const validarTransicionEstado = async (estadoActual, estadoNuevo) => {
    if (isKotlinAvailable) {
        return await VisitsBusinessLogic.validarTransicionEstado(estadoActual, estadoNuevo);
    }

    // Fallback JS
    const permitidas = {
        pendiente:   ['en_progreso', 'cancelado'],
        en_progreso: ['completado'],
        completado:  [],
        cancelado:   [],
    };
    const permitido = (permitidas[estadoActual] || []).includes(estadoNuevo);
    const mensaje = permitido
        ? `Transición de '${estadoActual}' a '${estadoNuevo}' permitida.`
        : `No se puede pasar de '${estadoActual}' a '${estadoNuevo}'.`;
    return { permitido, mensaje };
};


// ─── MÓDULO DE VEHÍCULOS ──────────────────────────────────────────────────────

/**
 * Valida el formato de una placa vehicular (estándar colombiano).
 * Delega a Kotlin (VehicleBusinessModule.validarPlaca).
 *
 * @param {string} placa Placa ingresada por el usuario
 * @returns {Promise<{ esValida: boolean, placaNormalizada: string, mensaje: string }>}
 */
export const validarPlaca = async (placa) => {
    if (isKotlinAvailable) {
        return await VehicleBusinessLogic.validarPlaca(placa);
    }

    // Fallback JS
    const normalizada = placa.toUpperCase().trim().replace(/\s/g, '');
    const esValida = /^[A-Z]{3}-?[0-9]{3}$/.test(normalizada) ||
                     /^[A-Z]{3}-?[0-9]{2}[A-Z]$/.test(normalizada);
    const placaFinal = esValida && !normalizada.includes('-')
        ? `${normalizada.slice(0, 3)}-${normalizada.slice(3)}`
        : normalizada;
    return {
        esValida,
        placaNormalizada: esValida ? placaFinal : placa,
        mensaje: esValida ? 'Placa válida.' : 'Formato inválido. Use ABC-123 (particular) o ABC-12D (moto).',
    };
};

/**
 * Valida todos los campos de un vehículo nuevo antes de guardarlo.
 * Delega a Kotlin (VehicleBusinessModule.validarDatosVehiculo).
 *
 * @param {string} tipo  Tipo de vehículo
 * @param {string} marca Marca
 * @param {string} color Color
 * @param {string} placa Placa
 * @returns {Promise<{ esValido: boolean, errores: string[], placaNormalizada: string }>}
 */
export const validarDatosVehiculo = async (tipo, marca, color, placa) => {
    if (isKotlinAvailable) {
        return await VehicleBusinessLogic.validarDatosVehiculo(tipo, marca, color, placa);
    }

    // Fallback JS
    const errores = [];
    if (!tipo?.trim()) errores.push('El tipo de vehículo es obligatorio.');
    if (!marca?.trim()) errores.push('La marca del vehículo es obligatoria.');
    if (!color?.trim()) errores.push('El color del vehículo es obligatorio.');
    const validacionPlaca = await validarPlaca(placa);
    if (!placa?.trim()) errores.push('La placa es obligatoria.');
    else if (!validacionPlaca.esValida) errores.push('El formato de la placa no es válido (ej: ABC-123).');
    return {
        esValido: errores.length === 0,
        errores,
        placaNormalizada: validacionPlaca.placaNormalizada,
    };
};

/**
 * Clasifica un vehículo por tamaño para determinar el recargo aplicable.
 * Delega a Kotlin (VehicleBusinessModule.clasificarVehiculo).
 *
 * @param {string} tipoVehiculo Tipo del vehículo
 * @returns {Promise<{ clasificacion: string, descripcion: string }>}
 */
export const clasificarVehiculo = async (tipoVehiculo) => {
    if (isKotlinAvailable) {
        return await VehicleBusinessLogic.clasificarVehiculo(tipoVehiculo);
    }

    // Fallback JS
    const tipo = tipoVehiculo.toLowerCase().trim();
    let clasificacion = 'PEQUENO';
    if (['suv', 'crossover'].includes(tipo)) clasificacion = 'MEDIANO';
    else if (['camioneta', 'pickup', 'van', 'minivan'].includes(tipo)) clasificacion = 'GRANDE';
    else if (['bus', 'camión', 'camion', 'furgón', 'furgon'].includes(tipo)) clasificacion = 'EXTRA_GRANDE';
    const descripciones = {
        PEQUENO:      'Vehículo pequeño. Se aplica el precio base sin recargo.',
        MEDIANO:      'Vehículo mediano. Se aplica un recargo del 25%.',
        GRANDE:       'Vehículo grande. Se aplica un recargo del 40%.',
        EXTRA_GRANDE: 'Vehículo extra grande. Se aplica un recargo del 80%.',
    };
    return { clasificacion, descripcion: descripciones[clasificacion] };
};
