// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC06Uu93dd3xpRt10F9_wk13wojfE4QjGM",
  authDomain: "preppoo.firebaseapp.com",
  projectId: "preppoo",
  storageBucket: "preppoo.firebasestorage.app",
  messagingSenderId: "660152996842",
  appId: "1:660152996842:web:4347f10bd884cfe176d893",
  measurementId: "G-YTDJV1EHQQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;