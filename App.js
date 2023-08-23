import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {AuthProvider} from './src/context/AuthContext';
import StackNavigator from './src/navigation/StackNavigator';
import codePush from 'react-native-code-push';
import {LogLevel, OneSignal} from 'react-native-onesignal';
import {Alert, Linking} from 'react-native';
import VersionCheck from 'react-native-version-check';

// OneSignal Initialization

const codePushOptions = {
  installMode: codePush.InstallMode.IMMEDIATE,
  deploymentKey: 'YezuXvv9WAvq-7TKGo4WOrj1nYL5V91vogPTQ',
  checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
};
import './ignoreWarnings';
const App = () => {
  OneSignal.initialize('dd823ca4-d19f-4786-af77-d3128c8b800d');

  OneSignal.Debug.setLogLevel(LogLevel.Verbose);

  OneSignal.Notifications.requestPermission(true);

  OneSignal.Notifications.addEventListener('click', event => {
    console.log('OneSignal: notification clicked:', event);
  });
  useEffect(() => {
    VersionCheck.getLatestVersion({
      provider: 'playStore', // for Android
    }).then(latestVersion => {
      console.log(latestVersion); // 0.1.2
    });
    VersionCheck.needUpdate().then(async res => {
      console.log(res.isNeeded); // true
      if (res.isNeeded) {
        Alert.alert(
          'You are Using Old Version of Our App. ',
          'Kindly Click OK to Download Latest Update',
          [
            {
              text: 'OK',
              onPress: () => Linking.openURL(res.storeUrl), // open store if update is needed.
            },
          ],
          {cancelable: false},
        );
      }
    });
  }, []);
  return (
    <AuthProvider>
      <NavigationContainer>
        <StackNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
};

export default codePush(codePushOptions)(App);
