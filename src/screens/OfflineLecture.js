import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  BackHandler,
  Alert,
} from 'react-native';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/FontAwesome';
import Slider from '@react-native-community/slider';
import TimeTable from './TimeTable';
const OfflineLecture = ({navigation, route}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const videoRef = useRef(null);

  const toggleControls = () => {
    setShowControls(!showControls);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleBackward = () => {
    videoRef.current.seek(currentTime - 10);
  };

  const handleForward = () => {
    videoRef.current.seek(currentTime + 10);
  };

  const handleSliderChange = value => {
    setCurrentTime(value);
    videoRef.current.seek(value);
  };

  const handleProgress = progress => {
    setCurrentTime(progress.currentTime);
  };

  const handleLoad = data => {
    setDuration(data.duration);
  };

  return (
    <View style={styles.container} onTouchEnd={toggleControls}>
      <Video
        ref={videoRef}
        source={{
          uri: route.params.joinLink,
        }}
        //source={{uri: props.route.params.joinLink}}
        style={styles.video}
        resizeMode="contain"
        paused={!isPlaying}
        onProgress={handleProgress}
        onLoad={handleLoad}
      />
      {showControls && (
        <View style={styles.overlay}>
          <TouchableOpacity onPress={handleBackward} style={styles.button}>
            <Icon name="backward" size={30} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity onPress={togglePlayPause} style={styles.button}>
            <Icon name={isPlaying ? 'pause' : 'play'} size={30} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity onPress={handleForward} style={styles.button}>
            <Icon name="forward" size={30} color="#fff" />
          </TouchableOpacity>
        </View>
      )}
      <Slider
        style={styles.slidebar}
        minimumValue={0}
        maximumValue={duration}
        value={currentTime}
        onSlidingComplete={handleSliderChange}
        minimumTrackTintColor="#fff"
        maximumTrackTintColor="#888"
        thumbTintColor="#fff"
      />

      <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
    </View>
  );
};

const formatTime = seconds => {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes < 10 ? '0' : ''}${minutes}:${secs < 10 ? '0' : ''}${secs}`;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  video: {
    flex: 1,
  },
  slidebar: {
    width: '100%',
    position: 'absolute',
    bottom: 20,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    padding: 10,
  },
  timeText: {
    color: '#fff',
  },
});

export default OfflineLecture;
