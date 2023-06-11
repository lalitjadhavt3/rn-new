import React, {useEffect, useState, useContext} from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';
import {AuthContext} from '../context/AuthContext';
import {BackHandler} from 'react-native';

const UserAccountSection = ({navigation, route}) => {
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackPress,
    );
  }, []);
  const handleBackPress = () => {
    console.log(navigation.getState());
  };
  const {user, signOut} = useContext(AuthContext);

  return (
    <View style={styles.container}>
      {user ? (
        <>
          <Text>Welcome, {console.log(user)}!</Text>
          <Button
            title="Settings"
            onPress={() => console.log('Go to settings')}
          />
          <Button
            title="Logout"
            onPress={() => {
              signOut();
            }}
          />
        </>
      ) : (
        <>
          <Text>Welcome, Guest!</Text>
          <Button
            title="Login"
            onPress={() => {
              //navigation.navigate('Login', Login);
            }}
          />
          <Button title="Register Now" onPress={() => {}} />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
});

export default UserAccountSection;
