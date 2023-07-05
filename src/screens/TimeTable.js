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
  ActivityIndicator,
  useColorScheme,
  BackHandler,
  FlatList,
  TextInput,
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
import DateTimePicker from '@react-native-community/datetimepicker';

const leftArrowIcon = require('../assets/img/banner-home.png');
const rightArrowIcon = require('../assets/img//banner-home.png');
const ITEMS = agendaItems;
const weekView = true;
const TimeTable = ({t, navigation, props}) => {
  const colorScheme = useColorScheme();
  const styles = colorScheme === 'dark' ? darkStyles : lightStyles;
  const {user, signIn} = useContext(AuthContext);
  const [isLogin, setLogin] = useState(user);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshCount, setRefreshCount] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true); // Added loading state
  const [lessonList, setLessonList] = useState([]);
  const [showPicker, setShowPicker] = useState(false);
  const [chosenDate, setChosenDate] = useState(new Date(Date.now()));
  const extracted = new Date(Date.now());
  const mon = extracted.getMonth() + '-' + extracted.getFullYear();

  useEffect(() => {
    if (
      !user?.courseSelected ||
      user?.courseSelected === undefined ||
      user?.courseSelected === ''
    ) {
      //console.log(user.courseSelected);
      setModalVisible(true);
    } else {
      onDateChanged(extracted);
    }
  }, []);
  useEffect(() => {
    onDateChanged(extracted);
  }, [user?.courseSelected]);
  const showDatePicker = () => {
    setShowPicker(true);
  };

  const hideDatePicker = () => {
    setShowPicker(false);
  };
  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || chosenDate;
    setChosenDate(currentDate);
    onDateChanged(selectedDate);
    hideDatePicker();
  };
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
    setChosenDate(new Date(d));
    timeoutId = setTimeout(async () => {
      try {
        setLoading(true);
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
      } finally {
        setLoading(false); // Hide loader after data is fetched
      }
    }, 1000); // Specify the debounce delay (in milliseconds)
  };

  const marked = useRef(getMarkedDates());
  const theme = useRef(getTheme());
  const todayBtnTheme = useRef({
    todayButtonTextColor: themeColor,
  });

  const renderItems = useCallback(({item, index}) => {
    return (
      <AgendaItem
        item={item}
        index={index}
        navigationLink={item.link}
        navigationTest={navigation}
        usernameAuth={user}
      />
    );
  }, []);

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator
            size="large"
            color={colorScheme == 'dark' ? 'white' : 'black'}
            style={{justifyContent: 'center', alignItems: 'center'}}
          />
        </View>
      ) : lessonList?.length > 0 ? (
        <View>
          <FlatList
            contentContainerStyle={{
              flex: 1,
              backgroundColor: colorScheme != 'dark' ? '#FFFFFF' : '#000',
              alignItems: 'center',
              flexGrow: 2,
            }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            data={lessonList ? lessonList : null}
            renderItem={({item}) => (
              <View style={styles.container}>
                {user?.courseSelected ? (
                  user?.userID &&
                  user?.userData?.payment_status == 'success' ? (
                    <>
                      <View style={styles.header}>
                        <View style={styles.header1}>
                          <Text style={styles.title}>Time Table</Text>
                        </View>
                      </View>
                      {lessonList?.length > 0 ? (
                        <CalendarProvider
                          date={ITEMS[1]?.title}
                          onDateChanged={onDateChanged}
                          showTodayButton
                          disablePan={true} //we need this
                          disableWeekScroll={true}
                          theme={todayBtnTheme.current}
                          todayBottomMargin={16}>
                          {weekView ? (
                            <WeekCalendar
                              firstDay={1}
                              markedDates={marked.current}
                            />
                          ) : (
                            <ExpandableCalendar
                              theme={theme.current}
                              firstDay={1}
                              markedDates={marked.current}
                              leftArrowImageSource={leftArrowIcon}
                              rightArrowImageSource={rightArrowIcon}
                              animateScroll
                            />
                          )}
                          {lessonList && (
                            <AgendaList
                              sections={lessonList}
                              renderItem={renderItems}
                              sectionStyle={styles.section}
                            />
                          )}
                        </CalendarProvider>
                      ) : (
                        <View style={styles.container2}>
                          <Text>Oops!</Text>
                          <Text>
                            There are no lectures or schedules assigned right
                            now! Choose Another date to display Timetable
                          </Text>
                          <TouchableOpacity
                            onPress={showDatePicker}
                            style={styles.inputFieldContainer}>
                            <Text
                              style={{
                                color:
                                  colorScheme == 'dark' ? 'white' : 'black',
                              }}>
                              {typeof chosenDate == 'object'
                                ? chosenDate.toDateString()
                                : chosenDate}
                            </Text>
                          </TouchableOpacity>
                          {showPicker && (
                            <DateTimePicker
                              value={chosenDate}
                              mode="date"
                              display="default"
                              onChange={handleDateChange}
                              minimumDate={new Date(1900, 0, 1)} // Optional minimum date
                              maximumDate={new Date()} // Optional maximum date
                            />
                          )}
                        </View>
                      )}
                    </>
                  ) : user?.userID &&
                    (user?.userData?.payment_status == undefined ||
                      user?.userData?.payment_status == 'pending') ? (
                    <View style={styles.container2}>
                      <Text>Hello There!</Text>
                      <Text>
                        Seems you have selected the course but not paid the FEE
                      </Text>
                      <Text>
                        Kindly click on 'PAY NOW' button to start your learning
                        journey!
                      </Text>
                      <TouchableOpacity
                        style={styles.button}
                        onPress={() => {
                          navigation.navigate('Payment');
                        }}>
                        <Text style={styles.buttonText}>PAY NOW</Text>
                      </TouchableOpacity>
                    </View>
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
            )}
          />
        </View>
      ) : (
        <View style={styles.container2}>
          <Text>Oops!</Text>
          <Text>
            There are no lectures or schedules assigned right now! Choose
            Another date to display Timetable
          </Text>
          <TouchableOpacity
            onPress={showDatePicker}
            style={styles.inputFieldContainer}>
            <Text
              style={{
                color: colorScheme == 'dark' ? 'white' : 'black',
              }}>
              {typeof chosenDate == 'object'
                ? chosenDate.toDateString()
                : chosenDate}
            </Text>
          </TouchableOpacity>
          {showPicker && (
            <DateTimePicker
              value={chosenDate}
              mode="date"
              display="default"
              onChange={handleDateChange}
              minimumDate={new Date(1900, 0, 1)} // Optional minimum date
              maximumDate={new Date()} // Optional maximum date
            />
          )}
        </View>
      )}
      <CourseModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />
    </View>
  );
};

export default TimeTable;

const lightStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
  header: {
    paddingTop: Platform.OS === 'ios' ? 10 : 0,
    marginTop: 10,
    paddingHorizontal: 16,
  },
  header1: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontFamily: 'Poppins-Medium',
    fontWeight: '500',
    fontSize: 24,
    lineHeight: 36,
    flex: 1,
    textAlign: 'center',
    color: '#000000',
  },
  container2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  section: {
    backgroundColor: lightThemeColor,
    color: 'grey',
    textTransform: 'capitalize',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputFieldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 40,
    borderColor: '#969696',
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 10,
    paddingHorizontal: 10,
  },
  buttonText: {
    color: 'white',
  },
});

const darkStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  inputFieldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 40,
    borderColor: '#969696',
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 10,
    paddingHorizontal: 10,
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
  header: {
    paddingTop: Platform.OS === 'ios' ? 10 : 0,
    marginTop: 10,
    paddingHorizontal: 16,
  },
  header1: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontFamily: 'Poppins-Medium',
    fontWeight: '500',
    fontSize: 24,
    lineHeight: 36,
    flex: 1,
    textAlign: 'center',
    color: '#FFFFFF',
  },
  container2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#000000',
  },
  section: {
    backgroundColor: '#1C1C1E',
    color: 'grey',
    textTransform: 'capitalize',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
  },
});
