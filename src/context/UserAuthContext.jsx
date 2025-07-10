import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../config/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const UserAuthContext = createContext();

export const UserAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <UserAuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </UserAuthContext.Provider>
  );
};

export const useUserAuth = () => {
  const context = useContext(UserAuthContext);
  if (!context) throw new Error('useUserAuth must be used within a UserAuthProvider');
  return context;
}; 