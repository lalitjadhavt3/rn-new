import React, {useContext, useEffect, useState, useRef} from 'react';
import api, {API_BASE_URL} from '../utils/api';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  useColorScheme,
  ActivityIndicator,
} from 'react-native';
import CourseModal from '../components/CourseModal';
import {AuthContext} from '../context/AuthContext';

const AllLectures = ({navigation, route}) => {
  const subjectScrollViewRef = useRef();
  const {subjectId, subjectName} = route.params;

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const [courseData, setCourseData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSubject, setSelectedSubjectId] = useState();
  const [subjectList, setSubjectList] = useState([]);

  const [loading, setLoading] = useState(true); // Added loading state
  const {user} = useContext(AuthContext);
  useEffect(() => {
    setSelectedSubjectId(subjectId);
  }, [subjectId]);
  useEffect(() => {
    const fetchSubjectList = async () => {
      try {
        const response = await api.get(
          '/student/apis/get_subject_details.php',
          {
            params: {
              userID: user?.userID,
            },
          },
        );
        setSubjectList(response?.data?.data);
      } catch (error) {
        // Handle the error
        console.error(error);
      } finally {
        setLoading(false); // Hide loader after data is fetched
      }
    };
    fetchSubjectList();
  }, []);

  const handleSubjectClick = subjectId => {
    setSelectedSubjectId(subjectId);
  };

  const deSelectSubjects = () => {
    setSelectedSubjectId(null);
  };

  useEffect(() => {
    const fetchCourseData = async selectedSubject => {
      try {
        setLoading(true);
        const response = await api.get('/student/apis/get_lesson_list.php', {
          params: {
            subjectId: selectedSubject != undefined ? selectedSubject : null,
            user: user?.userID,
            courseId: user?.courseSelected,
          },
        });
        setCourseData(response?.data?.data);
        setLoading(false);
      } catch (error) {
        // Handle the error
        console.error(error);
        setLoading(false);
      }
    };
    if (selectedSubject) {
      fetchCourseData(selectedSubject);
    } else {
      fetchCourseData();
    }
  }, [selectedSubject]);

  if (loading) {
    return (
      <View
        style={[styles.loaderContainer, isDarkMode && styles.darkBackground]}>
        <ActivityIndicator size="large" />
        <Text>Please Wait...</Text>
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <ScrollView horizontal contentContainerStyle={styles.subjectContainer}>
          <TouchableOpacity
            style={[
              styles.subjectButton,
              !selectedSubject && styles.selectedSubject,
            ]}
            onPress={() => deSelectSubjects()}>
            <Text style={styles.subjectButtonText}>All Videos</Text>
          </TouchableOpacity>
          {subjectList.map(subject => (
            <TouchableOpacity
              key={subject.subject_id}
              style={[
                styles.subjectButton,
                selectedSubject === subject.subject_id &&
                  styles.selectedSubject,
              ]}
              onPress={() => handleSubjectClick(subject.subject_id)}>
              <Text style={styles.subjectButtonText}>
                {subject.subject_name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <ScrollView style={styles.courseContainer}>
          {courseData
            ? courseData?.map((item, index) =>
                item.lecture_display ? (
                  <View key={index} style={styles.card}>
                    <View style={styles.imageContainer}>
                      <Image
                        source={{
                          uri: API_BASE_URL + 'admin/' + item.lesson_bg_image,
                        }}
                        style={styles.image}
                        resizeMode="cover"
                      />
                    </View>
                    <View style={styles.detailsContainer}>
                      <Text style={styles.lessonTitle}>
                        {item.lesson_title}
                      </Text>
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
                ) : null,
              )
            : subjectList?.map((subjects, index) =>
                subjects?.lessons?.map((lessons, index2) =>
                  lessons.lecture_display ? (
                    <View key={index2} style={styles.card}>
                      <View style={styles.imageContainer}>
                        <Image
                          source={{
                            uri:
                              API_BASE_URL + 'admin/' + lessons.lesson_bg_image,
                          }}
                          style={styles.image}
                          resizeMode="cover"
                        />
                      </View>
                      <View style={styles.detailsContainer}>
                        <Text style={styles.lessonTitle}>
                          {lessons.lesson_title}
                        </Text>
                        <Text style={styles.lessonDescription}> </Text>
                        <View style={styles.detailsPlayBtn}>
                          <TouchableOpacity
                            style={styles.playButton}
                            onPressIn={() => {
                              navigation.navigate('YoutubeVideo', {
                                joinLink: lessons?.lesson_link,
                                username: user?.username,
                              });
                            }}>
                            <Text style={styles.playButtonText}>Play</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  ) : null,
                ),
              )}
        </ScrollView>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  darkBackground: {
    backgroundColor: '#000',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subjectContainer: {
    paddingVertical: 2,
    marginTop: '10%',
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
    width: '110%',
  },
  subjectButton: {
    paddingHorizontal: 14,
    paddingBottom: 5,
    marginLeft: 10,
    marginVertical: 10,
    borderRadius: 15,
    justifyContent: 'center',
    backgroundColor: 'gray',
    height: 40,
  },
  selectedSubject: {
    backgroundColor: '#007BFF',
  },
  subjectButtonText: {
    fontSize: 15,
    color: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 'bold',
  },
  courseContainer: {},
  card: {
    margin: 5,
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
