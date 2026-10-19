import { initializeApp } from "firebase/app";
import {
  getDatabase,
  ref,
  push,
  onValue,
  query,
  orderByChild,
  serverTimestamp,
} from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBeW2YNbGIQjeZQJ-xZlZ666eH9_HBsXX4",
  authDomain: "chat-app-firebase-5505f.firebaseapp.com",
  databaseURL: "https://chat-app-firebase-5505f-default-rtdb.firebaseio.com",
  projectId: "chat-app-firebase-5505f",
  storageBucket: "chat-app-firebase-5505f.firebasestorage.app",
  messagingSenderId: "187387014006",
  appId: "1:187387014006:web:c21e2ce505bb9ab8542857",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Estructura: mensajes/{id}: { usuario, texto, timestamp }
export const enviarMensaje = (usuario, texto) => {
  const limpio = texto.trim();
  if (!usuario || !limpio) return Promise.resolve();
  return push(ref(db, "mensajes"), {
    usuario,
    texto: limpio,
    timestamp: serverTimestamp(),
  });
};

// Escucha en tiempo real, ordenado por timestamp.
// Devuelve la función para cancelar la suscripción.
export const escucharMensajes = (callback) => {
  const q = query(ref(db, "mensajes"), orderByChild("timestamp"));
  return onValue(q, (snapshot) => {
    const lista = [];
    snapshot.forEach((hijo) => {
      lista.push({ id: hijo.key, ...hijo.val() });
    });
    callback(lista);
  });
};