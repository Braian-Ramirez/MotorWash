import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const login = (email) => {
        let role = 'client'; // Por defecto entrada cliente

        //1. Detección de Admin(correo exacto)
        if (email.toLowerCase() === 'admin@motorwash.com') {
            role = 'admin';
        }

        // 2. Detección de Empleado (dominio de empresa)
        else if (email.toLowerCase().endsWith('@motorwash.com')) {
            role = 'employee';
        }

        const userData = { email, role };

        setUser(userData);
        return role;

    };

    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
