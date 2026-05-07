/**
 * APLICACIÓN — Contexto de Autenticación
 *
 * Responsabilidad: Gestionar el estado global del usuario autenticado y exponer
 * las acciones de sesión a toda la aplicación.
 *
 * Este contexto es un proveedor de estado puro: NO contiene lógica de negocio.
 * Delega todas las operaciones al repositorio de autenticación (Infrastructure).
 *
 * Capa: Application → Context
 */
import React, { createContext, useState, useEffect } from 'react';
import {
    registerUserInDB, loginUser, updateProfileInDB,
    changeUserPassword, logoutUser, listenToAuthChanges
} from '../../infrastructure/firebase/AuthRepository';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [initializing, setInitializing] = useState(true);

    const register = async (email, password, nombre, telefono) =>
        await registerUserInDB(email, password, nombre, telefono);

    const login = async (email, password) =>
        await loginUser(email, password);

    const updateProfile = async (datosNuevos) => {
        if (!user) return { success: false, error: "No hay usuario logueado" };
        const result = await updateProfileInDB(user.uid, datosNuevos);
        if (result.success) setUser({ ...user, ...datosNuevos });
        return result;
    };

    const changePassword = async (newPassword) =>
        await changeUserPassword(newPassword);

    const logout = async () => {
        const result = await logoutUser();
        if (result.success) setUser(null);
    };

    useEffect(() => {
        console.log("[AuthContext] Iniciando vigilante de sesión...");

        let timer = setTimeout(() => {
            console.warn("[AuthContext] Timeout de 5s alcanzado. Forzando fin de carga.");
            setInitializing(false);
        }, 5000);

        const unsubscribe = listenToAuthChanges((currentUserData) => {
            console.log("[AuthContext] Cambio detectado:", currentUserData?.email || "Cerrado");
            setUser(currentUserData);
            setInitializing(false);
            if (timer) { clearTimeout(timer); timer = null; }
        });

        return () => { unsubscribe(); if (timer) clearTimeout(timer); };
    }, []);

    return (
        <AuthContext.Provider value={{ user, initializing, login, logout, register, updateProfile, changePassword }}>
            {children}
        </AuthContext.Provider>
    );
};
