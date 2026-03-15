import React, { createContext, useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { collection, onSnapshot, updateDoc, doc } from 'firebase/firestore';

export const UsersContext = createContext();

export const UsersProvider = ({ children }) => {
    const [usuarios, setUsuarios] = useState([]);

    // 🔄 Sincronizar con Firebase en tiempo real (Todos los usuarios para el Admin)
    useEffect(() => {
        const q = collection(db, "usuarios");
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const lista = [];
            querySnapshot.forEach((doc) => {
                lista.push({ ...doc.data(), id: doc.id });
            });
            setUsuarios(lista);
        });
        return () => unsubscribe();
    }, []);

    // Función que usará el admin para cambiar el rol
    const cambiarRol = async (id, nuevoRol) => {
        try {
            const docRef = doc(db, "usuarios", id);
            await updateDoc(docRef, { rol: nuevoRol });
        } catch (error) {
            console.error("Error al cambiar rol:", error);
        }
    };

    return (
        <UsersContext.Provider value={{ usuarios, cambiarRol }}>
            {children}
        </UsersContext.Provider>
    );
};
