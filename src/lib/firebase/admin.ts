import { initFirestore } from "@auth/firebase-adapter";
import { cert, getApp, getApps, initializeApp } from "firebase-admin/app";
import {getAuth} from "firebase-admin/auth"

const credential = cert({
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
});

let app = getApps().length > 0 ? getApp() : initializeApp({credential})

const adminDB = initFirestore({ credential });
const adminAuth = getAuth(app);

export { adminDB, adminAuth };
