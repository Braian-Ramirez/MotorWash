/**
 * DOMINIO — Reglas de Validación de Placas
 *
 * Responsabilidad: Definir y documentar las reglas de formato de placas
 * vehiculares según el estándar colombiano.
 *
 * Estas reglas son la FUENTE DE VERDAD en JavaScript. La implementación
 * ejecutable vive en Kotlin (VehicleBusinessModule.kt → validarPlaca y
 * validarDatosVehiculo).
 *
 * Formatos aceptados:
 *   - Particular / Comercial: ABC-123 (3 letras + guión + 3 números)
 *   - Motocicleta:            ABC-12D (3 letras + guión + 2 números + 1 letra)
 *
 * Capa: Domain → Rules
 */

/** Patrones de placa válidos para Colombia */
export const PATRON_PARTICULAR = /^[A-Z]{3}-?[0-9]{3}$/;
export const PATRON_MOTO      = /^[A-Z]{3}-?[0-9]{2}[A-Z]$/;

/**
 * Normaliza una placa: mayúsculas, sin espacios.
 * @param {string} placa
 * @returns {string}
 */
export const normalizarPlaca = (placa) =>
    placa.toUpperCase().trim().replace(/\s/g, '');

/**
 * Valida el formato de una placa colombiana.
 * NOTA: En producción Android, usa NativeBridge.validarPlaca().
 *
 * @param {string} placa
 * @returns {{ esValida: boolean, placaNormalizada: string, mensaje: string }}
 */
export const validarPlaca = (placa) => {
    const normalizada = normalizarPlaca(placa);
    const esValida = PATRON_PARTICULAR.test(normalizada) || PATRON_MOTO.test(normalizada);

    const placaFinal = esValida && !normalizada.includes('-')
        ? `${normalizada.slice(0, 3)}-${normalizada.slice(3)}`
        : normalizada;

    const mensaje = esValida
        ? 'Placa válida.'
        : placa.trim() === ''
            ? 'La placa no puede estar vacía.'
            : 'Formato inválido. Use ABC-123 (particular) o ABC-12D (moto).';

    return { esValida, placaNormalizada: esValida ? placaFinal : placa, mensaje };
};

/**
 * Valida todos los campos de un vehículo nuevo.
 * NOTA: En producción Android, usa NativeBridge.validarDatosVehiculo().
 *
 * @param {string} tipo
 * @param {string} marca
 * @param {string} color
 * @param {string} placa
 * @returns {{ esValido: boolean, errores: string[], placaNormalizada: string }}
 */
export const validarDatosVehiculo = (tipo, marca, color, placa) => {
    const errores = [];
    if (!tipo?.trim())  errores.push('El tipo de vehículo es obligatorio.');
    if (!marca?.trim()) errores.push('La marca del vehículo es obligatoria.');
    if (!color?.trim()) errores.push('El color del vehículo es obligatorio.');

    const { esValida, placaNormalizada } = validarPlaca(placa || '');
    if (!placa?.trim())  errores.push('La placa es obligatoria.');
    else if (!esValida)  errores.push('El formato de la placa no es válido (ej: ABC-123).');

    return { esValido: errores.length === 0, errores, placaNormalizada };
};
