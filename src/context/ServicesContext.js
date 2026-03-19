import React, { createContext, useState, useEffect } from 'react';
import { listenToServices, updateServiceInDB, createServiceInDB } from '../services/ServicesService';

export const ServicesContext = createContext();

export const ServicesProvider = ({ children }) => {
    // 💡 Estos son los servicios que el admin podrá cambiar
    const [servicios, setServicios] = useState([]);

    // 🔄 Sincronizar (Delegado al Modelo)
    useEffect(() => {
        const unsubscribe = listenToServices((data) => {
            setServicios(data);
        });
        return () => unsubscribe();
    }, []);

    // Función para actualizar un servicio existente
    const actualizarServicio = async (id, nuevosDatos) => {
        const result = await updateServiceInDB(id, nuevosDatos);
        if (!result.success) console.error("Error al actualizar servicio:", result.error);
    };

    // Función para agregar uno nuevo
    const agregarServicio = async (nuevoServicio) => {
        const result = await createServiceInDB(nuevoServicio);
        if (!result.success) console.error("Error al agregar servicio:", result.error);
    };

    return (
        <ServicesContext.Provider value={{ servicios, actualizarServicio, agregarServicio }}>
            {children}
        </ServicesContext.Provider>
    );
};
