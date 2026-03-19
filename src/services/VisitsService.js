import { db } from '../config/firebase';
import { collection, onSnapshot, query, where, addDoc, updateDoc, doc } from 'firebase/firestore';

const COLLECTION_NAME = "visitas";

// Sincronización en tiempo real (Listener)
export const listenToUserVisits = (user, onDataUpdate) => {
    if (!user) return () => { };

    let q = collection(db, COLLECTION_NAME); // Por defecto, preparamos toda la colección (para admin/empleado)

    // PERO si el usuario es cliente, le ponemos el filtro de "solo las mías"
    if (user.role === 'client') {
        q = query(collection(db, COLLECTION_NAME), where("userId", "==", user.uid));
    }

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const lista = [];
        querySnapshot.forEach((doc) => {
            lista.push({ ...doc.data(), id: doc.id });
        });
        onDataUpdate(lista); // Le pasamos los datos hacia arriba (al Context)
    });

    return unsubscribe;
};

//  Crear
export const crearVisitInDB = async (visitaData, userId) => {
    try {
        const docRef = await addDoc(collection(db, COLLECTION_NAME), {
            ...visitaData,
            userId: userId
        });
        return { success: true, id: docRef.id };
    } catch (error) {
        console.error("Error en Modelo (createVisit):", error);
        return { success: false, error: error.message };
    }
};

// completar visita
export const completarVisitInDB = async (visitaId) => {
    try {
        // En lugar de addDoc, usamos doc() para "apuntar" a la visita que ya existe.
        const docRef = doc(db, COLLECTION_NAME, visitaId);

        await updateDoc(docRef, { estado: 'completado' });
        return { success: true };
    } catch (error) {
        console.error("Error al completar visita:", error);
        return { success: false, error: error.message };
    }
};

// Iniciar visita 
export const iniciarVisitInDB = async (visitaId) => {
    try {
        const docRef = doc(db, COLLECTION_NAME, visitaId);
        await updateDoc(docRef, {
            estado: 'en_progreso',
            horaInicio: Date.now()
        });
        return { success: true };
    } catch (error) {
        console.error("Error al iniciar visita:", error);
        return { success: false, error: error.message };
    }

};

// Calificar visita 
export const calificarVisitInDB = async (visitaId, calificacion, comentario) => {
    try {
        const docRef = doc(db, COLLECTION_NAME, visitaId);
        await updateDoc(docRef, {
            calificacion: calificacion,
            comentario: comentario,
            estado: 'completado'
        });
        return { success: true };
    } catch (error) {
        console.error("Error al calificar visita:", error);
        return { success: false, error: error.message };
    }
};