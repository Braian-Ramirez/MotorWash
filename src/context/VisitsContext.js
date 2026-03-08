import React, { createContext, useState } from 'react';

export const VisitsContext = createContext();

export const VisitsProvider = ({ children }) => {
    // Aquí guardaremos las citas agendadas
    const [visitas, setVisitas] = useState([
        {
            id: 1,
            fecha: '15/10/2026',
            tipoLavado: 'Lavado Completo + Encerado',
            encargado: 'Carlos Ruiz',
            vehiculo: 'Toyota Rojo (ABC-123)'
        }
    ]);

    // Función para agendar una nueva visita
    const addVisit = (nuevaVisita) => {
        nuevaVisita.id = Date.now(); // ID único temporal
        nuevaVisita.estado = 'pendiente';
        setVisitas([...visitas, nuevaVisita]);
    };

    const completarVisita = (id) => {
        setVisitas(visitas.map(v => v.id === id ? { ...v, estado: 'completado' } : v));
    };
    return (
        <VisitsContext.Provider value={{ visitas, addVisit, completarVisita }}>
            {children}
        </VisitsContext.Provider>
    );
};
