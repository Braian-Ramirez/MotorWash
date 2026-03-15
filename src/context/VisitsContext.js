import React, { createContext, useState, useEffect, useContext } from 'react';
import { db } from '../config/firebase';
import { collection, onSnapshot, query, where, addDoc, updateDoc, doc } from 'firebase/firestore';
import { AuthContext } from './AuthContext';

export const VisitsContext = createContext();

export const VisitsProvider = ({ children }) => {
    // Aquí guardaremos las citas agendadas
    const [visitas, setVisitas] = useState([]);
    const { user } = useContext(AuthContext);

    // 🔄 Sincronizar con Firebase en tiempo real
    useEffect(() => {
        if (!user) {
            setVisitas([]);
            return;
        }

        let q = collection(db, "visitas");
        
        // Si es cliente, solo ve sus propias citas
        if (user.role === 'client') {
            q = query(collection(db, "visitas"), where("userId", "==", user.uid));
        }
        // Si es admin o empleado, ve todas por ahora (puedes filtrar por encargado luego)

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const lista = [];
            querySnapshot.forEach((doc) => {
                lista.push({ ...doc.data(), id: doc.id });
            });
            setVisitas(lista);
        });

        return () => unsubscribe();
    }, [user]);

    // Función para agendar una nueva visita
    const addVisit = async (nuevaVisita) => {
        if (!user) return;
        try {
            await addDoc(collection(db, "visitas"), {
                ...nuevaVisita,
                userId: user.uid,
                estado: 'pendiente',
                fechaCreado: new Date().toISOString()
            });
        } catch (error) {
            console.error("Error al agendar visita:", error);
        }
    };

    const completarVisita = async (id) => {
        try {
            const docRef = doc(db, "visitas", id);
            await updateDoc(docRef, { estado: 'completado' });
        } catch (error) {
            console.error("Error al completar visita:", error);
        }
    };

    // Nueva función para iniciar el temporizador
    const iniciarVisita = async (id) => {
        try {
            const docRef = doc(db, "visitas", id);
            await updateDoc(docRef, { 
                estado: 'en_progreso', 
                horaInicio: Date.now() 
            });
        } catch (error) {
            console.error("Error al iniciar visita:", error);
        }
    };

    // Nueva función para calificar el servicio
    const calificarVisita = async (id, estrellas, comentario = '') => {
        try {
            const docRef = doc(db, "visitas", id);
            await updateDoc(docRef, { calificacion: estrellas, comentario });
        } catch (error) {
            console.error("Error al calificar visita:", error);
        }
    };

    return (
        <VisitsContext.Provider value={{ visitas, addVisit, completarVisita, iniciarVisita, calificarVisita }}>
            {children}
        </VisitsContext.Provider>
    );
};
