import React, {useContext, useEffect, useState} from 'react';
import api, {API_BASE_URL} from '../utils/api';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import CourseModal from '../components/CourseModal';
import {AuthContext} from '../context/AuthContext';
const data = [
  {
    id: '1',
    lessonTitle: 'Course 1',
    lessonDescription: 'Free Hrtml asdfnkajdf sad',
    imageSource: require('../assets/calendar.png'),
  },
  {
    id: '2',
    lessonTitle: 'Course 2',
    lessonDescription: 'Free Hrtml asdfnkajdf sad Free Hrtml asdfnkajdf sad ',
    imageSource: require('../assets/image-20.png'),
  },
  // Add more data objects as needed
];

const AllLectures = ({navigation, route}) => {
  const {subjectId, subjectName} = route.params;
  const [courseData, setCourseData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true); // Added loading state
  const {user} = useContext(AuthContext);
  useEffect(() => {
    if (
      !user?.courseSelected ||
      user?.courseSelected === undefined ||
      user?.courseSelected === ''
    ) {
      setModalVisible(true);
    }
  }, []);
  useEffect(() => {
    const fetchCourseData = async subjectId => {
      try {
        const response = await api.get('/student/apis/get_lesson_list.php', {
          params: {
            subjectId: subjectId != undefined ? subjectId : null,
            user: user?.userID,
            courseId: user?.courseSelected,
          },
        });

        setCourseData(response?.data?.data);
      } catch (error) {
        // Handle the error
        console.error(error);
      } finally {
        setLoading(false); // Hide loader after data is fetched
      }
    };
    if (subjectId) {
      fetchCourseData(subjectId);
    } else {
      fetchCourseData();
    }
  }, []);
  if (loading && !modalVisible) {
    return (
      <CourseModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />
    );
  } else {
    return (
      <ScrollView>
        <Text style={styles.subjectTitle}>
          {subjectName ? subjectName : 'All Videos'}
        </Text>
        {courseData.map((item, index) => (
          <View key={index} style={styles.card}>
            <View style={styles.imageContainer}>
              <Image
                source={{uri: API_BASE_URL + 'admin/' + item.lesson_bg_image}}
                style={styles.image}
                resizeMode="cover"
              />
            </View>
            <View style={styles.detailsContainer}>
              <Text style={styles.lessonTitle}>{item.lesson_title}</Text>
              <Text style={styles.lessonDescription}> </Text>
              <View style={styles.detailsPlayBtn}>
                <TouchableOpacity
                  style={styles.playButton}
                  onPressIn={() => {
                    navigation.navigate('YoutubeVideo', {
                      joinLink: item?.lesson_link,
                      username: user?.username,
                    });
                  }}>
                  <Text style={styles.playButtonText}>Play</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    );
  }
};

const styles = StyleSheet.create({
  subjectTitle: {
    fontSize: 30,
    margin: 20,
    textAlign: 'center',
    justifyContent: 'center',
    color: 'black',
  },
  card: {
    margin: 15,
    borderRadius: 5,
    overflow: 'hidden',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ddd',
    elevation: 2,
  },
  imageContainer: {
    width: '30%',
    justifyContent: 'center',
    alignContent: 'center',
    padding: 10,
    borderRadius: 5,
  },
  image: {
    width: '100%',
    height: 100,
    justifyContent: 'center',
    borderRadius: 10,
  },
  detailsContainer: {
    flex: 1,
    padding: 10,
    justifyContent: 'space-between',
    marginLeft: 10,
  },
  detailsPlayBtn: {
    flex: 1,
    paddingVertical: 10,
    justifyContent: 'space-between',
  },
  lessonTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    paddingTop: 10,
    textAlign: 'center',
  },
  lessonDescription: {
    fontSize: 14,
    maxHeight: 40,
    height: 40,
  },
  playButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 8,
    borderRadius: 30,
    alignItems: 'center',
    marginLeft: 0,
  },
  playButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AllLectures;
