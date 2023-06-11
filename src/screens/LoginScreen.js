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
} from 'react-native';
import {AuthContext} from '../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import api from '../utils/api';
const LoginScreen = ({navigation}) => {
  const {signIn} = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const handleLogin = async () => {
    try {
      if (username != '' && password != '') {
        if (username.length == 10) {
          var params = new URLSearchParams();
          const data = {
            username: username,
            password: password,
            deviceId: 'abc',
          };
          params.append('username', username);
          params.append('password', password);
          params.append('deviceId', 'abc');

          const str = JSON.stringify(data);
          const response = await api.post('auth.php', JSON.parse(str));

          if (response?.data?.data?.token) {
            try {
              await AsyncStorage.setItem(
                'authToken',
                response?.data?.data?.token,
              );
              signIn(response?.data?.data?.id);
              if (response.data.data?.usertype > 2) {
                navigation.navigate('Main');
              } else {
                //navigation.navigate('Join_Screen', Join);
              }
            } catch (error) {
              console.error('Error storing encrypted credentials:', error);
            }
          } else {
            Alert.alert(response.data.message);
          }
        } else {
          Alert.alert('Please Enter Valid Mobile number');
        }
      } else if (username == '') {
        Alert.alert('Please Enter Mobile number');
      } else if (password == '') {
        Alert.alert('Please Enter Password');
      }
    } catch (error) {
      // Handle login error
      console.log(error);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Login</Text>
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
        />
        <TextInput
          placeholder="Enter Password"
          secureTextEntry={true}
          style={styles.inputField}
          onChangeText={setPassword}
          value={password}
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.registerbutton}
          onPress={() => {
            navigation.navigate('Register');
          }}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      </View>
      {/* <TouchableOpacity style={styles.forgotPasswordButton}>
      <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
     </TouchableOpacity> */}
    </KeyboardAvoidingView>
  );
};

const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    marginTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: 'black',
  },
  content: {
    alignItems: 'center',
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  description: {
    textAlign: 'center',
    color: 'black',
    fontSize: 14,
  },
  formContainer: {
    width: width * 0.8,
    alignItems: 'center',
  },
  inputField: {
    width: '100%',
    height: 40,
    borderColor: '#969696',
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 10,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#185DCF',
    width: '100%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 10,
  },
  registerbutton: {
    backgroundColor: '#25D366',
    width: '100%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
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
    borderColor: 'black',
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
    color: 'black',
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

export default LoginScreen;
