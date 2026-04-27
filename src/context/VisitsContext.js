import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';
import {
    calificarVisitaInDB, iniciarVisitaInDB,
    crearVisitaInDB, completarVisitaInDB,
    listenToUserVisits
} from '../services/VisitsService';
// 🔗 Importamos las funciones de lógica de negocio desde el puente Kotlin
import { validarNuevaVisita, validarTransicionEstado } from '../native/NativeBridge';

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
        if (!user) return { success: false, error: 'No user' };

        // 🔗 KOTLIN: Valida los datos antes de tocar Firebase
        const validacion = await validarNuevaVisita(nuevaVisita);
        if (!validacion.esValida) {
            return { success: false, error: validacion.errores.join('\n') };
        }

        // Le pasamos la visita completa MÁS unos datos extra al servicio
        const visitaFija = {
            ...nuevaVisita,
            estado: 'pendiente',
            fechaCreado: new Date().toISOString()
        };

        const result = await crearVisitaInDB(visitaFija, user.uid);
        if (!result.success) console.error("Error al agendar:", result.error);
        return result; // ¡Importante devolverlo para extraer el ID!
    };

    // Función completar visita
    const completarVisita = async (id) => {
        // 🔗 KOTLIN: Verifica que la transición de estado sea válida
        const visita = visitas.find(v => v.id === id);
        if (visita) {
            const transicion = await validarTransicionEstado(visita.estado, 'completado');
            if (!transicion.permitido) {
                console.warn("Kotlin bloqueó la operación:", transicion.mensaje);
                return { success: false, error: transicion.mensaje };
            }
        }
        const result = await completarVisitaInDB(id);
        if (!result.success) console.error("Error al completar visita:", result.error);
        return result;
    };

    // Función iniciar visita
    const iniciarVisita = async (id, nombreEncargado = null) => {
        // 🔗 KOTLIN: Verifica que la transición de estado sea válida
        const visita = visitas.find(v => v.id === id);
        if (visita) {
            const transicion = await validarTransicionEstado(visita.estado, 'en_progreso');
            if (!transicion.permitido) {
                console.warn("Kotlin bloqueó la operación:", transicion.mensaje);
                return { success: false, error: transicion.mensaje };
            }
        }
        const result = await iniciarVisitaInDB(id, nombreEncargado);
        if (!result.success) console.error("Error al iniciar visita:", result.error);
        return result;
    };

    // Calificar visita
    const calificarVisita = async (id, estrellas, comentario) => {
        const result = await calificarVisitaInDB(id, estrellas, comentario);
        if (!result.success) console.error("Error al calificar la visita:", result.error);
    };

    return (
        <VisitsContext.Provider value={{
            visitas,
            addVisit, completarVisita,
            iniciarVisita, calificarVisita
        }}>
            {children}
        </VisitsContext.Provider>
    );
};
