import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // ✅ REQUIRED

const firebaseConfig = {
  apiKey: "AIzaSyDTrKWJPLFbLMzr9dGiSGGY75VRZ1Cl7LA",
  authDomain: "togglenest.firebaseapp.com",
  projectId: "togglenest",
  storageBucket: "togglenest.appspot.com",
  messagingSenderId: "458770124644",
  appId: "1:458770124644:web:3ccec7d60331636708b471",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app); // 🔥 ERROR WAS HERE
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();
