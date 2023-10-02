// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAYfao8421huSYAjOZvKRrgXWkGJ3sjF9Y",
    authDomain: "myproject-6b342.firebaseapp.com",
    projectId: "myproject-6b342",
    storageBucket: "myproject-6b342.appspot.com",
    messagingSenderId: "340119699431",
    appId: "1:340119699431:web:83da5eea63a3f6819d4742"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getFirestore(app);
const storage = getStorage(app);
export { app, database, storage };
