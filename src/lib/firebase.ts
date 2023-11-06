import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";

const app = getApps().length
  ? getApp()
  : initializeApp({
      apiKey: "AIzaSyAg4tP-RztJOsyHYels1QXyiP8uNt-sjbE",
      authDomain: "jak-saas-chat-app.firebaseapp.com",
      projectId: "jak-saas-chat-app",
      storageBucket: "jak-saas-chat-app.appspot.com",
      messagingSenderId: "695217530084",
      appId: "1:695217530084:web:653ca3494e4d5df26078f1",
    });

const auth = getAuth(app);
const db = getFirestore(app);
const functions = getFunctions(app);

export { auth, db, functions };
