import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBfUVCmQQrr3Zul6stL1_pDoyC6y_JJQH4",
  authDomain: "portafolios-31279.firebaseapp.com",
  projectId: "portafolios-31279",
  storageBucket: "portafolios-31279.firebasestorage.app",
  messagingSenderId: "334514369220",
  appId: "1:334514369220:web:f9c01e31a695fd2a2a8f91"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);