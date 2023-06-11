import React, {useContext, useEffect} from 'react';
import {View, Text} from 'react-native';
import {AuthContext} from '../context/AuthContext';
const HomeScreen = () => {
  const {user} = useContext(AuthContext);

  useEffect(() => {
    if (!user) {
      navigation.navigate('Login');
    }
  }, [user]);
  return (
    <View>
      <Text>Home Screen</Text>
    </View>
  );
};

export default HomeScreen;
