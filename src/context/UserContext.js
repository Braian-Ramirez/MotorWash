import React, { createContext, useState, useEffect } from 'react';
import { listenToUsers, updateUserRoleInDB } from '../services/UserService';

export const UsersContext = createContext();

export const UsersProvider = ({ children }) => {
    const [usuarios, setUsuarios] = useState([]);

    // 🔄 Sincronizar con Modelo en tiempo real (Todos los usuarios para el Admin)
    useEffect(() => {
        const unsubscribe = listenToUsers((data) => {
            setUsuarios(data);
        });
        return () => unsubscribe();
    }, []);

    // Función que usará el admin para cambiar el rol
    const cambiarRol = async (id, nuevoRol) => {
        const result = await updateUserRoleInDB(id, nuevoRol);
        if (!result.success) console.error("Error al cambiar rol:", result.error);
    };

    return (
        <UsersContext.Provider value={{ usuarios, cambiarRol }}>
            {children}
        </UsersContext.Provider>
    );
};
