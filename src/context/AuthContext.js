import React, {createContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const restoreUser = async () => {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
        setIsLoading(false);
      }
    };
    restoreUser();
  }, []);

  const signIn = async data => {
    await AsyncStorage.setItem('user', JSON.stringify(data));
    setIsLoading(false);
    setUser(data);
  };

  const signOut = async () => {
    await AsyncStorage.removeItem('user');
    setIsLoading(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{user, signIn, signOut, isLoading, setIsLoading}}>
      {children}
    </AuthContext.Provider>
  );
};
