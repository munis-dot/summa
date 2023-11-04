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
  apiKey: "AIzaSyCdCQLVd28Vre8otRQF97IPlYOWWTvvp1U",
  authDomain: "bill-app-95efe.firebaseapp.com",
  databaseURL: "https://bill-app-95efe-default-rtdb.firebaseio.com",
  projectId: "bill-app-95efe",
  storageBucket: "bill-app-95efe.appspot.com",
  messagingSenderId: "1056741843927",
  appId: "1:1056741843927:web:1174d280e4ca0e1c88a192",
  measurementId: "G-LKVT173ED1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

export {db}