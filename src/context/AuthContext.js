import React, { createContext, useState, useEffect } from 'react';
import { 
    registerUserInDB, loginUser, updateProfileInDB, 
    changeUserPassword, logoutUser, listenToAuthChanges 
} from '../services/AuthService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // -- 1. REGISTRO (Delegado) --
    const register = async (email, password, nombre, telefono) => {
        return await registerUserInDB(email, password, nombre, telefono);
    };

    // -- 2. LOGIN (Delegado) --
    const login = async (email, password) => {
        return await loginUser(email, password);
    };

    // -- 3. ACTUALIZAR PERFIL (Delegado) --
    const updateProfile = async (datosNuevos) => {
        if (!user) return { success: false, error: "No hay usuario logueado" };
        const result = await updateProfileInDB(user.uid, datosNuevos);
        
        if (result.success) {
            setUser({ ...user, ...datosNuevos });
        }
        return result;
    };

    // -- 4. CAMBIAR CONTRASEÑA (Delegado) --
    const changePassword = async (newPassword) => {
        return await changeUserPassword(newPassword);
    };

    // -- 5. LOGOUT (Delegado) --
    const logout = async () => {
        const result = await logoutUser();
        if (result.success) {
            setUser(null);
        }
    };

    // -- 6. EL VIGILANTE DE AUTENTICACIÓN (Delegado) --
    useEffect(() => {
        const unsubscribe = listenToAuthChanges((currentUserData) => {
            setUser(currentUserData);
        });
        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, logout, register, updateProfile, changePassword }}>
            {children}
        </AuthContext.Provider>
    );
};
