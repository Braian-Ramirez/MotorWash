import { db } from '../config/firebase';
import { collection, onSnapshot, updateDoc, doc } from 'firebase/firestore';

const COLLECTION_NAME = "usuarios";

// 📡 Sincronización en tiempo real (Todos los usuarios)
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

// ✏️ Cambiar rol de usuario
export const updateUserRoleInDB = async (usuarioId, nuevoRol) => {
    try {
        const docRef = doc(db, COLLECTION_NAME, usuarioId);
        await updateDoc(docRef, { rol: nuevoRol });
        return { success: true };
    } catch (error) {
        console.error("Error en Modelo (updateUserRole):", error);
        return { success: false, error: error.message };
    }
};
