import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Custom database ID from firebase-applet-config.json
const dbId = firebaseConfig.firestoreDatabaseId;
const db = dbId && dbId !== '(default)' ? getFirestore(app, dbId) : getFirestore(app);

export { app, auth, googleProvider, db };
