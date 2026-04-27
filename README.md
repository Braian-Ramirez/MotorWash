# 🚗 MotorWash - Gestión de Autolavado (Arquitectura Híbrida)

![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Kotlin](https://img.shields.io/badge/Kotlin-0095D5?style=for-the-badge&logo=kotlin&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)

**MotorWash** es una plataforma móvil avanzada diseñada para la gestión integral de centros de embellecimiento automotriz. El proyecto destaca por su **arquitectura desacoplada**, donde la interfaz de usuario se maneja con React Native y la lógica de negocio crítica reside en módulos nativos desarrollados en **Kotlin**.

## 🏗️ Arquitectura del Proyecto

A diferencia de las aplicaciones híbridas estándar, MotorWash utiliza un **Native Bridge** personalizado para delegar las reglas de dominio al sistema operativo, garantizando mayor seguridad y rendimiento.

*   **Frontend**: React Native (Expo) para una experiencia de usuario fluida y multiplataforma.
*   **Business Logic Layer (BLL)**: Módulos nativos en **Kotlin** que actúan como un "servidor interno" dentro de la app.
*   **Backend**: Firebase (Authentication & Firestore) para persistencia en tiempo real.
*   **Bridge**: Comunicación bidireccional asíncrona mediante el `ReactContextBaseJavaModule`.

## ✨ Características Principales

### 🛠️ Lógica de Negocio en Kotlin (Nativa)
- **Cálculo Dinámico de Precios**: Algoritmo nativo que aplica recargos automáticos según la clasificación del vehículo (SUV, Pickup, Camión, etc.).
- **Validación de Dominios**: Validador de placas vehiculares bajo el estándar colombiano (ABC-123 / ABC-12D).
- **Máquina de Estados**: Control nativo de transiciones de servicio (Pendiente → En Progreso → Completado) para evitar saltos lógicos de estado.

### 📱 Funcionalidades de la App
- **Gestión de Roles**: Flujos de trabajo diferenciados para Administradores, Empleados y Clientes.
- **Agendamiento Inteligente**: Validación nativa de datos antes de la persistencia en la nube.
- **Seguridad**: Persistencia de sesión con `AsyncStorage` y reglas de seguridad de Firestore optimizadas.
- **QR Integration**: Generación y escaneo de códigos para validación de servicios en sitio.

## 🚀 Instalación y Uso

### Requisitos
- Node.js & npm
- Android Studio (con SDK de Android 34+)
- JDK 17+

### Configuración
1.  Clona el repositorio:
    ```bash
    git clone https://github.com/tu-usuario/motorwash.git
    ```
2.  Instala las dependencias:
    ```bash
    npm install
    ```
3.  Configura tus variables de entorno en un archivo `.env`:
    ```env
    EXPO_PUBLIC_FIREBASE_API_KEY=tu_api_key
    ...
    ```
4.  Ejecuta la compilación nativa:
    ```bash
    npx expo run:android
    ```

## 🧠 Por qué esta Arquitectura?
Este proyecto demuestra la capacidad de integrar dos mundos:
1.  **Velocidad de desarrollo**: Usando React para iteraciones rápidas en la UI.
2.  **Robustez y Mantenibilidad**: Centralizando las reglas de negocio en un lenguaje de tipado fuerte como Kotlin, permitiendo que la lógica sea compartida y verificable a nivel de sistema.

---
