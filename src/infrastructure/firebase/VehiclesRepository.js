/**
 * INFRAESTRUCTURA — Repositorio de Vehículos
 *
 * Responsabilidad: CRUD de vehículos contra Firebase Firestore.
 * NO valida datos (eso es responsabilidad del dominio/Kotlin).
 *
 * Capa: Infrastructure → Firebase
 */
import { db } from '../config/firebase';
import { collection, onSnapshot, query, where, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';

const COLLECTION_NAME = "vehiculos";

/**
 * Escucha en tiempo real los vehículos del usuario autenticado.
 * @returns {Function} unsubscribe
 */
export const listenToUserVehicles = (userId, onDataUpdate) => {
    if (!userId) return () => {};
    const q = query(collection(db, COLLECTION_NAME), where("userId", "==", userId));
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
 * Crea un nuevo vehículo asociado a un usuario.
 */
export const createVehicleInDB = async (vehiculoData, userId) => {
    try {
        const docRef = await addDoc(collection(db, COLLECTION_NAME), { ...vehiculoData, userId });
        return { success: true, id: docRef.id };
    } catch (error) {
        console.error("[VehiclesRepository] Error al crear vehículo:", error);
        return { success: false, error: error.message };
    }
};

/**
 * Actualiza los datos de un vehículo existente.
 */
export const updateVehicleInDB = async (vehiculoId, nuevosDatos) => {
    try {
        await updateDoc(doc(db, COLLECTION_NAME, vehiculoId), nuevosDatos);
        return { success: true };
    } catch (error) {
        console.error("[VehiclesRepository] Error al actualizar vehículo:", error);
        return { success: false, error: error.message };
    }
};

/**
 * Elimina un vehículo de la base de datos.
 */
export const deleteVehicleFromDB = async (vehiculoId) => {
    try {
        await deleteDoc(doc(db, COLLECTION_NAME, vehiculoId));
        return { success: true };
    } catch (error) {
        console.error("[VehiclesRepository] Error al eliminar vehículo:", error);
        return { success: false, error: error.message };
    }
};
