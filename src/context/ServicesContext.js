import React, { createContext, useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { collection, onSnapshot, addDoc, updateDoc, doc } from 'firebase/firestore';

export const ServicesContext = createContext();

export const ServicesProvider = ({ children }) => {
    // 💡 Estos son los servicios que el admin podrá cambiar
    const [servicios, setServicios] = useState([]);

    // 🔄 Sincronizar con Firebase en tiempo real
    useEffect(() => {
        const q = collection(db, "servicios");
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const lista = [];
            querySnapshot.forEach((doc) => {
                lista.push({ ...doc.data(), id: doc.id });
            });
            setServicios(lista);
        });
        return () => unsubscribe();
    }, []);

    // Función para actualizar un servicio existente
    const actualizarServicio = async (id, nuevosDatos) => {
        try {
            const docRef = doc(db, "servicios", id);
            await updateDoc(docRef, nuevosDatos);
        } catch (error) {
            console.error("Error al actualizar servicio:", error);
        }
    };

    // Función para agregar uno nuevo
    const agregarServicio = async (nuevoServicio) => {
        try {
            await addDoc(collection(db, "servicios"), nuevoServicio);
        } catch (error) {
            console.error("Error al agregar servicio:", error);
        }
    };

    return (
        <ServicesContext.Provider value={{ servicios, actualizarServicio, agregarServicio }}>
            {children}
        </ServicesContext.Provider>
    );
};
