package com.motorwash.app

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.WritableNativeMap

/**
 * MÓDULO DE LÓGICA DE NEGOCIO: VEHÍCULOS
 *
 * Centraliza todas las reglas de negocio relacionadas con vehículos:
 * - Validación de formato de placa (estándar colombiano ABC-123).
 * - Clasificación de vehículos por tamaño.
 * - Verificación de datos completos antes de guardar.
 *
 * React Native envía el texto crudo del formulario y Kotlin decide
 * si es válido o no, aplicando las reglas del dominio del negocio.
 */
class VehicleBusinessModule(reactContext: ReactApplicationContext)
    : ReactContextBaseJavaModule(reactContext) {

    // Nombre con el que JavaScript importará este módulo:
    // const { VehicleBusinessLogic } = NativeModules;
    override fun getName(): String = "VehicleBusinessLogic"

    /**
     * REGLA 1: Validar el formato de una placa vehicular.
     *
     * El estándar colombiano acepta:
     *  - Vehículos particulares/motos: ABC-123 (3 letras + guión + 3 números)
     *  - Placas de motocicletas: ABC-12D (3 letras + guión + 2 números + 1 letra)
     *
     * JavaScript envía el texto de la placa tal como lo escribió el usuario.
     * Kotlin normaliza (mayúsculas, quita espacios) y valida el formato.
     *
     * @param placa Texto de la placa ingresado por el usuario
     * @param promise Devuelve { esValida: Boolean, placaNormalizada: String, mensaje: String }
     */
    @ReactMethod
    fun validarPlaca(placa: String, promise: Promise) {
        try {
            // Normalizamos: mayúsculas y sin espacios
            val placaNormalizada = placa.uppercase().trim().replace(" ", "")

            // Patrones válidos para Colombia
            val patronParticular = Regex("^[A-Z]{3}-?[0-9]{3}$")   // ABC-123 o ABC123
            val patronMoto      = Regex("^[A-Z]{3}-?[0-9]{2}[A-Z]$") // ABC-12D o ABC12D

            val esValida = patronParticular.matches(placaNormalizada) ||
                           patronMoto.matches(placaNormalizada)

            // Formateamos la placa con guión si no lo tiene
            val placaFormateada = if (esValida && !placaNormalizada.contains("-")) {
                "${placaNormalizada.take(3)}-${placaNormalizada.drop(3)}"
            } else {
                placaNormalizada
            }

            val mensaje = when {
                esValida -> "Placa válida."
                placa.isBlank() -> "La placa no puede estar vacía."
                else -> "Formato de placa inválido. Use el formato ABC-123 (particular) o ABC-12D (moto)."
            }

            val resultado = WritableNativeMap().apply {
                putBoolean("esValida", esValida)
                putString("placaNormalizada", if (esValida) placaFormateada else placa)
                putString("mensaje", mensaje)
            }

            promise.resolve(resultado)
        } catch (e: Exception) {
            promise.reject("PLATE_VALIDATION_ERROR", "Error al validar placa: ${e.message}")
        }
    }

    /**
     * REGLA 2: Validar todos los datos de un vehículo nuevo.
     *
     * Verifica que todos los campos requeridos estén completos y
     * que la placa tenga un formato correcto antes de guardar en Firebase.
     * Así evitamos guardar datos corruptos en la base de datos.
     *
     * @param tipo  Tipo de vehículo (Sedán, SUV, etc.)
     * @param marca Marca del vehículo
     * @param color Color del vehículo
     * @param placa Placa del vehículo
     * @param promise Devuelve { esValido: Boolean, errores: [String], placaNormalizada: String }
     */
    @ReactMethod
    fun validarDatosVehiculo(tipo: String, marca: String, color: String, placa: String, promise: Promise) {
        try {
            val errores = mutableListOf<String>()

            if (tipo.isBlank()) errores.add("El tipo de vehículo es obligatorio.")
            if (marca.isBlank()) errores.add("La marca del vehículo es obligatoria.")
            if (color.isBlank()) errores.add("El color del vehículo es obligatorio.")

            // Validamos la placa usando la misma lógica de la Regla 1
            val placaNormalizada = placa.uppercase().trim().replace(" ", "")
            val patronParticular = Regex("^[A-Z]{3}-?[0-9]{3}$")
            val patronMoto = Regex("^[A-Z]{3}-?[0-9]{2}[A-Z]$")
            val placaValida = patronParticular.matches(placaNormalizada) || patronMoto.matches(placaNormalizada)

            if (placa.isBlank()) {
                errores.add("La placa del vehículo es obligatoria.")
            } else if (!placaValida) {
                errores.add("El formato de la placa no es válido (ej: ABC-123).")
            }

            // Formateamos la placa con guión
            val placaFinal = if (placaValida && !placaNormalizada.contains("-")) {
                "${placaNormalizada.take(3)}-${placaNormalizada.drop(3)}"
            } else {
                placaNormalizada
            }

            val resultado = WritableNativeMap().apply {
                putBoolean("esValido", errores.isEmpty())
                putString("placaNormalizada", placaFinal)
                val erroresArray = com.facebook.react.bridge.WritableNativeArray()
                errores.forEach { erroresArray.pushString(it) }
                putArray("errores", erroresArray)
            }

            promise.resolve(resultado)
        } catch (e: Exception) {
            promise.reject("VEHICLE_VALIDATION_ERROR", "Error al validar vehículo: ${e.message}")
        }
    }

    /**
     * REGLA 3: Obtener la clasificación de tamaño de un vehículo.
     *
     * Centraliza en un solo lugar el criterio de clasificación del negocio.
     * Esta clasificación es usada por VisitsBusinessModule para calcular
     * los recargos de precio correctamente.
     *
     * @param tipoVehiculo Tipo del vehículo
     * @param promise Devuelve { clasificacion: String, descripcion: String }
     *                Clasificaciones: "PEQUENO", "MEDIANO", "GRANDE", "EXTRA_GRANDE"
     */
    @ReactMethod
    fun clasificarVehiculo(tipoVehiculo: String, promise: Promise) {
        try {
            val tipo = tipoVehiculo.lowercase().trim()

            val clasificacion = when (tipo) {
                "sedán", "sedan", "hatchback", "coupé", "coupe" -> "PEQUENO"
                "suv", "crossover"                               -> "MEDIANO"
                "camioneta", "pickup", "van", "minivan"          -> "GRANDE"
                "bus", "camión", "camion", "furgón", "furgon"   -> "EXTRA_GRANDE"
                else                                              -> "PEQUENO"
            }

            val descripcion = when (clasificacion) {
                "PEQUENO"     -> "Vehículo pequeño. Se aplica el precio base sin recargo."
                "MEDIANO"     -> "Vehículo mediano. Se aplica un recargo del 25%."
                "GRANDE"      -> "Vehículo grande. Se aplica un recargo del 40%."
                "EXTRA_GRANDE"-> "Vehículo extra grande. Se aplica un recargo del 80%."
                else          -> "Clasificación estándar."
            }

            val resultado = WritableNativeMap().apply {
                putString("clasificacion", clasificacion)
                putString("descripcion", descripcion)
            }

            promise.resolve(resultado)
        } catch (e: Exception) {
            promise.reject("CLASSIFICATION_ERROR", "Error al clasificar vehículo: ${e.message}")
        }
    }
}
