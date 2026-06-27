// Import the functions you need from the SDKs you need
import * as firebase from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from 'firebase/firestore'; 

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyABjSUoqcAobjgya1TM9tqA4f_qnjhTXB8",
  authDomain: "bill-app-95efe.firebaseapp.com",
  databaseURL: "https://bill-app-95efe-default-rtdb.firebaseio.com",
  projectId: "bill-app-95efe",
  storageBucket: "bill-app-95efe.firebasestorage.app",
  messagingSenderId: "1056741843927",
  appId: "1:1056741843927:web:4985a0bba2b93c9388a192",
  measurementId: "G-2NMMB4K110"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

export {db}