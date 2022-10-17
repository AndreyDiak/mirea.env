// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth, EmailAuthProvider } from 'firebase/auth'
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAFzTOsO0dPbFQXjmkSogsI7kbZc5ATxo8",
  authDomain: "mirea-env.firebaseapp.com",
  projectId: "mirea-env",
  storageBucket: "mirea-env.appspot.com",
  messagingSenderId: "360295039855",
  appId: "1:360295039855:web:bd0f3264b2eaf4e3bb1e9a",
  measurementId: "G-QHMFBSLD2M"
};

// Initialize Firebase
const app = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApp()

const db = getFirestore();
const auth = getAuth(app);
const storage = getStorage()

const emailProvider = new EmailAuthProvider();

export { db, auth, storage, emailProvider }