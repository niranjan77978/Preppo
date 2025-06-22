// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const analytics = getAnalytics(app);