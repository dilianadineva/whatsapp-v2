import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";

//web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAVC4eg-uarPHwGzxEz59pzEO0D0AI4f0s",
    authDomain: "whatsapp-2-1040a.firebaseapp.com",
    projectId: "whatsapp-2-1040a",
    storageBucket: "whatsapp-2-1040a.appspot.com",
    messagingSenderId: "803503608683",
    appId: "1:803503608683:web:89b83425ffa095f908322e"
};

// Initialize Firebase
// const app = !(firebase.apps.length) ? firebase.initializeApp(firebaseConfig) : firebase.app();
// const db = app.firestore();
// const auth = app.auth();
// const provider = new firebase.auth.GoogleAuthProvider()
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();
const provider = new GoogleAuthProvider();

// import { collection, doc, getDoc, getDocs, query, orderBy } from 'firebase/firestore'

export {
    db,
    auth,
    provider
}