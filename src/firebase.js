// src/firebase.js
import { initializeApp } from "firebase/app";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, onSnapshot } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAXgCLmC9Xs6RwW0tJCtl8rxv7gkyFt_d4",
  authDomain: "nyxx-c82a2.firebaseapp.com",
  projectId: "nyxx-c82a2",
  storageBucket: "nyxx-c82a2.firebasestorage.app",
  messagingSenderId: "929514011823",
  appId: "1:929514011823:web:b069ef9843d2e31fa1e85a",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

/* ---- AUTH helpers ---- */
export const watchUser = (cb) => onAuthStateChanged(auth, cb);
export const signUp = (email, password) => createUserWithEmailAndPassword(auth, email, password);
export const signIn = (email, password) => signInWithEmailAndPassword(auth, email, password);
export const signInGoogle = () => signInWithPopup(auth, googleProvider);
export const logOut = () => signOut(auth);

/* ---- DATA helpers ---- */
// Chemin : users/{uid}/state/data — un seul document par utilisateur qui contient TOUT
const userDocRef = (uid) => doc(db, "users", uid, "state", "data");

export async function loadState(uid) {
  try {
    const snap = await getDoc(userDocRef(uid));
    return snap.exists() ? snap.data() : null;
  } catch (e) {
    console.error("loadState error", e);
    return null;
  }
}

export async function saveState(uid, state) {
  try {
    await setDoc(userDocRef(uid), state, { merge: true });
    return true;
  } catch (e) {
    console.error("saveState error", e);
    return false;
  }
}

export function subscribeState(uid, cb) {
  return onSnapshot(userDocRef(uid), (snap) => {
    if (snap.exists()) cb(snap.data());
  });
}
