import React, {
  useRef,
  useCallback,
  useState,
  useEffect,
  useContext,
} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Button,
  Platform,
  ScrollView,
  RefreshControl,
} from 'react-native';
import {AuthContext} from '../context/AuthContext';
import {
  ExpandableCalendar,
  AgendaList,
  CalendarProvider,
  WeekCalendar,
} from 'react-native-calendars';
import {agendaItems, getMarkedDates} from './mocks/agendaItems';
import AgendaItem from './mocks/AgendaItem';
import {getTheme, themeColor, lightThemeColor} from './mocks/theme';
import api from '../utils/api';
import CourseModal from '../components/CourseModal';
const leftArrowIcon = require('../assets/img/previous.png');
const rightArrowIcon = require('../assets/img/next.png');
const ITEMS = agendaItems;
const weekView = true;
const TimeTable = ({t, navigation, props}) => {
  const {user, signIn} = useContext(AuthContext);
  const [isLogin, setLogin] = useState(user);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshCount, setRefreshCount] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [lessonList, setLessonList] = useState([]);

  useEffect(() => {
    const extracted = new Date(Date.now());
    const mon = extracted.getMonth() + '-' + extracted.getFullYear();
    onDateChanged(extracted);
  }, []);

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  useEffect(() => {
    toggleModal();
  }, [user.courseSelected]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    const extracted = new Date(Date.now());
    const mon = extracted.getMonth() + '-' + extracted.getFullYear();
    onDateChanged(extracted);
    setRefreshCount(refreshCount + 1);
    setRefreshing(false);
  }, [refreshCount]);

  let timeoutId;

  const onDateChanged = d => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(async () => {
      try {
        const response = await api.get('/student/apis/get_schedule.php', {
          params: {
            date: d,
            user: user.userID,
            course: user.courseSelected,
          },
        });
        setLessonList(response?.data?.data);
      } catch (error) {
        // Handle the error
        console.error(error);
      }
    }, 1000); // Specify the debounce delay (in milliseconds)
  };

  const marked = useRef(getMarkedDates());
  const theme = useRef(getTheme());
  const todayBtnTheme = useRef({
    todayButtonTextColor: themeColor,
  });

  const renderItem = useCallback(({item, index}) => {
    return (
      <AgendaItem
        item={item}
        navigationLink={item.link}
        navigationTest={navigation}
        usernameAuth={user}
      />
    );
  }, []);

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      <View style={styles.container}>
        {user?.courseSelected ? (
          isLogin ? (
            <>
              <View style={styles.header}>
                <View style={styles.header1}>
                  <Text style={styles.title}>TimeTable</Text>
                </View>
              </View>
              <CalendarProvider
                date={ITEMS[1]?.title}
                onDateChanged={onDateChanged}
                // onMonthChange={onMonthChange}
                showTodayButton
                // disabledOpacity={0.6}
                theme={todayBtnTheme.current}
                todayBottomMargin={16}>
                {weekView ? (
                  <WeekCalendar firstDay={1} markedDates={marked.current} />
                ) : (
                  <ExpandableCalendar
                    theme={theme.current}
                    firstDay={1}
                    markedDates={marked.current}
                    leftArrowImageSource={leftArrowIcon}
                    rightArrowImageSource={rightArrowIcon}
                    animateScroll
                    // closeOnDayPress={false}
                  />
                )}
                <AgendaList
                  sections={lessonList}
                  renderItem={renderItem}
                  // scrollToNextEvent
                  sectionStyle={styles.section}
                  // dayFormat={'yyyy-MM-d'}
                />
              </CalendarProvider>
            </>
          ) : (
            <View style={styles.container2}>
              <Text>Welcome, Guests!</Text>
              <Text>Please Login to View Content!</Text>
              <Button
                title="Login"
                onPress={() => {
                  navigation.navigate('Login');
                }}
              />
            </View>
          )
        ) : (
          <CourseModal
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
          />
        )}
      </View>
    </ScrollView>
  );
};

export default TimeTable;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  courseOption: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  courseOptionText: {
    fontSize: 16,
  },
  selectedCourseText: {
    fontSize: 16,
    marginTop: 20,
  },
  calendar: {
    paddingLeft: 20,
    paddingRight: 20,
  },
  container: {
    backgroundColor: '#fff',
    flex: 1,
    zIndex: 1,
    paddingTop: Platform.OS !== 'ios' ? 10 : 0,
  },

  section: {
    backgroundColor: lightThemeColor,
    color: 'grey',
    textTransform: 'capitalize',
  },
  title: {
    fontFamily: 'Poppins-Medium',
    fontWeight: '500',
    fontSize: 24,
    lineHeight: 36,
    flex: 1,
    textAlign: 'center',
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 10 : 0,
    marginTop: 20,
    paddingHorizontal: 16,
  },
  container2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  header1: {
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'space-between',
  },
});
