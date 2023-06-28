import React, {useEffect, useState, useContext} from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  Image,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import {AuthContext} from '../context/AuthContext';
import {BackHandler} from 'react-native';
import CourseModal from '../components/CourseModal';

const UserAccountSection = ({navigation, route}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackPress,
    );
    return () => backHandler.remove();
  }, []);

  const handleBackPress = () => {
    console.log(navigation.getState());
  };

  const {user, signOut, signIn} = useContext(AuthContext);
  const colorScheme = useColorScheme();
  const styles = colorScheme === 'dark' ? darkStyles : lightStyles;

  return (
    <View style={styles.container}>
      {user ? (
        <>
          <Image
            source={require('../assets/profile.png')}
            style={styles.logo}
          />
          <Text style={styles.title}>Welcome !</Text>
          <TouchableOpacity style={styles.button} onPress={toggleModal}>
            <Text style={styles.buttonText}>Select Course</Text>
          </TouchableOpacity>
          <CourseModal
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
          />

          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              const data = {...user, courseSelected: ''};
              signIn(data);
            }}>
            <Text style={styles.buttonText}>Reset Course</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text>Welcome, Guest!</Text>
          <Button title="Login" onPress={() => {}} />
          <Button title="Register Now" onPress={() => {}} />
        </>
      )}
    </View>
  );
};

const lightStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: 'black',
    textAlign: 'center',
    paddingBottom: 30,
  },
  button: {
    backgroundColor: '#007FFF',
    width: '60%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 20,
  },
  logo: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
  },
  logoutButton: {
    backgroundColor: '#FF0000',
    width: '60%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 70,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

const darkStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    paddingBottom: 30,
  },
  button: {
    backgroundColor: '#007FFF',
    width: '60%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 20,
  },
  logo: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
  },
  logoutButton: {
    backgroundColor: '#FF0000',
    width: '60%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 70,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default UserAccountSection;
