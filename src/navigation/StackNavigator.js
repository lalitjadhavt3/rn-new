import React, {useContext, useState, useEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {View, Text, ActivityIndicator} from 'react-native';
import BottomTabNavigator from './BottomTabNavigator';
import LoginScreen from '../screens/LoginScreen';
import {AuthContext} from '../context/AuthContext';
import RegisterScreen from '../screens/RegisterScreen';
import PaymentScreen from '../screens/PaymentScreen';
import NewRegisterScreen from '../screens/NewRegisterScreen';
import DeviceUpdateScreen from '../screens/DeviceUpdateScreen';
import ResetPassword from '../screens/ResetPasswordScreen';
import OTPScreen from '../screens/OTPScreen';
const Stack = createStackNavigator();

const StackNavigator = () => {
  const {user, isLoading} = useContext(AuthContext);
  const [loadingvar, setLoading] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setLoading(true);
    }, 800);
  }, []);
  if (loadingvar) {
    return (
      <Stack.Navigator>
        {user ? (
          <Stack.Screen
            name="Main"
            component={BottomTabNavigator}
            options={{headerShown: false}}
          />
        ) : (
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="ResetPasswordScreen"
              component={ResetPassword}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="NewRegister"
              component={NewRegisterScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="OTP"
              component={OTPScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="DeviceUpdate"
              component={DeviceUpdateScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Payment"
              component={PaymentScreen}
              options={{headerShown: false}}
            />
          </>
        )}
      </Stack.Navigator>
    );
  } else {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" />
        <Text style={{marginTop: 10}}>Loading...</Text>
      </View>
    );
  }
};

export default StackNavigator;
