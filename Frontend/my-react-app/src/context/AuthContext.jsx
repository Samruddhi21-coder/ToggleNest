import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore"; // <- added getDoc
import { auth, db } from "../firebase";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const docRef = doc(db, "users", firebaseUser.uid);

        // Fetch the document
        const snap = await getDoc(docRef);

        // If it doesn't exist, create it
        if (!snap.exists()) {
          await setDoc(docRef, {
            email: firebaseUser.email,
            name: firebaseUser.displayName || "",
            onboardingCompleted: false,
            createdAt: new Date(),
          });
        }

        // Update state
        const updatedSnap = await getDoc(docRef);
        setUser(firebaseUser);
        setUserData(updatedSnap.data());
      } else {
        setUser(null);
        setUserData(null);
      }

      setLoading(false);
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
