import React, {useEffect, useState, useContext} from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';
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
  }, []);
  const handleBackPress = () => {
    console.log(navigation.getState());
  };
  const {user, signOut, signIn} = useContext(AuthContext);

  return (
    <View style={styles.container}>
      {user ? (
        <>
          <Text>Welcome !</Text>
          <Button
            title="Select Course"
            onPress={() => {
              toggleModal();
            }}
          />
          <CourseModal
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
          />

          <Button
            title="Reset course"
            onPress={() => {
              const data = {...user, courseSelected: ''};
              signIn(data);
            }}
          />
          <Button
            title="Payment page"
            onPress={() => {
              navigation.navigate('Payment');
            }}
          />
          <Button
            title="Logout"
            onPress={() => {
              signOut();
            }}
          />
        </>
      ) : (
        <>
          <Text>Welcome, Guest!</Text>
          <Button
            title="Login"
            onPress={() => {
              //navigation.navigate('Login', Login);
            }}
          />
          <Button title="Register Now" onPress={() => {}} />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
});

export default UserAccountSection;
