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
  Image,
  Button,
  Platform,
  ScrollView,
  RefreshControl,
  AsyncStorage,
} from 'react-native';
import {Images} from 'app-assets';
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
import {getStatusBarHeight} from 'app-common';
import api from '../utils/api';
import axios from 'axios';
const leftArrowIcon = require('../assets/img/previous.png');
const rightArrowIcon = require('../assets/img/next.png');
const ITEMS = agendaItems;
const weekView = true;
const TimeTable = ({t, navigation, props}) => {
  const {user} = useContext(AuthContext);
  const [isLogin, setLogin] = useState(user);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshCount, setRefreshCount] = useState(0);

  const fetchData = async () => {
    // Replace this URL with your API endpoint
    const url = 'https://jsonplaceholder.typicode.com/todos/1';

    try {
      const response = await axios.get(url);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const onRefresh = useCallback(() => {
    console.log(refreshCount);
    setRefreshing(true);
    fetchData().then(() => {
      setRefreshing(false);
      setRefreshCount(refreshCount + 1);
    });
  }, [refreshCount]);
  const onDateChanged = async d => {
    console.log({currentDate: d});
    try {
      const response = await api.get(
        '/student/apis/get_schedule.php?date=' + d,
        {
          params: {
            date: d,
          },
        },
      );
      console.log(response);
    } catch (error) {
      // Handle the error
      console.error(error);
    }
  };

  const mock =
    refreshCount < 100
      ? [
          {
            data: [
              {
                duration: '0.5h',
                hour: '11am',
                title: 'Offline Lecture',
                link: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
                username: user,
                type: 'offline',
              },
            ],
            title: '2023-05-22',
          },
          {
            data: [
              {
                duration: '1h',
                hour: '12pm',
                title: 'Offline Lecture-2',
                link: 'http://techslides.com/demos/sample-videos/small.mp4',
                username: user,
                type: 'offline',
              },
            ],
            title: '2023-05-25',
          },
          {
            data: [
              {
                duration: '1h',
                hour: '12pm',
                title: 'First Yoga',
                link: '1234-1234',
                username: user,
                type: 'online',
              },
            ],
            title: '2023-05-22',
          },
        ]
      : [
          {
            data: [
              {
                duration: '1h',
                hour: '11am',
                title: 'Offline Lecture before refresh',
                link: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
                username: user,
                type: 'offline',
              },
            ],
            title: '2023-05-24',
          },
        ];
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
        {isLogin ? (
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
              // todayBottomMargin={16}
            >
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
                sections={mock}
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
        )}
      </View>
    </ScrollView>
  );
};

export default TimeTable;

const styles = StyleSheet.create({
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
