import {WebView} from 'react-native-webview';
import React, {useState, useEffect, useContext, useCallback} from 'react';
import {RefreshControl, ScrollView} from 'react-native';
import {AuthContext} from '../context/AuthContext';
const API_BASE_URL = 'http://192.168.1.2/nexus/pay/cart.php';
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
    },
  ];
  // Construct the WebView URL with query parameters
  const webViewUrl = `${API_BASE_URL}?data=${encodeURIComponent(
    JSON.stringify(data),
  )}`;
  console.log(webViewUrl);
  // Render the WebView component
  return <WebView style={{width: '100%'}} source={{uri: webViewUrl}} />;
};
export default PaymentScreen;
