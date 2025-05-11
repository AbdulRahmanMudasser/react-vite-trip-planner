// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBsxtaVrjmXSLK27R9uLB71V_DntK30XBA",
  authDomain: "ai-trip-planner-7315b.firebaseapp.com",
  projectId: "ai-trip-planner-7315b",
  storageBucket: "ai-trip-planner-7315b.firebasestorage.app",
  messagingSenderId: "235217666777",
  appId: "1:235217666777:web:8eeee4b1f95f8dd57f74c8",
  measurementId: "G-TJ2TLRFFH5"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
//const analytics = getAnalytics(app);