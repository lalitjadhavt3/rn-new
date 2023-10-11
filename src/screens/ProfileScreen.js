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
import {
  CartIcon,
  ContactUsIcon,
  CourseSelect,
  SettingIcon,
  Logout,
  DefaultProfile,
} from '../assets/icons';

const UserAccountSection = ({navigation, route}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [contactModalVisible, setContactModalVisible] = useState(false);
  const IconButton = ({iconSource, text, onPress}) => (
    <TouchableOpacity style={styles.buttonContainer} onPress={onPress}>
      {iconSource}
      <Text style={styles.buttonText}>{text}</Text>
    </TouchableOpacity>
  );
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
          <View style={styles.ImageContainer}>
            <DefaultProfile />
            <Text style={styles.title}>Welcome {user?.userData?.fname}</Text>
          </View>
          <IconButton
            iconSource={<SettingIcon style={styles.icon} />}
            text="Edit Profile"
            onPressIn={() => {
              Alert.alert('This functionality is under construction');
            }}
          />
          <IconButton
            iconSource={<CourseSelect style={styles.icon} />}
            text="Select Course"
            onPress={toggleModal}
          />
          <CourseModal
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
          />
          <IconButton
            iconSource={<CartIcon style={styles.icon} />}
            text="Buy New Course(s)"
            onPress={() => {
              navigation.navigate('Payment', {buyCourse: true});
            }}
          />
          <IconButton
            iconSource={<ContactUsIcon style={styles.icon} />}
            text="Contact Us"
            onPress={toggleContactModal}
          />
          <TouchableOpacity
            style={styles.logoutbuttonContainer}
            onPress={signOut}>
            <Logout style={styles.icon} />
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
    backgroundColor: 'white',
  },
  ImageContainer: {
    width: '80%',
    height: 200,
    justifyContent: 'center',
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
  profileImage: {
    width: 150,
    height: 150,
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
    color: 'black',
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
  logoutbuttonContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#ff5722',
    width: '90%',
    height: 55,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'white',
    width: '90%',
    height: 55,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  icon: {
    marginRight: 10, // Adjust the margin as needed
    width: 30, // Set the width of the icon
    height: 30, // Set the height of the icon
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
