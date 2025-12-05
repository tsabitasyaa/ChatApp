import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
  CollectionReference,
  DocumentData,
} from "firebase/firestore";

import {
  initializeAuth,
  getReactNativePersistence,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth/react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import storage from "@react-native-firebase/storage";

// ------------------------------
// CONFIG
// ------------------------------
const firebaseConfig = {
  apiKey: "AIzaSyDQSkFyaYXW-MN1LOFdc3f8rjxvIhK4CTc",
  authDomain: "chatapp-9bd6e.firebaseapp.com",
  projectId: "chatapp-9bd6e",
  storageBucket: "chatapp-9bd6e.firebasestorage.app",
  messagingSenderId: "787686653480",
  appId: "1:787686653480:web:a7ec0fa7ce88a380f4bf1d",
  measurementId: "G-DLFQ3RQQWL",
};

// ------------------------------
// INIT
// ------------------------------
const app = initializeApp(firebaseConfig);

// ❗ WAJIB untuk auto login di React Native
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const firestore = getFirestore(app);

// ------------------------------
// COLLECTION REFERENCES
// ------------------------------
export const messagesCollection =
  collection(firestore, "messages") as CollectionReference<DocumentData>;

export const usersCollection =
  collection(firestore, "users") as CollectionReference<DocumentData>;

// ------------------------------
// EXPORTS
// ------------------------------
export {
  collection,
  doc,
  setDoc,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  storage,
};
