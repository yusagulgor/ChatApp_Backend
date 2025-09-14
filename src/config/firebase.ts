import admin from "firebase-admin";
import * as dotenv from "dotenv";

dotenv.config();

if (!process.env.FIREBASE_SERVICE_ACCOUNT_CONTENT) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT_CONTENT is not defined");
}

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_CONTENT!);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DB_URL,
});

export const db = admin.database();
