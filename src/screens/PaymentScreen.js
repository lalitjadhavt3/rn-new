import {WebView} from 'react-native-webview';
import React, {useState, useContext, useCallback, useEffect} from 'react';
import {RefreshControl, ScrollView, BackHandler} from 'react-native';
import {AuthContext} from '../context/AuthContext';
import {API_BASE_URL} from '../utils/api';

const PaymentScreen = ({navigation}) => {
  const {user} = useContext(AuthContext);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshCount, setRefreshCount] = useState(0);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setRefreshCount(refreshCount + 1);
    setRefreshing(false);
  }, [refreshCount]);

  const data = [
    {
      userDetails: user,
      randomString: Math.random(),
    },
  ];

  // Construct the WebView URL with query parameters
  const webViewUrl = `${API_BASE_URL}pay/cart.php?data=${encodeURIComponent(
    JSON.stringify(data),
  )}`;
  console.log(webViewUrl);

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
      <WebView
        key={refreshCount} // Add key prop to force WebView remount on refresh
        style={{flex: 1}}
        source={{uri: webViewUrl}}
      />
    </ScrollView>
  );
};

export default PaymentScreen;
