import React, { createContext, useState } from 'react';

export const UsersContext = createContext();

export const UsersProvider = ({ children }) => {
    // 💡 Datos de prueba para el admin
    const [usuarios, setUsuarios] = useState([
        { id: 1, nombre: 'Admin MotorWash', correo: 'admin@motorwash.com', rol: 'admin' },
        { id: 2, nombre: 'Carlos Lavador', correo: 'carlos@motorwash.com', rol: 'employee' },
        { id: 3, nombre: 'Juan Cliente', correo: 'juan@gmail.com', rol: 'client' },
        { id: 4, nombre: 'Marta Pérez', correo: 'marta@gmail.com', rol: 'client' },
    ]);

    // Función que usará el admin para cambiar el rol
    const cambiarRol = (id, nuevoRol) => {
        setUsuarios(usuarios.map(u =>
            u.id === id ? { ...u, rol: nuevoRol } : u
        ));
    };

    return (
        <UsersContext.Provider value={{ usuarios, cambiarRol }}>
            {children}
        </UsersContext.Provider>
    );
};
