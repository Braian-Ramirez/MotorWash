import { db } from '../config/firebase';
import { collection, onSnapshot, query, where, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';

const COLLECTION_NAME = "vehiculos";

// Sincronización en tiempo real (Listener)
export const listenToUserVehicles = (userId, onDataUpdate) => {
    if (!userId) return () => { };

    const q = query(collection(db, COLLECTION_NAME), where("userId", "==", userId));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const lista = [];
        querySnapshot.forEach((doc) => {
            lista.push({ ...doc.data(), id: doc.id });
        });
        onDataUpdate(lista); // Le pasamos los datos hacia arriba (al Context)
    });

    return unsubscribe; // Retornamos la función para apagar el listener cuando sea necesario
};

//  Crear
export const createVehicleInDB = async (vehiculoData, userId) => {
    try {
        const docRef = await addDoc(collection(db, COLLECTION_NAME), {
            ...vehiculoData,
            userId: userId
        });
        return { success: true, id: docRef.id };
    } catch (error) {
        console.error("Error en Modelo (createVehicle):", error);
        return { success: false, error: error.message };
    }
};

//  Actualizar
export const updateVehicleInDB = async (vehiculoId, nuevosDatos) => {
    try {
        const docRef = doc(db, COLLECTION_NAME, vehiculoId);
        await updateDoc(docRef, nuevosDatos);
        return { success: true };
    } catch (error) {
        console.error("Error en Modelo (updateVehicle):", error);
        return { success: false, error: error.message };
    }
};

//  Eliminar
export const deleteVehicleFromDB = async (vehiculoId) => {
    try {
        const docRef = doc(db, COLLECTION_NAME, vehiculoId);
        await deleteDoc(docRef);
        return { success: true };
    } catch (error) {
        console.error("Error en Modelo (deleteVehicle):", error);
        return { success: false, error: error.message };
    }
};
