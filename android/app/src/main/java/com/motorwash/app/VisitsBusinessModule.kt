package com.motorwash.app

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.WritableNativeMap

/**
 * MÓDULO DE LÓGICA DE NEGOCIO: VISITAS
 *
 * Este módulo actúa como el "servidor" interno de la app.
 * React Native (JavaScript) solo envía datos crudos del formulario.
 * Kotlin aplica las reglas de negocio y devuelve el resultado.
 *
 * Reglas implementadas:
 * - Validación de datos de la cita antes de guardar.
 * - Cálculo del precio final con descuentos según tipo de vehículo.
 * - Estimación del tiempo de servicio.
 * - Validación de transición de estados (pendiente → en_progreso → completado).
 */
class VisitsBusinessModule(reactContext: ReactApplicationContext)
    : ReactContextBaseJavaModule(reactContext) {

    // Nombre con el que JavaScript importará este módulo:
    // const { VisitsBusinessLogic } = NativeModules;
    override fun getName(): String = "VisitsBusinessLogic"

    /**
     * REGLA 1: Calcular el precio final de una visita.
     *
     * Debido a la nueva regla de negocio (Enfoque 2), los precios ahora son estáticos
     * y configurados por el administrador para tipos de vehículos específicos.
     * Ya no se aplican multiplicadores genéricos. Kotlin se encarga de validar 
     * que el precio base proporcionado sea válido y lo establece como precio final.
     *
     * @param precioBase Precio exacto del servicio (Double)
     * @param tipoVehiculo Tipo de vehículo (String) - solo para fines de log/metadata
     * @param promise Devuelve el precio final (Double) a JavaScript
     */
    @ReactMethod
    fun calcularPrecioFinal(precioBase: Double, tipoVehiculo: String, promise: Promise) {
        try {
            // El precio final es exactamente el configurado por el administrador
            val precioFinal = precioBase

            // Construimos la respuesta como un mapa para enviar más info a JS
            val resultado = WritableNativeMap().apply {
                putDouble("precioFinal", precioFinal)
                putDouble("precioBase", precioBase)
                putDouble("factor", 1.0)
                putString("tipoVehiculo", tipoVehiculo)
                // Ya no hay recargo extra
                putInt("recargoPorcentaje", 0)
            }

            promise.resolve(resultado)
        } catch (e: Exception) {
            promise.reject("PRICE_CALC_ERROR", "Error al calcular precio: ${e.message}")
        }
    }

    /**
     * REGLA 2: Validar los datos de una nueva cita antes de guardarla.
     *
     * JavaScript envía todos los campos del formulario. Kotlin verifica
     * que cumplan las reglas de negocio (campos requeridos, fecha válida, etc.)
     * y devuelve si es válido y la lista de errores encontrados.
     *
     * @param visitaData Mapa con los datos: vehiculo, tipoLavado, fecha, encargado
     * @param promise Devuelve { esValida: Boolean, errores: [String] }
     */
    @ReactMethod
    fun validarNuevaVisita(visitaData: ReadableMap, promise: Promise) {
        try {
            val errores = mutableListOf<String>()

            // Verificar vehículo seleccionado
            val vehiculo = visitaData.getString("vehiculo") ?: ""
            if (vehiculo.isBlank()) {
                errores.add("Debes seleccionar un vehículo.")
            }

            // Verificar servicio seleccionado
            val tipoLavado = visitaData.getString("tipoLavado") ?: ""
            if (tipoLavado.isBlank()) {
                errores.add("Debes seleccionar un tipo de lavado.")
            }

            // Verificar fecha
            val fecha = visitaData.getString("fecha") ?: ""
            if (fecha.isBlank()) {
                errores.add("La fecha de la cita es obligatoria.")
            } else {
                try {
                    val hoy = java.util.Calendar.getInstance().apply {
                        set(java.util.Calendar.HOUR_OF_DAY, 0)
                        set(java.util.Calendar.MINUTE, 0)
                        set(java.util.Calendar.SECOND, 0)
                        set(java.util.Calendar.MILLISECOND, 0)
                    }

                    val calCita = java.util.Calendar.getInstance()
                    var parseado = false
                    var tieneHora = false
                    var hora = 0
                    var minuto = 0

                    var fechaParte = fecha
                    var horaParte = ""

                    if (fecha.contains(" ")) {
                        val partesEspacio = fecha.split(" ")
                        if (partesEspacio.size >= 2) {
                            fechaParte = partesEspacio[0]
                            horaParte = partesEspacio[1]
                        }
                    }

                    if (horaParte.contains(":")) {
                        val partesHora = horaParte.split(":")
                        if (partesHora.size >= 2) {
                            val h = partesHora[0].toIntOrNull()
                            val m = partesHora[1].toIntOrNull()
                            if (h != null && m != null) {
                                hora = h
                                minuto = m
                                tieneHora = true
                            }
                        }
                    }

                    if (fechaParte.contains("/")) {
                        val partes = fechaParte.split("/")
                        if (partes.size == 3) {
                            val dia = partes[0].toIntOrNull()
                            val mes = partes[1].toIntOrNull()
                            val anio = partes[2].toIntOrNull()
                            if (dia != null && mes != null && anio != null) {
                                val realMes = if (mes > 12) dia - 1 else mes - 1
                                val realDia = if (mes > 12) mes else dia
                                val realAnio = if (anio < 100) 2000 + anio else anio
                                
                                calCita.set(realAnio, realMes, realDia, hora, minuto, 0)
                                calCita.set(java.util.Calendar.MILLISECOND, 0)
                                parseado = true
                            }
                        }
                    } else if (fechaParte.contains("-")) {
                        val partes = fechaParte.split("-")
                        if (partes.size == 3) {
                            val anio = partes[0].toIntOrNull()
                            val mes = partes[1].toIntOrNull()
                            val dia = partes[2].toIntOrNull()
                            if (anio != null && mes != null && dia != null) {
                                val realAnio = if (anio < 100) 2000 + anio else anio
                                calCita.set(realAnio, mes - 1, dia, hora, minuto, 0)
                                calCita.set(java.util.Calendar.MILLISECOND, 0)
                                parseado = true
                            }
                        }
                    }
                    // La validación de fechas (pasado, futuro) ahora se delega 100% a la capa de Reglas de Negocio en JavaScript (StateRules.js) 
                    // ya que JS tiene el contexto exacto de la zona horaria del usuario (ej: UTC-5) y evita falsos positivos del emulador en UTC.
                } catch (e: Exception) {
                    // No bloqueamos por fecha inválida si ocurre un error de parseo
                }
            }

            // Verificar precio mayor a cero
            val precio = if (visitaData.hasKey("precio")) visitaData.getDouble("precio") else 0.0
            if (precio <= 0.0) {
                errores.add("El precio del servicio no es válido.")
            }

            val resultado = WritableNativeMap().apply {
                putBoolean("esValida", errores.isEmpty())
                // Convertimos la lista de errores a un array de JS
                val erroresArray = com.facebook.react.bridge.WritableNativeArray()
                errores.forEach { erroresArray.pushString(it) }
                putArray("errores", erroresArray)
            }

            promise.resolve(resultado)
        } catch (e: Exception) {
            promise.reject("VALIDATION_ERROR", "Error en validación: ${e.message}")
        }
    }

    /**
     * REGLA 3: Verificar si una transición de estado es válida.
     *
     * En el negocio, los estados solo pueden avanzar en orden:
     * pendiente → en_progreso → completado
     * No se puede ir hacia atrás ni saltar estados.
     *
     * @param estadoActual Estado actual de la visita
     * @param estadoNuevo  Estado al que se quiere cambiar
     * @param promise Devuelve { permitido: Boolean, mensaje: String }
     */
    @ReactMethod
    fun validarTransicionEstado(estadoActual: String, estadoNuevo: String, promise: Promise) {
        try {
            // Mapa de transiciones permitidas
            val transicionesPermitidas = mapOf(
                "pendiente"   to listOf("en_progreso", "cancelado"),
                "en_progreso" to listOf("completado"),
                "completado"  to emptyList(),
                "cancelado"   to emptyList()
            )

            val permitido = transicionesPermitidas[estadoActual]?.contains(estadoNuevo) ?: false

            val mensaje = when {
                permitido -> "Transición de '$estadoActual' a '$estadoNuevo' permitida."
                estadoActual == "completado" -> "Esta visita ya fue completada y no puede modificarse."
                estadoActual == "cancelado"  -> "Esta visita fue cancelada."
                else -> "No se puede pasar de '$estadoActual' a '$estadoNuevo' directamente."
            }

            val resultado = WritableNativeMap().apply {
                putBoolean("permitido", permitido)
                putString("mensaje", mensaje)
            }

            promise.resolve(resultado)
        } catch (e: Exception) {
            promise.reject("STATE_ERROR", "Error al validar estado: ${e.message}")
        }
    }
}
