import React, {useContext, useEffect, useState} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  ScrollView,
  useColorScheme,
} from 'react-native';
import {AuthContext} from '../context/AuthContext';
import Swiper from 'react-native-swiper';
import api from '../utils/api';

const HomeScreen = ({navigation}) => {
  const [userData, setUserData] = useState([]);
  const data = [
    {image: require('../assets/image-17.png'), title: 'Slide 1'},
    {image: require('../assets/image-18.png'), title: 'Slide 2'},
    {image: require('../assets/image-19.png'), title: 'Slide 3'},
    // Add more slides as needed
  ];
  const {user} = useContext(AuthContext);
  const colorScheme = useColorScheme();

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const response = await api.get('/student/apis/get_stud_info.php', {
          params: {
            user: user.userID,
          },
        });
        setUserData(response?.data?.data[0]);
      } catch (error) {
        // Handle the error
        console.error(error);
      }
    };

    if (!user) {
      navigation.navigate('Login');
    } else if (user?.userID) {
      getUserDetails();
    }
  }, [user]);

  const isDarkMode = colorScheme === 'dark';

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
          <Image
            style={[styles.iconly, styles.iconlyLayout]}
            resizeMode="cover"
            source={require('../assets/iconly.png')}
          />
        </View>
      </View>

      <Text
        style={[
          styles.findACourse,
          styles.all1Clr,
          isDarkMode && styles.darkText,
        ]}>
        Find a course you want to learn.
      </Text>

      <View style={styles.frameContainer}>
        <View style={styles.learnflexWrapper}>
          <Text
            style={[
              styles.learnflex,
              styles.timeTypo,
              isDarkMode && styles.darkText,
            ]}>
            Courses
          </Text>
        </View>
      </View>

      <ScrollView horizontal style={styles.scrollView}>
        <View style={styles.coursesContainer}>
          {data.map((item, index) => (
            <View style={styles.courseCard} key={index}>
              <Image
                style={styles.courseImage}
                resizeMode="cover"
                source={item.image}
              />
              <Text
                style={[styles.courseTitle, isDarkMode && styles.darkText2]}>
                {item.title}
              </Text>
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
    marginTop: 47,
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
    paddingHorizontal: 20,
    marginBottom: 16,
    marginHorizontal: 20,
    paddingRight: 150,
  },
  coursesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 40,
  },
  courseCard: {
    marginRight: 12,
    width: 120,
    height: 160,
    borderRadius: 12,
    backgroundColor: '#F4F4F4',
    padding: 12,
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
  darkText: {
    color: '#fff',
  },
  darkText2: {
    color: '#000',
  },
});

export default HomeScreen;
