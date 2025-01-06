import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB1l6FMglQQQIOuL0vJK-hHJazZjYFTpF4",
  authDomain: "cash-board-bd3ae.firebaseapp.com",
  projectId: "cash-board-bd3ae",
  storageBucket: "cash-board-bd3ae.firebasestorage.app",
  messagingSenderId: "132671294197",
  appId: "1:132671294197:web:feb943dbd0c097d85e13bc"

  // apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  // authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  // projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  // storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  // messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  // appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
