import React, {useContext, useEffect, useState} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  ScrollView,
  useColorScheme,
  TouchableOpacity,
  Alert,
  Modal,
  ActivityIndicator,
} from 'react-native';
import {AuthContext} from '../context/AuthContext';
import api, {API_BASE_URL} from '../utils/api';
import DeviceInfo from 'react-native-device-info';
import Orientation from 'react-native-orientation-locker';
import {OneSignal} from 'react-native-onesignal';
const HomeScreen = ({navigation}) => {
  const [userData, setUserData] = useState([]);
  const [bannerImages, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [courseData, setCourseData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [loadingDeviceId, setLoadingDeviceId] = useState(true);
  const [displayDevice, setDisplayDevice] = useState(false);

  const alertPayment = () => {
    Alert.alert(
      'Payment Due',
      'Oops ! You have not paid the course fees yet. Kindly Click on Pay now button to Start your learning Journey!',
      [
        {
          text: 'I will Pay Later',
          onPress: () => null,
          style: 'cancel',
        },
        {
          text: 'PAY NOW',
          onPress: () => navigation.navigate('Payment'),
        },
      ],
      {cancelable: true},
    );
  };
  const alertPaidLecture = () => {
    Alert.alert(
      'Paid Lecture',
      'This Video is not free for view.Kindly Pay the course fees to continue',
      [
        {
          text: 'I Will browse free content',
          onPress: () => null,
          style: 'cancel',
        },
        {
          text: 'PAY NOW',
          onPress: () => navigation.navigate('Payment'),
        },
      ],
      {cancelable: true},
    );
  };
  const alertVideo = (link, lesson_type, lesson_title, course_name) => {
    Alert.alert(
      course_name,
      lesson_title,
      [
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'cancel',
        },
        {
          text: 'Join',
          onPress: () => {
            if (lesson_type == 'Offline') {
              navigation.navigate('OfflineLecture', {
                joinLink: link,
                username: user?.username,
              });
            } else if (lesson_type == 'Youtube') {
              navigation.navigate('YoutubeVideo', {
                joinLink: link,
                username: user?.username,
              });
            } else if (lesson_type == 'Online') {
              Alert.alert('Online Lectures will be start soon!');
            }
          },
        },
      ],
      {cancelable: true},
    );
  };
  const teacherData = [
    {
      image: require('../assets/teacher_img/1.jpg'),
      title: 'Miss Kartiki',
      edu: 'D.Ed, B.A, M.A(English)',
      sub: 'English[Std 5th to 10th]',
    },
    {
      image: require('../assets/teacher_img/2.jpg'),
      title: 'Akash Kanwale',
      edu: 'M.Sc, B.Ed ',
      sub: 'Science[Std 8th to 10th] [Marathi Medium]',
    },
    {
      image: require('../assets/teacher_img/3.jpg'),
      title: 'Dnyandeep Dhote',
      edu: 'M.Sc(Math), B.Ed',
      sub: 'Maths[Std 5th to 10th] [Marathi Medium]',
    },
    {
      image: require('../assets/teacher_img/4.jpg'),
      title: 'Mayuresh Sahastrabuddhe',
      edu: 'M.Sc(Maths)(Chemistry), B.Ed',
      sub: 'Maths[Std 8th to 10th] [English Medium]',
    },
    {
      image: require('../assets/teacher_img/5.jpg'),
      title: 'Mayur Tipare',
      edu: 'M.A(English), B.Ed',
      sub: 'English[Grammer]',
    },
    {
      image: require('../assets/teacher_img/6.jpg'),
      title: 'Swati Dhamankar',
      edu: 'M.Sc(Chemistry)',
      sub: 'Science[Std 8th to 10th] [English Medium]',
    },
    // Add more slides as needed
  ];
  const {user, signIn, deviceId} = useContext(AuthContext);
  const colorScheme = useColorScheme();

  useEffect(() => {
    Orientation.lockToPortrait();

    const getUserDetails = async () => {
      try {
        const osDeviceId =
          OneSignal.User.pushSubscription.getPushSubscriptionId();
        console.log(osDeviceId);
        const response = await api.get('/student/apis/get_stud_info.php', {
          params: {
            user: user?.userData?.auth_id
              ? user?.userData?.auth_id
              : user?.userID,
            osDeviceId: osDeviceId,
          },
        });

        setUserData(response?.data?.data[0]);
        //console.log(response?.data);
        const data = {
          ...user,
          userID: response?.data?.data[0]?.id,
          userData: response?.data?.data[0],
        };

        signIn(data);
      } catch (error) {
        // Handle the error
        console.error(error);
      }
    };
    const getBanners = async () => {
      try {
        const response = await api.get('/student/apis/get_banners.php', {});

        setBanners(response?.data?.data);
      } catch (error) {
        // Handle the error
        console.error(error);
      }
    };
    if (user?.userID) {
      getUserDetails();
      //checkDeviceIds();
      getBanners();
    } else {
      console.log('userdata not found', user);
    }
  }, []);
  const checkDeviceIds = () => {
    console.log(deviceId);
    //console.log(user?.userData?.device_id);
    // if (user?.userData?.device_id != deviceId) {
    //   Alert.alert(
    //     'Your Number is Already signed in another device. ',
    //     'Click OK to Login Again',
    //     [
    //       {
    //         text: 'Cancel',
    //         onPress: () => navigation.navigate('Login'),
    //         style: 'cancel',
    //       },
    //       {
    //         text: 'OK',
    //         onPress: () => navigation.navigate('Login'),
    //       },
    //     ],
    //     {cancelable: false},
    //   );
    // }
  };
  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const response = await api.get(
          '/student/apis/get_subject_details.php',
          {
            params: {
              course_selected: user?.courseSelected,
              userID: user?.userID,
            },
          },
        );
        setCourseData(response?.data?.data);
      } catch (error) {
        // Handle the error
        console.error(error);
      } finally {
        setLoading(false); // Hide loader after data is fetched
      }
    };
    if (userData?.courses?.length > 0) {
      fetchCourseData();
    }
  }, [userData?.courses]);
  const btnMoreLectures = subject_id => {
    user?.userData?.payment_status != 'success'
      ? navigation.navigate('Payment')
      : navigation.navigate('AllLectures', {
          subjectId: subject_id,
        });
  };

  const isDarkMode = colorScheme === 'dark';

  if (loading) {
    return (
      <View
        style={[styles.loaderContainer, isDarkMode && styles.darkBackground]}>
        <ActivityIndicator size="large" />
        <Text>Loading Data...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.home, isDarkMode && styles.darkBackground]}>
      <View style={[styles.frameParent, styles.frameParentFlexBox]}>
        <View style={styles.avatarsDefaultWithBackdropParent}>
          <Image
            style={styles.avatarsDefaultWithBackdrop}
            resizeMode="cover"
            source={require('../assets/avatars-default-with-backdrop.png')}
          />
          <Text
            style={[
              styles.halloFahmiHaecal,
              styles.textTypo,
              isDarkMode && styles.darkText,
            ]}>
            Hello {userData.fname}
          </Text>
        </View>
        <View style={[styles.iconlyWrapper, styles.iconlyFlexBox]}>
          <TouchableOpacity
            onPress={() => {
              Alert.alert('Feature coming soon');
            }}>
            <Image
              style={[styles.iconly, styles.iconlyLayout]}
              resizeMode="cover"
              source={require('../assets/iconly.png')}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView horizontal style={styles.scrollBanner}>
        <View style={styles.coursesContainer}>
          {user?.userData?.payment_status == 'success' &&
            bannerImages.map((item, index) => {
              return (
                <View key={index} style={{flex: 1}}>
                  <Image
                    style={{
                      width: 300,
                      height: 200,
                      borderColor: 'grey',
                      margin: 10,
                      borderRadius: 10,
                    }}
                    source={{
                      uri: API_BASE_URL + 'admin/' + item.image,
                    }}
                  />
                </View>
              );
            })}
        </View>
      </ScrollView>
      <Text
        style={[
          styles.findACourse,
          styles.all1Clr,
          isDarkMode && styles.darkText,
        ]}>
        Content for You
      </Text>
      {courseData.map(subject => (
        <View key={subject.subject_id}>
          <View style={styles.frameContainer}>
            <View style={styles.learnflexWrapper}>
              <Text
                style={[
                  styles.learnflex,
                  styles.timeTypo,
                  isDarkMode && styles.darkText,
                ]}>
                {subject.subject_name}
              </Text>
            </View>
          </View>

          <ScrollView horizontal style={styles.scrollView}>
            <View style={styles.coursesContainer}>
              {subject.lessons.slice(0, 5).map(lesson =>
                lesson.lecture_display ? (
                  <TouchableOpacity
                    style={styles.courseCard}
                    key={lesson.lesson_id}
                    onPress={() => {
                      user?.userData?.payment_status == 'success'
                        ? alertVideo(
                            lesson?.lesson_link,
                            lesson?.lesson_type,
                            lesson?.lesson_title,
                            lesson?.course_name,
                          )
                        : user?.userData?.payment_status != 'success' &&
                          lesson?.lecture_fee_type == 'free'
                        ? alertVideo(
                            lesson?.lesson_link,
                            lesson?.lesson_type,
                            lesson?.lesson_title,
                            lesson?.course_name,
                          )
                        : user?.userData?.payment_status != 'success' &&
                          lesson?.lecture_fee_type == 'paid' &&
                          alertPaidLecture();
                    }}>
                    {user?.userData?.payment_status != 'success' &&
                      lesson.lecture_fee_type == 'free' && (
                        <View style={styles.freeTag}>
                          <Text style={{color: '#fff'}}>Free</Text>
                        </View>
                      )}
                    <Image
                      style={styles.courseImage}
                      resizeMode="cover"
                      source={{
                        uri: API_BASE_URL + 'admin/' + lesson.lesson_bg_image,
                      }}
                    />
                    <Text
                      style={[
                        styles.courseTitle,
                        isDarkMode && styles.darkText2,
                      ]}>
                      {lesson.lesson_title}
                    </Text>
                  </TouchableOpacity>
                ) : null,
              )}
            </View>

            {subject.lessons.length > 4 &&
              user?.userData?.payment_status == 'success' && ( // Check if there are more than 5 lessons
                <TouchableOpacity
                  style={styles.seeMoreBtn}
                  onPressIn={() => {
                    navigation.navigate('AllLectures', {
                      subjectId: subject?.subject_id,
                    });
                  }}>
                  {user?.userData?.payment_status == 'success' && (
                    <View style={styles.learnflexWrapper}>
                      <Text
                        style={[
                          styles.learnflex,
                          styles.seeMoreText,
                          isDarkMode && styles.darkText,
                        ]}>
                        See More
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              )}
          </ScrollView>
        </View>
      ))}
      {/* {courseData.map(subject => (
        <View key={subject.subject_id}>
          <View style={styles.frameContainer}>
            <View style={styles.learnflexWrapper}>
              <Text
                style={[
                  styles.learnflex,
                  styles.timeTypo,
                  isDarkMode && styles.darkText,
                ]}>
                {subject.subject_name}
              </Text>
            </View>
          </View>

          <ScrollView horizontal style={styles.scrollView}>
            <View style={styles.coursesContainer}>
              {subject.lessons.map(lesson => (
                <TouchableOpacity
                  style={styles.courseCard}
                  key={lesson.lesson_id}
                  onPress={() => {
                    user?.userData?.payment_status == 'success'
                      ? alertVideo(
                          lesson?.lesson_link,
                          lesson?.lesson_type,
                          lesson?.lesson_title,
                          lesson?.course_name,
                        )
                      : user?.userData?.payment_status != 'success' &&
                        lesson?.lecture_fee_type == 'free'
                      ? alertVideo(
                          lesson?.lesson_link,
                          lesson?.lesson_type,
                          lesson?.lesson_title,
                          lesson?.course_name,
                        )
                      : user?.userData?.payment_status != 'success' &&
                        lesson?.lecture_fee_type == 'paid' &&
                        alertPaidLecture();
                  }}>
                  {user?.userData?.payment_status != 'success' &&
                    lesson.lecture_fee_type == 'free' && (
                      <View style={styles.freeTag}>
                        <Text style={{color: '#fff'}}>Free</Text>
                      </View>
                    )}
                  <Image
                    style={styles.courseImage}
                    resizeMode="cover"
                    source={{
                      uri: API_BASE_URL + 'admin/' + lesson.lesson_bg_image,
                    }}
                  />
                  <Text
                    style={[
                      styles.courseTitle,
                      isDarkMode && styles.darkText2,
                    ]}>
                    {lesson.lesson_title}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.seeMoreBtn}
              onPressIn={() => {
                navigation.navigate('AllLectures', {
                  subjectName: subject?.subject_name,
                  subjectId: subject?.subject_id,
                });
              }}>
              {user?.userData?.payment_status == 'success' && (
                <View style={styles.learnflexWrapper}>
                  <Text
                    style={[
                      styles.learnflex,
                      styles.seeMoreText,
                      isDarkMode && styles.darkText,
                    ]}>
                    See More
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </ScrollView>
        </View>
      ))} */}
      <TouchableOpacity
        style={styles.frameContainer}
        onPress={() => {
          user?.userData?.payment_status != 'success'
            ? navigation.navigate('Payment')
            : navigation.navigate('AllLectures', {
                subjectId: null,
              });
        }}>
        <View style={styles.learnflexWrapper}>
          <Text
            style={[
              styles.learnflex,
              styles.moreLectures,
              isDarkMode && styles.darkText,
            ]}>
            More Lectures
          </Text>
        </View>
      </TouchableOpacity>
      <View style={styles.frameContainer}>
        <View style={styles.learnflexWrapper}>
          <Text
            style={[
              styles.learnflex,
              styles.timeTypo,
              isDarkMode && styles.darkText,
            ]}>
            Teaching Staff
          </Text>
        </View>
      </View>

      <ScrollView horizontal style={styles.scrollView}>
        <View style={styles.staffContainer}>
          <Modal
            visible={modalVisible}
            animationType="fade"
            transparent={true}
            onRequestClose={() => setModalVisible(false)}>
            <View
              style={[
                styles.modalContainer1,
                isDarkMode && styles.modalContainerdark,
              ]}>
              {selectedStaff && (
                <View style={styles.modalContainer}>
                  <Image
                    style={styles.modalStaffImage}
                    resizeMode="cover"
                    source={selectedStaff.image}
                  />
                  <Text style={styles.modalStaffTitle}>
                    {selectedStaff.title}
                  </Text>
                  <Text style={styles.modalStaffEdu}>{selectedStaff.edu}</Text>
                  <Text style={styles.modalStaffsub}>{selectedStaff.sub}</Text>
                </View>
              )}
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </Modal>

          {teacherData.map((item, index) => (
            <View style={styles.staffCard} key={index}>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(true);
                  setSelectedStaff(item);
                }}>
                <Image
                  style={styles.staffImage}
                  resizeMode="cover"
                  source={item.image}
                />
                <Text
                  style={[styles.staffTitle, isDarkMode && styles.darkText2]}>
                  {item.title}
                </Text>
                <Text style={[styles.staffedu, isDarkMode && styles.darkText2]}>
                  {item.edu}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  home: {
    flex: 1,
    backgroundColor: '#fff',
  },
  darkBackground: {
    backgroundColor: '#000',
  },
  frameParentFlexBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 45,
  },
  avatarsDefaultWithBackdropParent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarsDefaultWithBackdrop: {
    width: 40,
    height: 40,
  },
  halloFahmiHaecal: {
    marginLeft: 12,
    fontSize: 14,
    fontWeight: '600',
  },
  iconlyWrapper: {
    padding: 3,
    borderRadius: 20,
    backgroundColor: '#fff',
  },
  iconly: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  findACourse: {
    marginTop: '2%',
    fontSize: 24,
    fontWeight: '700',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  frameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  seeMoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 5,
    marginBottom: 10,
    marginEnd: 30,
    color: 'red',
  },
  seeMoreText: {
    color: 'tomato',
  },
  learnflexWrapper: {
    flex: 1,
  },
  learnflex: {
    fontSize: 18,
    fontWeight: '600',
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4F4F4F',
  },
  frameView: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  frameParentShadowBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    padding: 16,
  },
  image19Wrapper: {
    width: 64,
    height: 64,
    borderRadius: 8,
    backgroundColor: '#F4F4F4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image19Icon: {
    width: 32,
    height: 32,
  },
  frontEndHtmlCssParent: {
    marginTop: 12,
  },
  frontEndHtml: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  frameParent2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconlyFlexBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconly2: {
    width: 16,
    height: 16,
    marginRight: 4,
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
    color: '#828282',
  },
  text1: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
  },
  scrollView: {
    paddingHorizontal: 10,
    marginBottom: 16,
    marginHorizontal: 10,
    paddingRight: 50,
  },
  scrollBanner: {
    paddingHorizontal: 10,
    marginBottom: 16,
    marginHorizontal: 10,
    paddingRight: 50,
    marginTop: '10%',
  },
  coursesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  courseCard: {
    marginRight: 12,
    width: 120,
    height: 160,
    borderRadius: 12,
    backgroundColor: '#F4F4F4',
    padding: 12,
  },
  freeTag: {
    position: 'absolute',
    top: '2%',
    right: 0,
    zIndex: 1,
    width: '50%',
    height: 20,
    left: '70%',
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  courseImage: {
    width: '100%',
    height: 100,
    borderRadius: 8,
  },
  courseTitle: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  moreLectures: {
    fontSize: 14,
    textAlign: 'right',
    color: 'skyblue',
  },
  darkText: {
    color: '#fff',
  },
  darkText2: {
    color: '#000',
  },
  staffContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 40,
  },
  staffCard: {
    marginRight: 16,
    width: 180,
    height: 200,
    borderRadius: 16,
    backgroundColor: '#F4F4F4',
    padding: 12,
  },
  staffImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
  },
  staffTitle: {
    marginTop: 8,
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '900',
  },
  staffedu: {
    fontSize: 10,
    fontWeight: '400',
    textAlign: 'center',
  },
  modalContainer1: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  modalContainerdark: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
  },
  closeButton: {
    backgroundColor: '#007FFF',
    width: '50%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    marginTop: 80,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  modalStaffImage: {
    width: 400,
    height: 400,
    borderBottomWidth: 70,
    alignItems: 'center',
    borderBottomRightRadius: 40,
    borderBottomLeftRadius: 40,
  },
  modalStaffTitle: {
    fontSize: 30,
    textAlign: 'center',
    fontWeight: '900',
    marginTop: 18,
  },
  modalStaffEdu: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 8,
    textAlign: 'center',
    marginTop: 2,
  },
  modalStaffsub: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: '2%',
    textAlign: 'center',
  },

  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;
