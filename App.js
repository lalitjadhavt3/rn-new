import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {AuthProvider} from './src/context/AuthContext';
import StackNavigator from './src/navigation/StackNavigator';
import codePush from 'react-native-code-push';
const codePushOptions = {
  installMode: codePush.InstallMode.IMMEDIATE,
  deploymentKey: 'YezuXvv9WAvq-7TKGo4WOrj1nYL5V91vogPTQ',
  checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
};
import './ignoreWarnings';
const App = () => {
  return (
    <AuthProvider>
      <NavigationContainer>
        <StackNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
};

export default codePush(codePushOptions)(App);
