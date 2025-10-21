import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAqulDlLOyU8CrNZTRwlqKZvmcxmSexcMg",
  authDomain: "tlm-des400.firebaseapp.com",
  projectId: "tlm-des400",
  storageBucket: "tlm-des400.appspot.com", // fixed from .firebasestorage.app
  messagingSenderId: "534169170503",
  appId: "1:534169170503:web:978d7224ba68cda6f87762",
  measurementId: "G-E8CCX27BR9",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);