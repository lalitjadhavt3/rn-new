import React, {useContext, useState} from 'react';
import {
  Text,
  StyleSheet,
  View,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Alert,
  useColorScheme,
  ActivityIndicator,
} from 'react-native';
import {AuthContext} from '../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../utils/api';
import DeviceInfo from 'react-native-device-info';
const LoginScreen = ({navigation}) => {
  const colorScheme = useColorScheme();
  const styles = colorScheme === 'dark' ? darkStyles : lightStyles;
  const {signIn} = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [deviceId, setDeviceId] = useState();
  DeviceInfo.getAndroidId().then(androidId => {
    setDeviceId(androidId);
  });
  const handleLogin = async () => {
    try {
      if (username != '') {
        if (username.length == 10) {
          var params = new URLSearchParams();
          const data = {
            username: username,
            deviceId: deviceId,
          };
          params.append('username', username);
          params.append('deviceId', deviceId);
          const str = JSON.stringify(data);
          setIsLoading(true);
          const response = await api.post(
            'student/apis/auth.php',
            JSON.parse(str),
          );
          setIsLoading(false);
          console.log(response?.data);
          if (response?.data?.data?.token) {
            navigation.navigate('OTP', {
              userMobile: username,
              register: true,
              token: response?.data?.data?.token,
              userID: response?.data?.data?.id,
              userName: username,
              usertype: response?.data?.data?.usertype,
            });
            // if (response?.data?.data?.deviceId == deviceId) {
            //   try {
            //     await AsyncStorage.setItem(
            //       'authToken',
            //       response?.data?.data?.token,
            //     );
            //     const userdata = {
            //       userID: response?.data?.data?.id,
            //       userName: username,
            //       usertype: response?.data?.data?.usertype,
            //     };
            //     signIn(userdata);
            //     if (response.data.data?.usertype > 2) {
            //       navigation.navigate('Main');
            //     } else {
            //       //navigation.navigate('Join_Screen', Join);
            //     }
            //   } catch (error) {
            //     console.error('Error storing encrypted credentials:', error);
            //   }
            // } else {
            //   Alert.alert(
            //     'Your Number is Already signed in another device. ',
            //     'Click OK to change device',
            //     [
            //       {
            //         text: 'Cancel',
            //         onPress: () => null,
            //         style: 'cancel',
            //       },
            //       {
            //         text: 'OK',
            //         onPress: () =>
            //           navigation.navigate('DeviceUpdate', {
            //             userMobile: username,
            //           }),
            //       },
            //     ],
            //     {cancelable: false},
            //   );
            // }
          } else if (response?.data?.message == 'Not Registered') {
            navigation.navigate('OTP', {
              userMobile: username,
              register: false,
            });
            // Alert.alert(
            //   'Please Register Once to Continue ',
            //   'Kindly Click on Register Now Button',
            //   [
            //     {
            //       text: 'Cancel',
            //       onPress: () => null,
            //       style: 'cancel',
            //     },
            //     {
            //       text: 'Register Now',
            //       onPress: () =>
            //         navigation.navigate('NewRegister', {
            //           userMobile: username,
            //         }),
            //     },
            //   ],
            //   {cancelable: false},
            // );
          } else if (response?.data?.message == 'Device Changed') {
            Alert.alert(
              'Your Number is Already signed in another device. ',
              'Click OK to change device',
              [
                {
                  text: 'Cancel',
                  onPress: () => null,
                  style: 'cancel',
                },
                {
                  text: 'OK',
                  onPress: () =>
                    navigation.navigate('DeviceUpdate', {
                      userMobile: username,
                    }),
                },
              ],
              {cancelable: false},
            );
          } else {
            Alert.alert(response.data.message);
          }
        } else {
          Alert.alert('Please Enter Valid Mobile number');
        }
      } else if (username == '') {
        Alert.alert('Please Enter Mobile number');
      }
    } catch (error) {
      // Handle login error
      console.log(error);
    }
  };
  if (isLoading) {
    return (
      <View style={[styles.loaderContainer]}>
        <ActivityIndicator size="large" />
        <Text>Please Wait....</Text>
      </View>
    );
  }
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>LOGIN</Text>
        <Image
          source={require('../assets/srgeniuslogo.png')}
          style={styles.logo}
        />
      </View>
      <View style={styles.content}>
        <Text style={styles.description}>
          Use your mobile number and password for login purpose!
        </Text>
      </View>
      <View style={styles.formContainer}>
        <TextInput
          placeholder="Enter Mobile Number"
          style={styles.inputField}
          value={username}
          keyboardType={'numeric'}
          onChangeText={setUsername}
          placeholderTextColor={colorScheme == 'dark' ? 'white' : 'grey'}
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>LOGIN</Text>
        </TouchableOpacity>
      </View>

      {/* <TouchableOpacity style={styles.forgotPasswordButton}>
      <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
     </TouchableOpacity> */}
    </KeyboardAvoidingView>
  );
};

const {width} = Dimensions.get('window');

const lightStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain', // Adjust the image content's aspect ratio
  },
  header: {
    marginTop: 1,
  },
  title: {
    paddingTop: 60,
    fontSize: 24,
    fontWeight: '700',
    color: '#002D62',
    textAlign: 'center',
    paddingBottom: 10, // Align text center
  },
  content: {
    alignItems: 'center',
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  description: {
    textAlign: 'center',
    color: '#002D62',
    fontWeight: '700',
    fontSize: 14,
  },
  formContainer: {
    width: width * 0.8,
    alignItems: 'center',
  },
  inputField: {
    width: '100%',
    height: 40,
    borderColor: '#002D62',
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 10,
    paddingHorizontal: 10,
    color: 'black',
  },
  button: {
    backgroundColor: '#007FFF',
    width: '70%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    marginTop: 20,
  },
  inputFieldDarkModePlaceholder: {
    color: 'black',
  },
  registerbutton: {
    backgroundColor: '#25D366',
    width: '70%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonByGoogle: {
    flexDirection: 'row',
    alignItems: 'center',

    width: '100%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 10,
    borderColor: '#002D62',
    borderWidth: 2,
  },
  googleIconWrapper: {
    marginRight: 10,
  },
  googleIcon: {
    width: 20,
    height: 20,
  },
  googleText: {
    color: '#002D62',
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 10,
  },
  backIcon: {
    width: 20,
    height: 20,
  },
  forgotPasswordButton: {
    marginTop: 20,
  },
  forgotPasswordText: {
    color: 'blue',
    fontSize: 13,
  },
});
const darkStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  header: {
    marginTop: 1,
  },
  title: {
    paddingTop: 60,
    fontSize: 24,
    fontWeight: '700',
    color: '#FFF',
    textAlign: 'center',
    paddingBottom: 10,
  },

  content: {
    alignItems: 'center',
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  description: {
    textAlign: 'center',
    color: '#FFF',
    fontWeight: '700',
    fontSize: 14,
  },

  formContainer: {
    width: width * 0.8,
    alignItems: 'center',
  },
  inputField: {
    width: '100%',
    height: 40,
    borderColor: '#FFF',
    color: '#FFF',
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 10,
    paddingHorizontal: 10,
  },

  inputFieldDarkModePlaceholder: {
    color: 'white',
  },
  button: {
    width: '70%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    marginTop: 20,
    backgroundColor: '#007FFF',
    borderWidth: 1,
    borderColor: '#007FFF',
  },

  registerbutton: {
    width: '70%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    marginTop: 10,
    backgroundColor: '#25D366',
    borderWidth: 1,
  },

  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonTextDarkMode: {
    color: '#007FFF',
  },
});
export default LoginScreen;
