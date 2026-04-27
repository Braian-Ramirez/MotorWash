package com.motorwash.app

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager

/**
 * EMPAQUETADOR DE MÓDULOS NATIVOS: MotorWashPackage
 *
 * React Native requiere que todos los módulos nativos estén
 * agrupados dentro de un "Package". Este archivo actúa como el
 * índice o catálogo de todos los módulos Kotlin de MotorWash.
 *
 * Para agregar un nuevo módulo de lógica de negocio en el futuro:
 * 1. Crea tu nuevo archivo XxxModule.kt en esta misma carpeta.
 * 2. Agrégalo a la lista en createNativeModules() aquí abajo.
 * 3. Registra el módulo en JS dentro de src/native/NativeBridge.js.
 */
class MotorWashPackage : ReactPackage {

    /**
     * Registra todos los módulos nativos (lógica de negocio en Kotlin).
     * Cada módulo agregado aquí queda disponible en JavaScript vía NativeModules.
     */
    override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> {
        return listOf(
            // Módulo 1: Lógica de negocio de Visitas
            // JS lo llama como: NativeModules.VisitsBusinessLogic
            VisitsBusinessModule(reactContext),

            // Módulo 2: Lógica de negocio de Vehículos
            // JS lo llama como: NativeModules.VehicleBusinessLogic
            VehicleBusinessModule(reactContext)
        )
    }

    /**
     * Para módulos de UI nativos (componentes visuales).
     * Por ahora vacío: toda la UI permanece en React Native (JavaScript).
     */
    override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> {
        return emptyList()
    }
}
