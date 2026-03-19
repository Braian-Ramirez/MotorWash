import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';
import {
    calificarVisitInDB, iniciarVisitInDB,
    crearVisitInDB, completarVisitInDB,
    listenToUserVisits
} from '../services/VisitsService';
export const VisitsContext = createContext();

export const VisitsProvider = ({ children }) => {
    // Aquí guardaremos las citas agendadas
    const [visitas, setVisitas] = useState([]);
    const { user } = useContext(AuthContext);

    // Sincronizar con Firebase en tiempo real
    useEffect(() => {
        if (!user) {
            setVisitas([]);
            return;
        }

        // Llamamos al servicio. Él hará el trabajo de Firebase y nos devolverá
        // la lista a través de la función (callback) que le pasamos.
        const unsubscribe = listenToUserVisits(user, (data) => {
            setVisitas(data);
        });

        return () => unsubscribe();
    }, [user]);

    // Función global para agendar una nueva visita
    const addVisit = async (nuevaVisita) => {
        if (!user) return;

        // Le pasamos la visita completa MÁS unos datos extra al servicio
        const visitaFija = {
            ...nuevaVisita,
            estado: 'pendiente',
            fechaCreado: new Date().toISOString()
        };

        const result = await crearVisitInDB(visitaFija, user.uid);
        if (!result.success) console.error("Error al agendar:", result.error);
    };

    // Función completar visita
    const completarVisita = async (id) => {
        const result = await completarVisitInDB(id);
        if (!result.success) console.error("Error al completar visitia:", result.error);
    }

    // Función iniciar visita
    const iniciarVisita = async (id) => {
        const result = await iniciarVisitInDB(id);
        if (!result.success) console.error("Erroral iniciar visita:", result.error);
    }

    // Calificar visita
    const calificarVisita = async (id, estrellas, comentario) => {
        const result = await calificarVisitInDB(id, estrellas, comentario);
        if (!result.success) console.error("Error al calificar la visita:", result.error);
    }

    return (
        <VisitsContext.Provider value={{
            visitas,
            addVisit, completarVisita,
            iniciarVisita, calificarVisita
        }}>
            {children}

        </VisitsContext.Provider>);
};
