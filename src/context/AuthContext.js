import React, {createContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deviceId, setDeviceId] = useState();
  DeviceInfo.getAndroidId().then(androidId => {
    setDeviceId(androidId);
  });
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
      value={{user, signIn, signOut, isLoading, setIsLoading, deviceId}}>
      {children}
    </AuthContext.Provider>
  );
};
