/**
 * APLICACIÓN — Contexto de Servicios
 *
 * Responsabilidad: Gestionar el catálogo de servicios de lavado.
 * Delega la persistencia al repositorio de infraestructura.
 *
 * Capa: Application → Context
 */
import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';
import { listenToServices, updateServiceInDB, createServiceInDB } from '../../infrastructure/firebase/ServicesRepository';

export const ServicesContext = createContext();

export const ServicesProvider = ({ children }) => {
    const [servicios, setServicios] = useState([]);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        if (!user) { setServicios([]); return; }
        const unsubscribe = listenToServices((data) => setServicios(data));
        return () => unsubscribe();
    }, [user]);

    const actualizarServicio = async (id, nuevosDatos) => {
        const result = await updateServiceInDB(id, nuevosDatos);
        if (!result.success) console.error("[ServicesContext] Error al actualizar:", result.error);
        return result;
    };

    const agregarServicio = async (nuevoServicio) => {
        const result = await createServiceInDB(nuevoServicio);
        if (!result.success) console.error("[ServicesContext] Error al agregar:", result.error);
        return result;
    };

    return (
        <ServicesContext.Provider value={{ servicios, actualizarServicio, agregarServicio }}>
            {children}
        </ServicesContext.Provider>
    );
};
