"use client";

import { createContext, useState, useContext, useEffect } from "react";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { app } from "../firebase/config";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth(app);
  const db = getFirestore(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Get additional user data from Firestore
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const userData = userDoc.data();

        setCurrentUser({
          uid: user.uid,
          email: user.email,
          name: user.displayName || userData?.name,
          role: userData?.role || "user",
          photoURL: user.photoURL,
        });
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [auth, db]);

  const login = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result.user;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const signup = async (name, email, password) => {
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Create user document in Firestore
      await setDoc(doc(db, "users", result.user.uid), {
        name,
        email,
        role: "user",
        createdAt: new Date().toISOString(),
      });

      return result.user;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      // Check if user exists in Firestore
      const userDoc = await getDoc(doc(db, "users", result.user.uid));

      if (!userDoc.exists()) {
        // Create new user document
        await setDoc(doc(db, "users", result.user.uid), {
          name: result.user.displayName,
          email: result.user.email,
          role: "user",
          photoURL: result.user.photoURL,
          createdAt: new Date().toISOString(),
        });
      }

      return result.user;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const signInWithFacebook = async () => {
    try {
      const provider = new FacebookAuthProvider();
      const result = await signInWithPopup(auth, provider);

      // Check if user exists in Firestore
      const userDoc = await getDoc(doc(db, "users", result.user.uid));

      if (!userDoc.exists()) {
        // Create new user document
        await setDoc(doc(db, "users", result.user.uid), {
          name: result.user.displayName,
          email: result.user.email,
          role: "user",
          photoURL: result.user.photoURL,
          createdAt: new Date().toISOString(),
        });
      }

      return result.user;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const isAdmin = () => {
    return currentUser?.role === "admin";
  };

  const value = {
    currentUser,
    login,
    signup,
    logout,
    resetPassword,
    signInWithGoogle,
    signInWithFacebook,
    isAdmin,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
