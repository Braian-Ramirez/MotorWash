/**
 * INFRAESTRUCTURA — Puente Nativo (Anti-Corruption Layer)
 *
 * Responsabilidad: Ser el ÚNICO punto de contacto entre JavaScript y los
 * módulos Kotlin. Ninguna pantalla ni contexto llama a NativeModules directamente.
 *
 * Decisión de diseño:
 *   En la arquitectura anterior este archivo tenía fallbacks en JavaScript
 *   que duplicaban la lógica de negocio de Kotlin. Eso violaba el principio
 *   DRY y hacía que las reglas vivieran en dos lugares.
 *
 *   En Clean Architecture las reglas de negocio están en:
 *     1. Kotlin (módulos nativos) → camino real en producción Android
 *     2. src/domain/rules/*.js   → referencia documentada en JS
 *
 *   Si los módulos Kotlin no están disponibles (Expo Go / web), se lanza
 *   un error claro en lugar de silenciosamente usar lógica diferente.
 *
 * Capa: Infrastructure → Native
 */

import { NativeModules, Platform } from 'react-native';

const { VisitsBusinessLogic, VehicleBusinessLogic } = NativeModules;

/** true solo cuando los módulos Kotlin están compilados y disponibles */
export const isKotlinAvailable = Platform.OS === 'android' && !!VisitsBusinessLogic;

if (!isKotlinAvailable && Platform.OS === 'android') {
    console.warn(
        '[NativeBridge] Módulos Kotlin no disponibles. ' +
        'Ejecuta "npx expo run:android" para activarlos.'
    );
}


// ─── MÓDULO DE VISITAS ────────────────────────────────────────────────────────

/**
 * Calcula el precio final de una visita aplicando recargo por tipo de vehículo.
 * Implementado en: android/.../VisitsBusinessModule.kt → calcularPrecioFinal
 *
 * @param {number} precioBase    Precio base del servicio (de Firebase)
 * @param {string} tipoVehiculo  Tipo del vehículo (ej: "SUV", "Sedán")
 * @returns {Promise<{precioFinal, precioBase, factor, recargoPorcentaje, tipoVehiculo}>}
 */
export const calcularPrecioFinal = async (precioBase, tipoVehiculo) => {
    if (!isKotlinAvailable) {
        throw new Error(
            '[NativeBridge] calcularPrecioFinal requiere el build nativo. ' +
            'Usa "npx expo run:android". Ver también: src/domain/rules/PricingRules.js'
        );
    }
    return await VisitsBusinessLogic.calcularPrecioFinal(precioBase, tipoVehiculo);
};

/**
 * Valida los datos de una nueva visita antes de guardarla en Firebase.
 * Implementado en: android/.../VisitsBusinessModule.kt → validarNuevaVisita
 *
 * @param {{ vehiculo, tipoLavado, fecha, precio }} visitaData
 * @returns {Promise<{ esValida: boolean, errores: string[] }>}
 */
export const validarNuevaVisita = async (visitaData) => {
    if (!isKotlinAvailable) {
        throw new Error(
            '[NativeBridge] validarNuevaVisita requiere el build nativo. ' +
            'Usa "npx expo run:android". Ver también: src/domain/rules/StateRules.js'
        );
    }
    return await VisitsBusinessLogic.validarNuevaVisita(visitaData);
};

/**
 * Verifica si un cambio de estado de visita es válido según las reglas del negocio.
 * Implementado en: android/.../VisitsBusinessModule.kt → validarTransicionEstado
 *
 * @param {string} estadoActual  Estado actual ("pendiente", "en_progreso", etc.)
 * @param {string} estadoNuevo   Estado destino
 * @returns {Promise<{ permitido: boolean, mensaje: string }>}
 */
export const validarTransicionEstado = async (estadoActual, estadoNuevo) => {
    if (!isKotlinAvailable) {
        throw new Error(
            '[NativeBridge] validarTransicionEstado requiere el build nativo. ' +
            'Usa "npx expo run:android". Ver también: src/domain/rules/StateRules.js'
        );
    }
    return await VisitsBusinessLogic.validarTransicionEstado(estadoActual, estadoNuevo);
};


// ─── MÓDULO DE VEHÍCULOS ──────────────────────────────────────────────────────

/**
 * Valida el formato de una placa vehicular (estándar colombiano ABC-123).
 * Implementado en: android/.../VehicleBusinessModule.kt → validarPlaca
 *
 * @param {string} placa  Placa ingresada por el usuario
 * @returns {Promise<{ esValida: boolean, placaNormalizada: string, mensaje: string }>}
 */
export const validarPlaca = async (placa) => {
    if (!isKotlinAvailable) {
        throw new Error(
            '[NativeBridge] validarPlaca requiere el build nativo. ' +
            'Usa "npx expo run:android". Ver también: src/domain/rules/PlateRules.js'
        );
    }
    return await VehicleBusinessLogic.validarPlaca(placa);
};

/**
 * Valida todos los campos de un vehículo nuevo antes de guardarlo.
 * Implementado en: android/.../VehicleBusinessModule.kt → validarDatosVehiculo
 *
 * @param {string} tipo   Tipo de vehículo
 * @param {string} marca  Marca
 * @param {string} color  Color
 * @param {string} placa  Placa
 * @returns {Promise<{ esValido: boolean, errores: string[], placaNormalizada: string }>}
 */
export const validarDatosVehiculo = async (tipo, marca, color, placa) => {
    if (!isKotlinAvailable) {
        throw new Error(
            '[NativeBridge] validarDatosVehiculo requiere el build nativo. ' +
            'Usa "npx expo run:android". Ver también: src/domain/rules/PlateRules.js'
        );
    }
    return await VehicleBusinessLogic.validarDatosVehiculo(tipo, marca, color, placa);
};

/**
 * Clasifica un vehículo por tamaño para determinar el recargo aplicable.
 * Implementado en: android/.../VehicleBusinessModule.kt → clasificarVehiculo
 *
 * @param {string} tipoVehiculo  Tipo del vehículo
 * @returns {Promise<{ clasificacion: string, descripcion: string }>}
 */
export const clasificarVehiculo = async (tipoVehiculo) => {
    if (!isKotlinAvailable) {
        throw new Error(
            '[NativeBridge] clasificarVehiculo requiere el build nativo. ' +
            'Usa "npx expo run:android". Ver también: src/domain/rules/PricingRules.js'
        );
    }
    return await VehicleBusinessLogic.clasificarVehiculo(tipoVehiculo);
};
