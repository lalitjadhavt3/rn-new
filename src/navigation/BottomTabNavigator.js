import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import {Person, Calendar} from '../assets/icons';
import TimeTable from '../screens/TimeTable';
import OfflineLecture from '../screens/OfflineLecture';
import Register from '../screens/RegisterScreen';
import ModalScreen from '../screens/ModalScreen';
const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="TimeTable"
        component={TimeTable}
        options={{
          title: 'Time Table',
          initialParams: {joinLink: 'test'},
          tabBarLabel: 'Time Table',
          unmountOnBlur: true,
          tabBarIcon: ({color, size}) => (
            <Calendar width={20} height={20} fill={color} />
          ),
          tabBarVisible: false,
          tabBarBadgeStyle: {
            backgroundColor: 'red',
            color: 'white',
          },
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Account"
        component={ProfileScreen}
        initialParams={{itemId: 1}}
        options={{
          title: 'Account',
          tabBarLabel: 'Account',
          unmountOnBlur: true,
          tabBarIcon: ({color, size}) => (
            <Person width={20} height={20} fill={color} />
          ),

          tabBarBadgeStyle: {
            backgroundColor: 'red',
            color: 'white',
          },
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="RegisterScreen"
        component={Register}
        options={{
          headerShown: false,
          tabBarStyle: {
            display: 'none',
          },
          tabBarButton: () => null,
        }}
      />

      {/* 
    <Tab.Screen
     name='Join_Screen'
     component={Join}
     options={{
      tabBarStyle: {
       display: 'none',
      },
      tabBarButton: () => null,
     }}
    /> 
      {<Tab.Screen
     name='TestScreen'
     component={TestScreen}
     options={{
      tabBarStyle: {
       display: 'none',
      },
      tabBarButton: () => null,
     }}
    /> */}
      <Tab.Screen
        name="OfflineLecture"
        component={OfflineLecture}
        options={{
          headerShown: false,
          tabBarStyle: {
            display: 'none',
          },
          tabBarButton: () => null,
        }}
      />

      {/* <Tab.Screen
     name={SCREEN_NAMES.Meeting}
     component={Meeting}
     options={() => ({
      headerShown: false,
      tabBarStyle: {
       display: 'none',
      },
      tabBarButton: () => null,
     })}
    /> */}
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
