/**
 * APLICACIÓN — Caso de Uso: Actualizar Estado de Visita
 *
 * Responsabilidad: Orquestar el cambio de estado de una visita existente.
 * Verifica con Kotlin que la transición sea válida según las reglas del negocio
 * antes de persistir el cambio en Firebase.
 *
 * Flujo:
 *   1. Delega la validación de transición a Kotlin (NativeBridge → VisitsBusinessModule)
 *   2. Si es permitida, actualiza el estado en Firestore (VisitsRepository)
 *
 * Capa: Application → UseCases
 */
import { validarTransicionEstado } from '../../infrastructure/native/NativeBridge';
import {
    completarVisitaInDB,
    iniciarVisitaInDB,
    calificarVisitaInDB
} from '../../infrastructure/firebase/VisitsRepository';

/**
 * Inicia una visita (pendiente → en_progreso).
 *
 * @param {string} visitaId - ID de la visita en Firestore
 * @param {string} estadoActual - Estado actual de la visita
 * @param {string|null} nombreEncargado - Nombre del empleado asignado (opcional)
 * @returns {Promise<{ success: boolean, error?: string }>}
 */
export const iniciarVisitaUseCase = async (visitaId, estadoActual, nombreEncargado = null) => {
    // 1. KOTLIN verifica que la transición sea válida
    const transicion = await validarTransicionEstado(estadoActual, 'en_progreso');
    if (!transicion.permitido) {
        console.warn('[UpdateVisitStatusUseCase] Kotlin bloqueó iniciar:', transicion.mensaje);
        return { success: false, error: transicion.mensaje };
    }

    // 2. Firebase actualiza el estado
    const result = await iniciarVisitaInDB(visitaId, nombreEncargado);
    if (!result.success) console.error('[UpdateVisitStatusUseCase] Error al iniciar:', result.error);
    return result;
};

/**
 * Completa una visita (en_progreso → completado).
 *
 * @param {string} visitaId - ID de la visita en Firestore
 * @param {string} estadoActual - Estado actual de la visita
 * @returns {Promise<{ success: boolean, error?: string }>}
 */
export const completarVisitaUseCase = async (visitaId, estadoActual) => {
    // 1. KOTLIN verifica que la transición sea válida
    const transicion = await validarTransicionEstado(estadoActual, 'completado');
    if (!transicion.permitido) {
        console.warn('[UpdateVisitStatusUseCase] Kotlin bloqueó completar:', transicion.mensaje);
        return { success: false, error: transicion.mensaje };
    }

    // 2. Firebase actualiza el estado
    const result = await completarVisitaInDB(visitaId);
    if (!result.success) console.error('[UpdateVisitStatusUseCase] Error al completar:', result.error);
    return result;
};

/**
 * Registra la calificación de una visita completada.
 *
 * @param {string} visitaId - ID de la visita en Firestore
 * @param {number} estrellas - Calificación (1–5)
 * @param {string} comentario - Comentario del cliente
 * @returns {Promise<{ success: boolean, error?: string }>}
 */
export const calificarVisitaUseCase = async (visitaId, estrellas, comentario) => {
    const result = await calificarVisitaInDB(visitaId, estrellas, comentario);
    if (!result.success) console.error('[UpdateVisitStatusUseCase] Error al calificar:', result.error);
    return result;
};
