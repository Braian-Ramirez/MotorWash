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

    if (visitaData.fecha) {
        let fechaCita;
        let tieneHora = false;
        
        let fechaParte = visitaData.fecha;
        let horaParte = '';
        
        if (visitaData.fecha.includes(' ')) {
            const partesEspacio = visitaData.fecha.split(' ');
            fechaParte = partesEspacio[0];
            horaParte = partesEspacio[1];
        }

        if (fechaParte.includes('/')) {
            const partes = fechaParte.split('/');
            if (partes.length === 3) {
                const dia = parseInt(partes[0], 10);
                const mes = parseInt(partes[1], 10) - 1; // 0-indexed
                const anio = parseInt(partes[2], 10);
                
                let hora = 0;
                let minuto = 0;
                if (horaParte && horaParte.includes(':')) {
                    const partesHora = horaParte.split(':');
                    if (partesHora.length >= 2) {
                        hora = parseInt(partesHora[0], 10);
                        minuto = parseInt(partesHora[1], 10);
                        tieneHora = true;
                    }
                }
                fechaCita = new Date(anio, mes, dia, hora, minuto);
            }
        }
        
        if (!fechaCita || isNaN(fechaCita.getTime())) {
            fechaCita = new Date(visitaData.fecha);
            tieneHora = visitaData.fecha.includes(':');
        }

        if (!isNaN(fechaCita.getTime())) {
            const hoy = new Date();
            hoy.setSeconds(0, 0);
            fechaCita.setSeconds(0, 0);
            const limitePasado = new Date(hoy.getTime() - 24 * 60 * 60 * 1000);

            if (fechaCita.getTime() < limitePasado.getTime()) {
                errores.push('La fecha de la cita debe ser igual o superior a la fecha actual.');
            } else {
                const hoySoloFecha = new Date(hoy);
                hoySoloFecha.setHours(0, 0, 0, 0);
                
                const citaSoloFecha = new Date(fechaCita);
                citaSoloFecha.setHours(0, 0, 0, 0);

                if (citaSoloFecha.getTime() === hoySoloFecha.getTime()) {
                    if (tieneHora && fechaCita.getTime() < hoy.getTime()) {
                        errores.push('La hora de la cita no puede ser anterior a la hora actual.');
                    }
                }
            }
        }
    }

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
