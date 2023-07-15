import {WebView} from 'react-native-webview';
import React, {useState, useCallback, useEffect} from 'react';
import {
  RefreshControl,
  ScrollView,
  BackHandler,
  useColorScheme,
} from 'react-native';
import {API_BASE_URL} from '../utils/api';
import DeviceInfo from 'react-native-device-info';

const NewRegisterScreen = ({navigation}) => {
  const [refreshing, setRefreshing] = useState(false);
  const colorScheme = useColorScheme();
  const [webViewUrl, setWebviewUrl] = useState('');
  const [refreshCount, setRefreshCount] = useState(0);
  const [deviceId, setDeviceId] = useState();
  DeviceInfo.getAndroidId().then(androidId => {
    setDeviceId(androidId);
  });
  const messageWebview = event => {
    // Handle the message received from the WebView
    const messageFromWebView = event.nativeEvent.data;
    console.log('Message from WebView:', messageFromWebView);
    if (messageFromWebView == 'Registration Completed') {
      navigation.navigate('Login');
    }
    // Perform any action in the React Native code based on the message received
  };
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
      },
    ];
    setWebviewUrl(
      `${API_BASE_URL}/student/apis/register_student_f.php?data=${encodeURIComponent(
        JSON.stringify(data),
      )}`,
    );
  };
  useEffect(() => {
    changeUrl();
  }, []);
  useEffect(() => {
    changeUrl();
  }, [colorScheme]);

  const ongetMessage = e => {
    console.log(e);
  };
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
      {console.log('registration url', webViewUrl)}
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

export default NewRegisterScreen;
