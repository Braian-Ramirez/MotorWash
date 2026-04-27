import React, { createContext, useState, useEffect } from 'react';
import { 
    registerUserInDB, loginUser, updateProfileInDB, 
    changeUserPassword, logoutUser, listenToAuthChanges 
} from '../services/AuthService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [initializing, setInitializing] = useState(true);

    const register = async (email, password, nombre, telefono) => {
        return await registerUserInDB(email, password, nombre, telefono);
    };

    const login = async (email, password) => {
        return await loginUser(email, password);
    };

    const updateProfile = async (datosNuevos) => {
        if (!user) return { success: false, error: "No hay usuario logueado" };
        const result = await updateProfileInDB(user.uid, datosNuevos);
        if (result.success) setUser({ ...user, ...datosNuevos });
        return result;
    };

    const changePassword = async (newPassword) => {
        return await changeUserPassword(newPassword);
    };

    const logout = async () => {
        const result = await logoutUser();
        if (result.success) setUser(null);
    };

    useEffect(() => {
        console.log("[AuthContext] Iniciando vigilante de sesión...");
        const unsubscribe = listenToAuthChanges((currentUserData) => {
            console.log("[AuthContext] Cambio detectado en usuario:", currentUserData?.email || "Cerrado");
            setUser(currentUserData);
            setInitializing(false);
        });

        const timer = setTimeout(() => {
            if (initializing) {
                console.warn("[AuthContext] Timeout de 5s alcanzado. Forzando fin de carga.");
                setInitializing(false);
            }
        }, 5000);

        return () => {
            unsubscribe();
            clearTimeout(timer);
        };
    }, []);

    return (
        <AuthContext.Provider value={{ user, initializing, login, logout, register, updateProfile, changePassword }}>
            {children}
        </AuthContext.Provider>
    );
};
