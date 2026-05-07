/**
 * APLICACIÓN — Caso de Uso: Agregar Visita
 *
 * Responsabilidad: Orquestar el flujo completo de agendar una nueva visita.
 * Coordina la capa de dominio (validación vía Kotlin) y la de infraestructura
 * (persistencia en Firebase). El contexto solo llama a este caso de uso.
 *
 * Flujo:
 *   1. Delega la validación de datos a Kotlin (NativeBridge → VisitsBusinessModule)
 *   2. Si es válido, persiste la visita en Firestore (VisitsRepository)
 *   3. Retorna el resultado con el ID generado por Firebase
 *
 * Capa: Application → UseCases
 */
import { validarNuevaVisita } from '../../infrastructure/native/NativeBridge';
import { crearVisitaInDB } from '../../infrastructure/firebase/VisitsRepository';

/**
 * Agrega una nueva visita al sistema.
 *
 * @param {{ vehiculo, tipoLavado, fecha, precio, encargado }} nuevaVisita - Datos del formulario
 * @param {string} userId - UID del cliente autenticado
 * @returns {Promise<{ success: boolean, id?: string, error?: string }>}
 */
export const addVisitUseCase = async (nuevaVisita, userId) => {
    if (!userId) return { success: false, error: 'No hay usuario autenticado.' };

    // 1. KOTLIN valida los datos de negocio
    const validacion = await validarNuevaVisita(nuevaVisita);
    if (!validacion.esValida) {
        return { success: false, error: validacion.errores.join('\n') };
    }

    // 2. Enriquecemos la visita con datos de sistema
    const visitaCompleta = {
        ...nuevaVisita,
        estado: 'pendiente',
        fechaCreado: new Date().toISOString(),
    };

    // 3. Firebase persiste la visita
    const result = await crearVisitaInDB(visitaCompleta, userId);
    if (!result.success) {
        console.error('[AddVisitUseCase] Error al persistir:', result.error);
    }
    return result;
};
