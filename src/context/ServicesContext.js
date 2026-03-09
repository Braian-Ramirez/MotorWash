import React, { createContext, useState } from 'react';

export const ServicesContext = createContext();

export const ServicesProvider = ({ children }) => {
    // 💡 Estos son los servicios que el admin podrá cambiar
    const [servicios, setServicios] = useState([
        { id: 1, titulo: 'Lavado Básico', descripcion: 'Exterior + Aspirado básico', precio: 15 },
        { id: 2, titulo: 'Lavado Pro', descripcion: 'Exterior + Interior profundo + Cera', precio: 25 },
        { id: 3, titulo: 'Lavado Premium', descripcion: 'Motor + Chasis + Tapicería', precio: 45 },
    ]);

    // Función para actualizar un servicio existente
    const actualizarServicio = (id, nuevosDatos) => {
        setServicios(servicios.map(s =>
            s.id === id ? { ...s, ...nuevosDatos } : s
        ));
    };

    // Función para agregar uno nuevo
    const agregarServicio = (nuevoServicio) => {
        setServicios([...servicios, { ...nuevoServicio, id: Date.now() }]);
    };

    return (
        <ServicesContext.Provider value={{ servicios, actualizarServicio, agregarServicio }}>
            {children}
        </ServicesContext.Provider>
    );
};
