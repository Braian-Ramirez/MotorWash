/**
 * APLICACIÓN — Contexto de Vehículos
 *
 * Responsabilidad: Gestionar el estado global de los vehículos del usuario.
 *
 * Delega el registro (con validación Kotlin) al caso de uso RegisterVehicleUseCase.
 * Las operaciones de edición/borrado van directo al repositorio ya que no
 * requieren validación de negocio adicional.
 *
 * Capa: Application → Context
 */
import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';
import { listenToUserVehicles, updateVehicleInDB, deleteVehicleFromDB } from '../../infrastructure/firebase/VehiclesRepository';
import { registerVehicleUseCase } from '../usecases/RegisterVehicleUseCase';

export const VehiclesContext = createContext();

export const VehiclesProvider = ({ children }) => {
    const [vehiculos, setVehiculos] = useState([]);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        if (!user) { setVehiculos([]); return; }
        const unsubscribe = listenToUserVehicles(user.uid, (data) => setVehiculos(data));
        return () => unsubscribe();
    }, [user]);

    /** Registra un vehículo nuevo con validación de Kotlin. */
    const addVehicle = async (nuevoVehiculo) => {
        const result = await registerVehicleUseCase(nuevoVehiculo, user?.uid);
        if (!result.success) console.error("[VehiclesContext] Error al agregar:", result.error);
        return result;
    };

    /** Actualiza datos de un vehículo existente. */
    const updateVehicle = async (vehiculoEditado) => {
        const { id, ...datos } = vehiculoEditado;
        const result = await updateVehicleInDB(id, datos);
        if (!result.success) console.error("[VehiclesContext] Error al actualizar:", result.error);
        return result;
    };

    /** Elimina un vehículo del sistema. */
    const removeVehicle = async (id) => {
        const result = await deleteVehicleFromDB(id);
        if (!result.success) console.error("[VehiclesContext] Error al eliminar:", result.error);
        return result;
    };

    return (
        <VehiclesContext.Provider value={{ vehiculos, addVehicle, updateVehicle, removeVehicle }}>
            {children}
        </VehiclesContext.Provider>
    );
};
