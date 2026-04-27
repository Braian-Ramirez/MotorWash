import React, { createContext, useState, useEffect, useContext } from 'react';
import { listenToServices, updateServiceInDB, createServiceInDB } from '../services/ServicesService';
import { AuthContext } from './AuthContext';

export const ServicesContext = createContext();

export const ServicesProvider = ({ children }) => {
    const [servicios, setServicios] = useState([]);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        if (!user) {
            setServicios([]);
            return;
        }

        const unsubscribe = listenToServices((data) => {
            setServicios(data);
        });
        return () => unsubscribe();
    }, [user]);

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
