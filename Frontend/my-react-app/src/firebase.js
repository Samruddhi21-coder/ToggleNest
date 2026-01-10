import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider ,GithubAuthProvider} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDTrKWJPLFbLMzr9dGiSGGY75VRZ1Cl7LA",
  authDomain: "togglenest.firebaseapp.com",
  projectId: "togglenest",
  storageBucket: "togglenest.firebasestorage.app",
  messagingSenderId: "458770124644",
  appId: "1:458770124644:web:3ccec7d60331636708b471",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();
