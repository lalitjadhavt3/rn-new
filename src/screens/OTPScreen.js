import {WebView} from 'react-native-webview';
import React, {useState, useCallback, useEffect, useContext} from 'react';
import {
  RefreshControl,
  ScrollView,
  BackHandler,
  useColorScheme,
} from 'react-native';
import {API_BASE_URL} from '../utils/api';
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AuthContext} from '../context/AuthContext';

const OTPScreen = ({navigation, route}) => {
  const {signIn} = useContext(AuthContext);

  const [refreshing, setRefreshing] = useState(false);
  const colorScheme = useColorScheme();
  const [webViewUrl, setWebviewUrl] = useState('');
  const [refreshCount, setRefreshCount] = useState(0);
  const [deviceId, setDeviceId] = useState();
  DeviceInfo.getAndroidId().then(androidId => {
    setDeviceId(androidId);
  });
  const messageWebview = async event => {
    // Handle the message received from the WebView
    const messageFromWebView = event.nativeEvent.data;
    console.log('Message from WebView:', messageFromWebView);

    if (messageFromWebView != 'Verification Completed') {
      const msgwebview = JSON.parse(messageFromWebView);
      console.log('Message object:', msgwebview.message);
      if (msgwebview?.message == 'Registration Completed') {
        console.log('Registration complete message', msgwebview);
        try {
          await AsyncStorage.setItem(
            'authToken',
            msgwebview?.token ? msgwebview?.token : null,
          );
          const userdata = {
            userID: msgwebview?.userID ? msgwebview?.userID : null,
            usertype: 3,
          };
          signIn(userdata);
          navigation.navigate('Main');
        } catch (error) {
          console.error('Error storing encrypted credentials:', error);
        }
      }
    } else if (messageFromWebView == 'Verification Completed') {
      try {
        await AsyncStorage.setItem(
          'authToken',
          route?.params?.token ? route?.params?.token : null,
        );
        const userdata = {
          userID: route?.params?.userID,
          userName: route?.params?.userName,
          usertype: route?.params?.usertype,
        };
        signIn(userdata);
        if (response.data.data?.usertype > 2) {
          navigation.navigate('Main');
        } else {
          //navigation.navigate('Join_Screen', Join);
        }
      } catch (error) {
        console.error('Error storing encrypted credentials:', error);
      }
    }
  };
  // Perform any action in the React Native code based on the message received

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setRefreshCount(refreshCount + 1);
    setRefreshing(false);
  }, [refreshCount]);
  const changeUrl = () => {
    const data = [
      {
        deviceId: deviceId,
        randomString: Math.random(),
        colorScheme: colorScheme,
        userMobile: route?.params?.userMobile
          ? route?.params?.userMobile
          : null,
        registered: route?.params?.register ? true : false,
        token: route?.params?.token ? route?.params?.token : null,
      },
    ];
    if (route?.params?.token) {
      setWebviewUrl(
        `${API_BASE_URL}/student/apis/verify_otp.php?data=${encodeURIComponent(
          JSON.stringify(data),
        )}`,
      );
    } else {
      setWebviewUrl(
        `${API_BASE_URL}/student/apis/verify_otp.php?data=${encodeURIComponent(
          JSON.stringify(data),
        )}`,
      );
    }
  };
  useEffect(() => {
    changeUrl();
  }, []);
  useEffect(() => {
    changeUrl();
  }, [colorScheme]);

  useEffect(() => {
    const backAction = () => {
      setRefreshCount(0); // Reset refreshCount when navigating back
      return false; // Prevent default back behavior
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  return (
    <ScrollView
      contentContainerStyle={{flexGrow: 1}}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      {console.log('OTP url', webViewUrl)}
      <WebView
        key={refreshCount} // Add key prop to force WebView remount on refresh
        style={{flex: 1}}
        javaScriptEnabled={true}
        originWhitelist={['*']}
        source={{uri: webViewUrl}}
        cacheEnabled={false}
        incognito={true}
        mixedContentMode="compatibility"
        onMessage={messageWebview}
      />
    </ScrollView>
  );
};

export default OTPScreen;
