import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const hasValidConfig = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.apiKey !== "MY_FIREBASE_API_KEY" &&
  !firebaseConfig.apiKey.includes("MY_")
);

export const firebaseApp = hasValidConfig ? initializeApp(firebaseConfig) : null;

export const firebaseAnalytics = hasValidConfig
  ? isSupported().then((supported) => {
      if (!supported || !firebaseApp) return null;
      return getAnalytics(firebaseApp);
    })
  : Promise.resolve(null);

