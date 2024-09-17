import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDXICiqhRFoUvQEuF5MVkSO0ImSzmB1Duo",
  authDomain: "mofit-3badc.firebaseapp.com",
  projectId: "mofit-3badc",
  storageBucket: "mofit-3badc.appspot.com",
  messagingSenderId: "209633891984",
  appId: "1:209633891984:web:b49dc3e4e4548ce3016a15"
};


const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const db = getFirestore(app);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export { auth, db };
