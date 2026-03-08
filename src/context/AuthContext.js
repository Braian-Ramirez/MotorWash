import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const login = (email) => {
        // Lógica de detección de rol simple por dominio de correo
        const role = email.toLowerCase().endsWith('@motorwash.com') ? 'employee' : 'client';
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
