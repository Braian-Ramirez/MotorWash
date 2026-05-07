/**
 * APLICACIÓN — Contexto de Visitas
 *
 * Responsabilidad: Gestionar el estado global de las visitas y exponer
 * las acciones al árbol de componentes.
 *
 * Este contexto es un proveedor de estado puro: delega la orquestación
 * de lógica de negocio a los casos de uso (UseCases) y la persistencia
 * al repositorio (Infrastructure).
 *
 * Capa: Application → Context
 */
import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';
import { listenToUserVisits } from '../../infrastructure/firebase/VisitsRepository';
import { addVisitUseCase } from '../usecases/AddVisitUseCase';
import { iniciarVisitaUseCase, completarVisitaUseCase, calificarVisitaUseCase } from '../usecases/UpdateVisitStatusUseCase';

export const VisitsContext = createContext();

export const VisitsProvider = ({ children }) => {
    const [visitas, setVisitas] = useState([]);
    const { user } = useContext(AuthContext);

    // Sincronización en tiempo real con Firebase
    useEffect(() => {
        if (!user) { setVisitas([]); return; }
        const unsubscribe = listenToUserVisits(user, (data) => setVisitas(data));
        return () => unsubscribe();
    }, [user]);

    /** Agenda una nueva visita. Orquestado por AddVisitUseCase. */
    const addVisit = async (nuevaVisita) =>
        await addVisitUseCase(nuevaVisita, user?.uid);

    /** Inicia una visita. Orquestado por UpdateVisitStatusUseCase. */
    const iniciarVisita = async (id, nombreEncargado = null) => {
        const visita = visitas.find(v => v.id === id);
        return await iniciarVisitaUseCase(id, visita?.estado, nombreEncargado);
    };

    /** Completa una visita. Orquestado por UpdateVisitStatusUseCase. */
    const completarVisita = async (id) => {
        const visita = visitas.find(v => v.id === id);
        return await completarVisitaUseCase(id, visita?.estado);
    };

    /** Califica una visita completada. Orquestado por UpdateVisitStatusUseCase. */
    const calificarVisita = async (id, estrellas, comentario) =>
        await calificarVisitaUseCase(id, estrellas, comentario);

    return (
        <VisitsContext.Provider value={{ visitas, addVisit, completarVisita, iniciarVisita, calificarVisita }}>
            {children}
        </VisitsContext.Provider>
    );
};
