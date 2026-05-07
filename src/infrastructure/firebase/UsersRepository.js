/**
 * INFRAESTRUCTURA — Repositorio de Usuarios
 *
 * Responsabilidad: Leer y actualizar perfiles de usuario en Firestore.
 * Solo el administrador usa estas funciones para gestión de roles.
 *
 * Capa: Infrastructure → Firebase
 */
import { db } from '../config/firebase';
import { collection, onSnapshot, updateDoc, doc } from 'firebase/firestore';

const COLLECTION_NAME = "usuarios";

/**
 * Escucha en tiempo real todos los usuarios registrados (uso admin).
 * @returns {Function} unsubscribe
 */
export const listenToUsers = (onDataUpdate) => {
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
 * Actualiza el rol de un usuario (client / employee / admin).
 */
export const updateUserRoleInDB = async (usuarioId, nuevoRol) => {
    try {
        await updateDoc(doc(db, COLLECTION_NAME, usuarioId), { rol: nuevoRol });
        return { success: true };
    } catch (error) {
        console.error("[UsersRepository] Error al cambiar rol:", error);
        return { success: false, error: error.message };
    }
};
