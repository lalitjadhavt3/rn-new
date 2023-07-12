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
  // const updateOrientation = () => {
  //   console.log('ore', orientation);
  //   const {width, height} = Dimensions.get('window');
  //   if (width > height) {
  //     setOrientation('landscape');
  //   } else {
  //     setOrientation('portrait');
  //     if (orientation == 'portrait') {
  //       Alert.alert(
  //         'Change Orientation',
  //         'Please rotate your device to landscape orientation.',
  //         [
  //           {
  //             text: 'OK',
  //             onPress: () => Orientation.lockToLandscapeLeft(),
  //           },
  //         ],
  //         {cancelable: false},
  //       );
  //     }
  //   }
  // };
  // useFocusEffect(() => {
  //   updateOrientation();

  //   // Listen to orientation change events

  //   return () => {
  //     Orientation.lockToPortrait();
  //   };
  // }, []);
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
      />
    </ScrollView>
  );
};

export default YoutubeVideo;
