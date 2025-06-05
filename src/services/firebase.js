// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyCi4wYugLsCw3TMKy-fh2nGhEUMXuHNCjI",
    authDomain: "fareflow-a1f8c.firebaseapp.com",
    databaseURL: "https://fareflow-a1f8c-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "fareflow-a1f8c",
    storageBucket: "fareflow-a1f8c.firebasestorage.app",
    messagingSenderId: "746807428725",
    appId: "1:746807428725:web:d8877d98952849f3115a3c",
    measurementId: "G-FMHQL89TGV"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const dbRT=getDatabase(app);

export { auth, db, dbRT };