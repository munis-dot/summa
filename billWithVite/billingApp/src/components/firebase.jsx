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
  apiKey: "AIzaSyDdJsmr8v-GFvj1TBF0Ktalkmk1KGAJ36o",
  authDomain: "footwearbillapp.firebaseapp.com",
  projectId: "footwearbillapp",
  storageBucket: "footwearbillapp.appspot.com",
  messagingSenderId: "530769482797",
  appId: "1:530769482797:web:ae69ef053bbf81b64954a4",
  measurementId: "G-BVV0CRN24N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

export {db}