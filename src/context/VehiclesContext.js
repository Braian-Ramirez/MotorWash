import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';
// Importamos nuestro nuevo MODELO (Servicios)
import {
    listenToUserVehicles,
    createVehicleInDB,
    updateVehicleInDB,
    deleteVehicleFromDB
} from '../services/VehiclesService';

export const VehiclesContext = createContext();

export const VehiclesProvider = ({ children }) => {
    const [vehiculos, setVehiculos] = useState([]);
    const { user } = useContext(AuthContext);

    // Usamos el modelo para la Búsqueda (Controlador)
    useEffect(() => {
        if (!user) {
            setVehiculos([]);
            return;
        }

        // Llamamos al servicio. Él hará el trabajo de Firebase y nos devolverá
        // la lista a través de la función (callback) que le pasamos.
        const unsubscribe = listenToUserVehicles(user.uid, (data) => {
            setVehiculos(data);
        });

        return () => unsubscribe();
    }, [user]);

    // Usamos el modelo para AGREGAR (Controlador)
    const addVehicle = async (nuevoVehiculo) => {
        if (!user) return;
        // Delegamos la escritura a la base de datos al servicio
        const result = await createVehicleInDB(nuevoVehiculo, user.uid);
        if (!result.success) {
            // Podríamos mostrar un Alert aquí en el futuro
            console.error("Fallo controlador (add):", result.error);
        }
    };

    // Usamos el modelo para EDITAR (Controlador)
    const updateVehicle = async (vehiculoEditado) => {
        const { id, ...datos } = vehiculoEditado;
        const result = await updateVehicleInDB(id, datos);
        if (!result.success) console.error("Fallo controlador (update):", result.error);
    };

    // Usamos el modelo para ELIMINAR (Controlador)
    const removeVehicle = async (id) => {
        const result = await deleteVehicleFromDB(id);
        if (!result.success) console.error("Fallo controlador (remove):", result.error);
    };

    return (
        // 3. ENCHUFAMOS LOS DATOS A LA NUBE
        // Todo lo que pongamos en "value" estará disponible para CUALQUIER pantalla
        <VehiclesContext.Provider value={{ vehiculos, addVehicle, updateVehicle, removeVehicle }}>
            {children}
        </VehiclesContext.Provider>
    );
};
