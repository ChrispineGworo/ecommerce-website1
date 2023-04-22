// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_KEY,
  authDomain: "my-project-31602.firebaseapp.com",
  projectId: "my-project-31602",
  storageBucket: "my-project-31602.appspot.com",
  messagingSenderId: "1095326600046",
  appId: "1:1095326600046:web:ad94f3de2fc1c5738dcf7f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);