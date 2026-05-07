/**
 * DOMINIO — Reglas de Transición de Estados
 *
 * Responsabilidad: Definir y documentar las transiciones válidas de estado
 * para una visita de lavado dentro del negocio MotorWash.
 *
 * Estas reglas son la FUENTE DE VERDAD en JavaScript. La implementación
 * ejecutable vive en Kotlin (VisitsBusinessModule.kt → validarTransicionEstado).
 *
 * Ciclo de vida de una visita:
 *   pendiente → en_progreso → completado
 *             ↘ cancelado
 *
 * Capa: Domain → Rules
 */

/**
 * Mapa de transiciones permitidas por estado.
 * Debe mantenerse sincronizado con VisitsBusinessModule.kt.
 */
export const TRANSICIONES_PERMITIDAS = {
    pendiente:   ['en_progreso', 'cancelado'],
    en_progreso: ['completado'],
    completado:  [],
    cancelado:   [],
};

/**
 * Verifica si una transición de estado es válida.
 * NOTA: En producción Android, usa NativeBridge.validarTransicionEstado().
 *
 * @param {string} estadoActual
 * @param {string} estadoNuevo
 * @returns {{ permitido: boolean, mensaje: string }}
 */
export const validarTransicionEstado = (estadoActual, estadoNuevo) => {
    const permitido = (TRANSICIONES_PERMITIDAS[estadoActual] || []).includes(estadoNuevo);

    let mensaje;
    if (permitido) {
        mensaje = `Transición de '${estadoActual}' a '${estadoNuevo}' permitida.`;
    } else if (estadoActual === 'completado') {
        mensaje = 'Esta visita ya fue completada y no puede modificarse.';
    } else if (estadoActual === 'cancelado') {
        mensaje = 'Esta visita fue cancelada.';
    } else {
        mensaje = `No se puede pasar de '${estadoActual}' a '${estadoNuevo}' directamente.`;
    }

    return { permitido, mensaje };
};

/**
 * Valida los datos mínimos de una nueva visita.
 * NOTA: En producción Android, usa NativeBridge.validarNuevaVisita().
 *
 * @param {{ vehiculo, tipoLavado, fecha, precio }} visitaData
 * @returns {{ esValida: boolean, errores: string[] }}
 */
export const validarNuevaVisita = (visitaData) => {
    const errores = [];
    if (!visitaData.vehiculo?.trim())   errores.push('Debes seleccionar un vehículo.');
    if (!visitaData.tipoLavado?.trim()) errores.push('Debes seleccionar un tipo de lavado.');
    if (!visitaData.fecha?.trim())      errores.push('La fecha de la cita es obligatoria.');
    if (!visitaData.precio || visitaData.precio <= 0) errores.push('El precio del servicio no es válido.');
    return { esValida: errores.length === 0, errores };
};

/**
 * Etiquetas legibles para cada estado de visita (uso en UI).
 */
export const ETIQUETAS_ESTADO = {
    pendiente:   'Pendiente',
    en_progreso: 'En progreso',
    completado:  'Completado',
    cancelado:   'Cancelado',
};
