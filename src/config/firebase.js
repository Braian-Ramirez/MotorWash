import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Configuración de tu proyecto en Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAb8LttH18xZg4YR7ReRJ09NMPKV1EVa2g",
  authDomain: "motorwashapp-374fc.firebaseapp.com",
  projectId: "motorwashapp-374fc",
  storageBucket: "motorwashapp-374fc.firebasestorage.app",
  messagingSenderId: "727814723332",
  appId: "1:727814723332:web:afe7dbb18b67999c912251"
};

// Inicializamos Firebase
const app = initializeApp(firebaseConfig);

// Exportamos los servicios que vamos a usar
export const auth = getAuth(app);
export const db = getFirestore(app);
