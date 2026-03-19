import { auth, db } from '../config/firebase';
import {
    createUserWithEmailAndPassword, signInWithEmailAndPassword,
    signOut, onAuthStateChanged, updatePassword
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export const registerUserInDB = async (email, password, nombre, telefono) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await setDoc(doc(db, "usuarios", user.uid), {
            nombre: nombre,
            telefono: telefono,
            email: email,
            rol: 'client', // Por defecto cliente
            fechaRegistro: new Date().toISOString()
        });

        return { success: true };
    } catch (error) {
        return { success: false, error: error.message, code: error.code };
    }
};

export const loginUser = async (email, password) => {
    try {
        await signInWithEmailAndPassword(auth, email, password);
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message, code: error.code };
    }
};

export const updateProfileInDB = async (uid, datosNuevos) => {
    try {
        const docRef = doc(db, "usuarios", uid);
        await setDoc(docRef, datosNuevos, { merge: true });
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

export const changeUserPassword = async (newPassword) => {
    if (!auth.currentUser) return { success: false, error: "No hay sesión activa" };
    try {
        await updatePassword(auth.currentUser, newPassword);
        return { success: true };
    } catch (error) {
        console.error("Error al cambiar contraseña:", error);
        return { success: false, error: error.message, code: error.code };
    }
};

export const logoutUser = async () => {
    try {
        await signOut(auth);
        return { success: true };
    } catch (error) {
        console.error("Error al cerrar sesión", error);
        return { success: false, error: error.message };
    }
};

// 📡 Sincronización de Sesión (Vigilante)
export const listenToAuthChanges = (onUserChange) => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        if (currentUser) {
            const docRef = doc(db, "usuarios", currentUser.uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                onUserChange({
                    uid: currentUser.uid,
                    email: currentUser.email,
                    ...data,
                    role: data.rol
                });
            } else {
                onUserChange({
                    uid: currentUser.uid,
                    email: currentUser.email,
                    role: 'client'
                });
            }
        } else {
            onUserChange(null);
        }
    });
    return unsubscribe;
};
