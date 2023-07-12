import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import api from '../utils/api';
import {AuthContext} from '../context/AuthContext';

const CourseModal = ({modalVisible, setModalVisible}) => {
  const {user, signIn} = useContext(AuthContext);
  const [courseList, setCourseList] = useState([]);
  const colorScheme = useColorScheme();
  const handleCourseSelection = course => {
    const data = {...user, courseSelected: course};
    signIn(data);
    setModalVisible(false);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await api.get('/student/apis/get_course.php', {
        params: {
          user: user?.userData?.id,
        },
      });
      setCourseList(response?.data?.data);
    } catch (error) {
      // Handle the error
      console.error(error);
    }
  };

  const isDarkMode = colorScheme === 'dark';

  const styles = StyleSheet.create({
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      backgroundColor: isDarkMode ? '#1c1c1c' : 'white',
      padding: 20,
      borderRadius: 8,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
      color: isDarkMode ? 'white' : 'black',
    },
    courseOption: {
      padding: 10,
      marginBottom: 10,
      backgroundColor: isDarkMode ? '#333333' : '#f0f0f0',
      borderRadius: 4,
    },
    courseOptionText: {
      fontSize: 16,
      color: isDarkMode ? 'white' : 'black',
    },
  });

  return (
    <Modal visible={modalVisible} transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Select a Course</Text>
          {courseList?.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={styles.courseOption}
              onPress={() => handleCourseSelection(item.id)}>
              <Text style={styles.courseOptionText}>{item.course_name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Modal>
  );
};

export default CourseModal;
