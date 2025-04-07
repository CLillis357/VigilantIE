import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyCJm-KoVoFt65YTW7Vpj-IiOnyldpLaPPY",
    authDomain: "vigiliantie.firebaseapp.com",
    projectId: "vigiliantie",
    storageBucket: "vigiliantie.firebasestorage.app",
    messagingSenderId: "869077837587",
    appId: "1:869077837587:web:07a22fbf1266beeec09ce6",
    measurementId: "G-H09G09K3J3"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);  // Firestore database
export const auth = getAuth(app);      // Firebase Authentication


