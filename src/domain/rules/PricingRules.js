/**
 * DOMINIO — Reglas de Precios
 *
 * Responsabilidad: Documentar y centralizar las reglas de precios del negocio.
 * Estas reglas son la FUENTE DE VERDAD en JavaScript.
 *
 * NOTA DE ARQUITECTURA: 
 * Anteriormente existían "factores de recargo" fijos (+25%, +40%). 
 * Ahora los servicios son creados explícitamente para tipos de vehículos 
 * específicos por el administrador. El sistema respeta el precio exacto
 * estipulado en la configuración del servicio.
 *
 * Capa: Domain → Rules
 */

/**
 * Tipos de vehículos permitidos en el sistema.
 */
export const TIPOS_VEHICULO = {
    MOTO: 'Moto',
    CARRO: 'Carro',
    CAMIONETA: 'Camioneta',
    TODOS: 'Todos'
};

/**
 * Valida si un servicio aplica para un tipo de vehículo.
 * @param {string} tipoServicio - El tipo para el que aplica el servicio
 * @param {string} tipoVehiculoCliente - El tipo de vehículo del cliente
 * @returns {boolean}
 */
export const servicioAplicaParaVehiculo = (tipoServicio, tipoVehiculoCliente) => {
    if (!tipoServicio || tipoServicio === TIPOS_VEHICULO.TODOS) return true;
    return tipoServicio.toLowerCase().trim() === tipoVehiculoCliente.toLowerCase().trim();
};

/**
 * Calcula el precio final de un servicio.
 * Dado que ahora los precios son estáticos y asignados por el administrador
 * por tipo de vehículo, el precio final es exactamente el precio base.
 *
 * @param {number} precioBase
 * @returns {{ precioFinal: number, precioBase: number, recargoPorcentaje: number }}
 */
export const calcularPrecioFinal = (precioBase) => {
    return {
        precioFinal: precioBase,
        precioBase: precioBase,
        recargoPorcentaje: 0,
    };
};
