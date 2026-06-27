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
  apiKey: "AIzaSyBazV1cFKMQv0j7BJnZcjwolaKDXbIIUwU",
  authDomain: "sivasakthifancy-7b385.firebaseapp.com",
  projectId: "sivasakthifancy-7b385",
  storageBucket: "sivasakthifancy-7b385.firebasestorage.app",
  messagingSenderId: "568807424195",
  appId: "1:568807424195:web:2baed98fd222bece742276",
  measurementId: "G-3HKW9D55R6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

export {db}