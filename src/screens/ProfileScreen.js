import React, {useEffect, useState, useContext} from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  Image,
  TouchableOpacity,
  useColorScheme,
  Modal,
  Alert,
} from 'react-native';
import {AuthContext} from '../context/AuthContext';
import {BackHandler} from 'react-native';
import CourseModal from '../components/CourseModal';

const UserAccountSection = ({navigation, route}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [contactModalVisible, setContactModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const toggleContactModal = () => {
    setContactModalVisible(!contactModalVisible);
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
          <Text style={styles.title}>Welcome!</Text>
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
          <TouchableOpacity
            style={styles.contactButton}
            onPress={toggleContactModal}>
            <Text style={styles.buttonText}>Contact Us</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>

          <Modal
            visible={contactModalVisible}
            animationType="fade"
            transparent={true}
            onRequestClose={() => setContactModalVisible(false)}>
            <View style={styles.modalContainer}>
              <View style={styles.contactModalContent}>
                <Text style={styles.contactModalTitle}>Contact Us</Text>
                <Text style={styles.contactModalTextBold}>
                  For any inquiries or support, please reach out to us at:
                </Text>
                <Text style={styles.contactModalText}>
                  Email: contact@srgenuisacademy.com
                </Text>
                <Text style={styles.contactModalText}>Phone: 9404827943</Text>
                <Text style={styles.contactModalText}>
                  Address: SR Genius Academy, Shop Inspector Office, Opp Bus
                  Stand, Umarkhed.
                </Text>

                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={toggleContactModal}>
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
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
  contactButton: {
    backgroundColor: '#25D366',
    width: '60%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
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
    marginTop: 30,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  contactModalContent: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 10,
  },
  contactModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    fontWeight: 900,
    marginBottom: 10,
    textAlign: 'center',
  },
  contactModalText: {
    fontSize: 16,
    marginBottom: 10,
  },
  contactModalTextBold: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 600,
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: '#007FFF',
    width: 100,
    height: 30,
    borderRadius: 10,
    marginTop: 30,
    marginLeft: '36%',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    padding: 3,
    fontWeight: '600',
    textAlign: 'center',
    alignContent: 'center',
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
  contactButton: {
    backgroundColor: '#25D366',
    width: '60%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  contactModalContent: {
    backgroundColor: '#333333',
    padding: 20,
    borderRadius: 10,
  },
  contactModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#FFFFFF',
  },
  contactModalText: {
    fontSize: 16,
    marginBottom: 10,
    color: '#FFFFFF',
  },
  closeButton: {
    backgroundColor: 'black',
    width: 100,
    height: 30,
    borderRadius: 10,
    marginTop: 30,
    marginLeft: '36%',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    padding: 3,
    fontWeight: '600',
    textAlign: 'center',
    alignContent: 'center',
    backgroundColor: 'blue',
  },
});

export default UserAccountSection;
