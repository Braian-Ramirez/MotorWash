/**
 * APLICACIÓN — Contexto de Usuarios
 *
 * Responsabilidad: Gestionar la lista de usuarios del sistema (uso admin).
 * Delega la persistencia al repositorio de infraestructura.
 *
 * Capa: Application → Context
 */
import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';
import { listenToUsers, updateUserRoleInDB } from '../../infrastructure/firebase/UsersRepository';

export const UsersContext = createContext();

export const UsersProvider = ({ children }) => {
    const [usuarios, setUsuarios] = useState([]);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        if (!user) { setUsuarios([]); return; }
        const unsubscribe = listenToUsers((data) => setUsuarios(data));
        return () => unsubscribe();
    }, [user]);

    const cambiarRol = async (id, nuevoRol) => {
        const result = await updateUserRoleInDB(id, nuevoRol);
        if (!result.success) console.error("[UsersContext] Error al cambiar rol:", result.error);
        return result;
    };

    return (
        <UsersContext.Provider value={{ usuarios, cambiarRol }}>
            {children}
        </UsersContext.Provider>
    );
};
