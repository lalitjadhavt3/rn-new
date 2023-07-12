import {WebView} from 'react-native-webview';
import React, {useState, useContext, useEffect, useCallback} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {
  RefreshControl,
  ScrollView,
  BackHandler,
  View,
  Text,
  Dimensions,
  StatusBar,
  Alert,
} from 'react-native';
import {AuthContext} from '../context/AuthContext';
import {API_BASE_URL} from '../utils/api';
import Orientation, {
  PORTRAIT,
  LANDSCAPE,
  lockToPortrait,
  lockToLandscape,
  unlockAllOrientations,
} from 'react-native-orientation-locker';

const YoutubeVideo = ({navigation, route}) => {
  const [refreshing, setRefreshing] = useState(false);
  const [refreshCount, setRefreshCount] = useState(0);
  const [orientation, setOrientation] = useState('portrait');
  const onRefresh = () => {
    setRefreshing(true);
    setRefreshCount(refreshCount + 1);
    setRefreshing(false);
  };
  const injectedJavaScript = `
  document.addEventListener('DOMContentLoaded', function() {
    document.body.addEventListener('copy', function(event) {
      event.preventDefault();
      return false;
    });

    document.body.addEventListener('cut', function(event) {
      event.preventDefault();
      return false;
    });

    document.body.addEventListener('paste', function(event) {
      event.preventDefault();
      return false;
    });
  });
`;

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        setRefreshCount(0); // Reset refreshCount when navigating back
        return false; // Prevent default back behavior
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );

      // Change orientation to landscape when the screen comes into focus
      Orientation.lockToLandscape();

      return () => {
        backHandler.remove();
        // Reset the orientation to portrait mode and unlock all orientations when the screen loses focus
        Orientation.lockToPortrait();
        Orientation.unlockAllOrientations();
      };
    }, []),
  );
  // Construct the WebView URL with query parameters
  const webViewUrl = `${API_BASE_URL}student/utube.php?str=${Math.random()}&video_id=${
    route?.params?.joinLink
  }`;
  console.log(webViewUrl);

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
        injectedJavaScript={injectedJavaScript}
      />
    </ScrollView>
  );
};

export default YoutubeVideo;
