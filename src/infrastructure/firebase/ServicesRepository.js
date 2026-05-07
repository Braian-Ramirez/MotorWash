/**
 * INFRAESTRUCTURA — Repositorio de Servicios
 *
 * Responsabilidad: CRUD del catálogo de servicios de lavado en Firestore.
 * Solo administradores crean/editan servicios; todos los roles los leen.
 *
 * Capa: Infrastructure → Firebase
 */
import { db } from '../config/firebase';
import { collection, onSnapshot, addDoc, updateDoc, doc } from 'firebase/firestore';

const COLLECTION_NAME = "servicios";

/**
 * Escucha en tiempo real el catálogo completo de servicios.
 * @returns {Function} unsubscribe
 */
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

/**
 * Crea un nuevo servicio en el catálogo.
 */
export const createServiceInDB = async (nuevoServicio) => {
    try {
        const docRef = await addDoc(collection(db, COLLECTION_NAME), nuevoServicio);
        return { success: true, id: docRef.id };
    } catch (error) {
        console.error("[ServicesRepository] Error al crear servicio:", error);
        return { success: false, error: error.message };
    }
};

/**
 * Actualiza los datos de un servicio existente.
 */
export const updateServiceInDB = async (servicioId, nuevosDatos) => {
    try {
        await updateDoc(doc(db, COLLECTION_NAME, servicioId), nuevosDatos);
        return { success: true };
    } catch (error) {
        console.error("[ServicesRepository] Error al actualizar servicio:", error);
        return { success: false, error: error.message };
    }
};
