import { db } from '../config/firebase';
import { collection, onSnapshot, addDoc, updateDoc, doc } from 'firebase/firestore';

const COLLECTION_NAME = "servicios";

// 📡 Sincronización en tiempo real (Todos los servicios)
export const listenToServices = (onDataUpdate) => {
    const q = collection(db, COLLECTION_NAME);
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const lista = [];
        querySnapshot.forEach((doc) => {
            lista.push({ ...doc.data(), id: doc.id });
        });
        onDataUpdate(lista);
    });

    return unsubscribe;
};

// ➕ Crear servicio
export const createServiceInDB = async (nuevoServicio) => {
    try {
        const docRef = await addDoc(collection(db, COLLECTION_NAME), nuevoServicio);
        return { success: true, id: docRef.id };
    } catch (error) {
        console.error("Error en Modelo (createService):", error);
        return { success: false, error: error.message };
    }
};

// ✏️ Actualizar servicio
export const updateServiceInDB = async (servicioId, nuevosDatos) => {
    try {
        const docRef = doc(db, COLLECTION_NAME, servicioId);
        await updateDoc(docRef, nuevosDatos);
        return { success: true };
    } catch (error) {
        console.error("Error en Modelo (updateService):", error);
        return { success: false, error: error.message };
    }
};
