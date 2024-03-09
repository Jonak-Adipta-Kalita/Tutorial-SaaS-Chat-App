import { initFirestore } from "@auth/firebase-adapter";
import admin from "firebase-admin";

const credential = admin.credential.cert({
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
});

let app;

if (!admin.apps.length) {
  app = admin.initializeApp({
    credential,
  });
}

const adminDB = initFirestore({ credential });
const adminAuth = admin.auth(app);

export { adminDB, adminAuth };
