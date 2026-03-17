import React, { createContext, useState, useEffect } from 'react';
import { auth, db } from '../config/firebase'; // Conexión a Firebase
import {
    createUserWithEmailAndPassword, signInWithEmailAndPassword,
    signOut, onAuthStateChanged, updatePassword
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore'; // Funciones de Firestore

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // -- 1. REGISTRO REAL --
    const register = async (email, password, nombre, telefono) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // 2. Guardar datos en Firestore
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

    // -- 2. LOGIN REAL --
    const login = async (email, password) => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message, code: error.code };
        }
    };

    // -- Nueva función: ACTUALIZAR PERFIL --
    const updateProfile = async (datosNuevos) => {
        if (!user) return { success: false, error: "No hay usuario logueado" };
        try {
            const docRef = doc(db, "usuarios", user.uid);
            await setDoc(docRef, datosNuevos, { merge: true });
            setUser({ ...user, ...datosNuevos });
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    // -- Nueva función: CAMBIAR CONTRASEÑA --
    const changePassword = async (newPassword) => {
        if (!auth.currentUser) return { success: false, error: "No hay sesión activa" };
        try {
            await updatePassword(auth.currentUser, newPassword);
            return { success: true };
        } catch (error) {
            console.error("Error al cambiar contraseña:", error);
            return { success: false, error: error.message, code: error.code };
        }
    };

    // -- 3. LOGOUT REAL --
    const logout = async () => {
        try {
            await signOut(auth);
            setUser(null);
        } catch (error) {
            console.error("Error al cerrar sesión", error);
        }
    };

    // -- 4. EL VIGILANTE DE FIREBASE --
    useEffect(() => {
        // Firebase revisa constantemente si alguien entra o sale
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                // Ir a buscar el rol al expediente en la DB
                const docRef = doc(db, "usuarios", currentUser.uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setUser({
                        uid: currentUser.uid,
                        email: currentUser.email,
                        ...data, // Esto trae nombre, telefono, rol, etc.
                        role: data.rol // Mapeamos rol a role por consistencia
                    });
                } else {
                    setUser({
                        uid: currentUser.uid,
                        email: currentUser.email,
                        role: 'client'
                    });
                }
            } else {
                setUser(null);
            }
        });
        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, logout, register, updateProfile, changePassword }}>
            {children}
        </AuthContext.Provider>
    );

};
