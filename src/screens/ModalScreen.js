import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  useColorScheme,
} from 'react-native';

const ModalScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState('');
  const colorScheme = useColorScheme();

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const handleCourseSelection = course => {
    setSelectedCourse(course);
    toggleModal();
  };

  const isDarkMode = colorScheme === 'dark';
  console.log(isDarkMode);
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: isDarkMode ? '#1c1c1c' : 'white',
    },
    button: {
      backgroundColor: isDarkMode ? '#ffcc00' : 'blue',
      padding: 10,
      borderRadius: 5,
      marginBottom: 20,
    },
    buttonText: {
      color: isDarkMode ? '#1c1c1c' : 'white',
      fontSize: 16,
      fontWeight: 'bold',
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      backgroundColor: isDarkMode ? '#1c1c1c' : 'white',
      padding: 20,
      borderRadius: 10,
      width: '80%',
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
      color: isDarkMode ? 'white' : 'black',
    },
    courseOption: {
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: isDarkMode ? '#999999' : '#ccc',
    },
    courseOptionText: {
      fontSize: 16,
      color: isDarkMode ? 'white' : 'black',
    },
    selectedCourseText: {
      fontSize: 16,
      marginTop: 20,
      color: isDarkMode ? 'white' : 'black',
    },
  });

  useEffect(() => {
    const colorScheme = useColorScheme();
    setIsDarkMode(colorScheme === 'dark');
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={toggleModal}>
        <Text style={styles.buttonText}>Open Modal</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select a Course</Text>

            <TouchableOpacity
              style={styles.courseOption}
              onPress={() => handleCourseSelection('Course A')}>
              <Text style={styles.courseOptionText}>Course A</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.courseOption}
              onPress={() => handleCourseSelection('Course B')}>
              <Text style={styles.courseOptionText}>Course B</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.courseOption}
              onPress={() => handleCourseSelection('Course C')}>
              <Text style={styles.courseOptionText}>Course C</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {selectedCourse !== '' && (
        <Text style={styles.selectedCourseText}>
          Selected Course: {selectedCourse}
        </Text>
      )}
    </View>
  );
};

export default ModalScreen;
