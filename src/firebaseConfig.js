import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';
import { collection, addDoc } from 'firebase/firestore'; // Pode manter
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCoZ6Mxnc9Q4csOh72bV-PukwG5gXnzdEs",
  authDomain: "reciclesyeapp.firebaseapp.com",
  projectId: "reciclesyeapp",
  storageBucket: "reciclesyeapp.appspot.com",
  messagingSenderId: "226538094136",
  appId: "1:226538094136:android:414f8d9f044ea1879cb0cd"
};

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

const db = getFirestore(app);

export { auth, db };
