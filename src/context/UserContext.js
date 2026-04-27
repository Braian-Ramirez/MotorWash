import React, { createContext, useState, useEffect, useContext } from 'react';
import { listenToUsers, updateUserRoleInDB } from '../services/UserService';
import { AuthContext } from './AuthContext';

export const UsersContext = createContext();

export const UsersProvider = ({ children }) => {
    const [usuarios, setUsuarios] = useState([]);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        if (!user) {
            setUsuarios([]);
            return;
        }

        const unsubscribe = listenToUsers((data) => {
            setUsuarios(data);
        });
        return () => unsubscribe();
    }, [user]);

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
