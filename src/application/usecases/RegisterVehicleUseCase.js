/**
 * APLICACIÓN — Caso de Uso: Registrar Vehículo
 *
 * Responsabilidad: Orquestar el registro de un nuevo vehículo.
 * Valida los datos con Kotlin antes de persistirlos en Firebase.
 *
 * Flujo:
 *   1. Delega la validación a Kotlin (NativeBridge → VehicleBusinessModule)
 *   2. Si es válido, usa la placa normalizada que devuelve Kotlin
 *   3. Persiste el vehículo en Firestore (VehiclesRepository)
 *
 * Capa: Application → UseCases
 */
import { validarDatosVehiculo } from '../../infrastructure/native/NativeBridge';
import { createVehicleInDB } from '../../infrastructure/firebase/VehiclesRepository';

/**
 * Registra un nuevo vehículo asociado al usuario autenticado.
 *
 * @param {{ tipo, marca, color, placa }} vehiculoData - Datos del formulario
 * @param {string} userId - UID del propietario del vehículo
 * @returns {Promise<{ success: boolean, id?: string, error?: string, errores?: string[] }>}
 */
export const registerVehicleUseCase = async (vehiculoData, userId) => {
    if (!userId) return { success: false, error: 'No hay usuario autenticado.' };

    const { tipo, marca, color, placa } = vehiculoData;

    // 1. KOTLIN valida todos los campos y normaliza la placa
    const validacion = await validarDatosVehiculo(tipo, marca, color, placa);
    if (!validacion.esValido) {
        return { success: false, errores: validacion.errores, error: validacion.errores.join('\n') };
    }

    // 2. Usamos la placa normalizada que devuelve Kotlin (ej: "ABC-123")
    const vehiculoNormalizado = {
        ...vehiculoData,
        placa: validacion.placaNormalizada,
    };

    // 3. Firebase persiste el vehículo
    const result = await createVehicleInDB(vehiculoNormalizado, userId);
    if (!result.success) {
        console.error('[RegisterVehicleUseCase] Error al persistir:', result.error);
    }
    return result;
};
