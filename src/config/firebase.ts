import admin from "firebase-admin";
import * as dotenv from "dotenv";
import path from "path";

dotenv.config();

const serviceAccountPath = path.resolve(__dirname, "../../secrets/" + process.env.FIREBASE_SERVICE_ACCOUNT);

admin.initializeApp({
  credential: admin.credential.cert(require(serviceAccountPath)),
  databaseURL: process.env.FIREBASE_DB_URL,
});

export const db = admin.database();
