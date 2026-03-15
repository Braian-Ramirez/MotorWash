import React, { createContext, useState, useEffect, useContext } from 'react';
import { db } from '../config/firebase';
import { collection, onSnapshot, query, where, addDoc, updateDoc, doc } from 'firebase/firestore';
import { AuthContext } from './AuthContext';

// 1. CREAMOS LA "NUBE" (El Contexto)
// Esto es lo que las pantallas van a importar para conectarse
export const VehiclesContext = createContext();

// 2. CREAMOS EL PROVEEDOR (El componente que envuelve a la app)
// Este componente guardará los datos reales y se los regalará a los "children" (pantallas)
export const VehiclesProvider = ({ children }) => {

    const [vehiculos, setVehiculos] = useState([]);
    const { user } = useContext(AuthContext);

    // 🔄 Sincronizar con Firebase (Solo los carros del usuario actual)
    useEffect(() => {
        if (!user) {
            setVehiculos([]);
            return;
        }

        const q = query(collection(db, "vehiculos"), where("userId", "==", user.uid));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const lista = [];
            querySnapshot.forEach((doc) => {
                lista.push({ ...doc.data(), id: doc.id });
            });
            setVehiculos(lista);
        });

        return () => unsubscribe();
    }, [user]);

    // Función global para AGREGAR un vehículo
    const addVehicle = async (nuevoVehiculo) => {
        if (!user) return;
        try {
            await addDoc(collection(db, "vehiculos"), {
                ...nuevoVehiculo,
                userId: user.uid
            });
        } catch (error) {
            console.error("Error al añadir vehículo:", error);
        }
    };

    // Función global para EDITAR un vehículo
    const updateVehicle = async (vehiculoEditado) => {
        try {
            const { id, ...datos } = vehiculoEditado;
            const docRef = doc(db, "vehiculos", id);
            await updateDoc(docRef, datos);
        } catch (error) {
            console.error("Error al actualizar vehículo:", error);
        }
    };

    return (
        // 3. ENCHUFAMOS LOS DATOS A LA NUBE
        // Todo lo que pongamos en "value" estará disponible para CUALQUIER pantalla
        <VehiclesContext.Provider value={{ vehiculos, addVehicle, updateVehicle }}>
            {children}
        </VehiclesContext.Provider>
    );
};
