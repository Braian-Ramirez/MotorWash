/**
 * INFRAESTRUCTURA — Repositorio de Autenticación
 *
 * Responsabilidad: Toda comunicación con Firebase Auth y el documento
 * de usuario en Firestore. NO aplica reglas de negocio.
 *
 * Capa: Infrastructure → Firebase
 */
import { auth, db } from '../config/firebase';
import {
    createUserWithEmailAndPassword, signInWithEmailAndPassword,
    signOut, onAuthStateChanged, updatePassword
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

/**
 * Crea un usuario en Firebase Auth y su perfil en Firestore.
 */
export const registerUserInDB = async (email, password, nombre, telefono) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        await setDoc(doc(db, "usuarios", user.uid), {
            nombre,
            telefono,
            email,
            rol: 'client',
            fechaRegistro: new Date().toISOString()
        });
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message, code: error.code };
    }
};

/**
 * Inicia sesión con email y contraseña.
 */
export const loginUser = async (email, password) => {
    try {
        await signInWithEmailAndPassword(auth, email, password);
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message, code: error.code };
    }
};

/**
 * Actualiza campos del perfil del usuario en Firestore (merge).
 */
export const updateProfileInDB = async (uid, datosNuevos) => {
    try {
        const docRef = doc(db, "usuarios", uid);
        await setDoc(docRef, datosNuevos, { merge: true });
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

/**
 * Cambia la contraseña del usuario actualmente autenticado.
 */
export const changeUserPassword = async (newPassword) => {
    if (!auth.currentUser) return { success: false, error: "No hay sesión activa" };
    try {
        await updatePassword(auth.currentUser, newPassword);
        return { success: true };
    } catch (error) {
        console.error("[AuthRepository] Error al cambiar contraseña:", error);
        return { success: false, error: error.message, code: error.code };
    }
};

/**
 * Cierra la sesión del usuario actual.
 */
export const logoutUser = async () => {
    try {
        await signOut(auth);
        return { success: true };
    } catch (error) {
        console.error("[AuthRepository] Error al cerrar sesión", error);
        return { success: false, error: error.message };
    }
};

/**
 * Suscribe un listener a los cambios de autenticación de Firebase.
 * Enriquece el usuario de Auth con su perfil de Firestore.
 * @returns {Function} unsubscribe — llama para cancelar la suscripción.
 */
export const listenToAuthChanges = (onUserChange) => {
    console.log("[AuthRepository] Suscribiendo onAuthStateChanged...");
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        console.log("[AuthRepository] Firebase Auth detectó usuario:", currentUser ? currentUser.email : "Ninguno");

        if (currentUser) {
            try {
                const docRef = doc(db, "usuarios", currentUser.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    onUserChange({ uid: currentUser.uid, email: currentUser.email, ...data, role: data.rol });
                } else {
                    console.warn("[AuthRepository] No existe documento en 'usuarios' para este UID.");
                    onUserChange({ uid: currentUser.uid, email: currentUser.email, role: 'client' });
                }
            } catch (error) {
                console.error("[AuthRepository] Error al leer Firestore:", error.message);
                onUserChange({ uid: currentUser.uid, email: currentUser.email, role: 'client' });
            }
        } else {
            onUserChange(null);
        }
    });
    return unsubscribe;
};
