/**
 * INFRAESTRUCTURA — Repositorio de Visitas
 *
 * Responsabilidad: CRUD de visitas contra Firebase Firestore.
 * NO aplica reglas de negocio (eso es responsabilidad del dominio/Kotlin).
 *
 * Capa: Infrastructure → Firebase
 */
import { db } from '../config/firebase';
import { collection, onSnapshot, query, where, addDoc, updateDoc, doc } from 'firebase/firestore';

const COLLECTION_NAME = "visitas";

/**
 * Escucha en tiempo real las visitas según el rol del usuario.
 * - client: solo sus propias visitas
 * - employee/admin: todas las visitas
 * @returns {Function} unsubscribe
 */
export const listenToUserVisits = (user, onDataUpdate) => {
    if (!user) return () => {};

    let q = collection(db, COLLECTION_NAME);
    if (user.role === 'client') {
        q = query(collection(db, COLLECTION_NAME), where("userId", "==", user.uid));
    }

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const lista = [];
        querySnapshot.forEach((doc) => {
            lista.push({ ...doc.data(), id: doc.id });
        });
        onDataUpdate(lista);
    });

    return unsubscribe;
};

/**
 * Crea un nuevo documento de visita en Firestore.
 */
export const crearVisitaInDB = async (visitaData, userId) => {
    try {
        const docRef = await addDoc(collection(db, COLLECTION_NAME), {
            ...visitaData,
            userId
        });
        return { success: true, id: docRef.id };
    } catch (error) {
        console.error("[VisitsRepository] Error al crear visita:", error);
        return { success: false, error: error.message };
    }
};

/**
 * Marca una visita como completada.
 */
export const completarVisitaInDB = async (visitaId) => {
    try {
        await updateDoc(doc(db, COLLECTION_NAME, visitaId), { estado: 'completado' });
        return { success: true };
    } catch (error) {
        console.error("[VisitsRepository] Error al completar visita:", error);
        return { success: false, error: error.message };
    }
};

/**
 * Inicia una visita, asignando encargado y hora de inicio.
 */
export const iniciarVisitaInDB = async (visitaId, nombreEmpleado = null) => {
    try {
        const updateData = { estado: 'en_progreso', horaInicio: Date.now() };
        if (nombreEmpleado) updateData.encargado = nombreEmpleado;
        await updateDoc(doc(db, COLLECTION_NAME, visitaId), updateData);
        return { success: true };
    } catch (error) {
        console.error("[VisitsRepository] Error al iniciar visita:", error);
        return { success: false, error: error.message };
    }
};

/**
 * Registra la calificación y comentario de una visita completada.
 */
export const calificarVisitaInDB = async (visitaId, calificacion, comentario) => {
    try {
        await updateDoc(doc(db, COLLECTION_NAME, visitaId), {
            calificacion,
            comentario,
            estado: 'completado'
        });
        return { success: true };
    } catch (error) {
        console.error("[VisitsRepository] Error al calificar visita:", error);
        return { success: false, error: error.message };
    }
};
