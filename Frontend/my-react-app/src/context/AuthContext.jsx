import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore"; // <- added getDoc
import { auth, db } from "../firebase";
import { onSnapshot } from "firebase/firestore";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
    try {
      if (firebaseUser) {
        const docRef = doc(db, "users", firebaseUser.uid);
        const snap = await getDoc(docRef);

        if (!snap.exists()) {
          await setDoc(docRef, {
            email: firebaseUser.email,
            name: firebaseUser.displayName || "",
            role: null,
            onboardingCompleted: false,
            createdAt: new Date(),
          });
        }

        const updatedSnap = await getDoc(docRef);
        setUser(firebaseUser);
        setUserData(updatedSnap.data());
      } else {
        setUser(null);
        setUserData(null);
      }
    } catch (error) {
      console.error("AuthContext Error:", error);
      setUser(null);
      setUserData(null);
    } finally {
      setLoading(false); // 🔥 GUARANTEED
    }
    console.log("Auth loading:", loading);
console.log("User:", user);
console.log("UserData:", userData);

  });

  return () => unsub();
}, []);
  return (
    <AuthContext.Provider value={{ user, userData, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth
export const useAuth = () => useContext(AuthContext);
