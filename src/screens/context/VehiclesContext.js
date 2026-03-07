import React, { createContext, useState } from 'react';

// 1. CREAMOS LA "NUBE" (El Contexto)
// Esto es lo que las pantallas van a importar para conectarse
export const VehiclesContext = createContext();

// 2. CREAMOS EL PROVEEDOR (El componente que envuelve a la app)
// Este componente guardará los datos reales y se los regalará a los "children" (pantallas)
export const VehiclesProvider = ({ children }) => {

    // Aquí mudamos la lista de vehículos que tenías en VehiclesScreen
    // ¡Ahora vive en la nube global!
    const [vehiculos, setVehiculos] = useState([
        { id: 1, tipo: 'Carro', color: 'Rojo', marca: 'Toyota', placa: 'ABC-123' },
        { id: 2, tipo: 'Camioneta', color: 'Gris', marca: 'Ford', placa: 'XYZ-987' },
    ]);

    // Función global para AGREGAR un vehículo
    const addVehicle = (nuevoVehiculo) => {
        // Le asignamos un ID falso por ahora basado en el tiempo
        nuevoVehiculo.id = Date.now();
        // Agregamos el nuevo al final de la lista existente
        setVehiculos([...vehiculos, nuevoVehiculo]);
    };

    // Función global para EDITAR un vehículo
    const updateVehicle = (vehiculoEditado) => {
        // Buscamos cuál es el carro viejo, y lo reemplazamos por el editado
        const listaActualizada = vehiculos.map(vehiculoViejo =>
            vehiculoViejo.id === vehiculoEditado.id ? vehiculoEditado : vehiculoViejo
        );
        setVehiculos(listaActualizada);
    };

    return (
        // 3. ENCHUFAMOS LOS DATOS A LA NUBE
        // Todo lo que pongamos en "value" estará disponible para CUALQUIER pantalla
        <VehiclesContext.Provider value={{ vehiculos, addVehicle, updateVehicle }}>
            {children}
        </VehiclesContext.Provider>
    );
};
