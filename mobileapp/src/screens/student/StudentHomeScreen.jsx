import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { Appbar, Avatar, BottomNavigation } from 'react-native-paper';
import axios from '../../api/axios';
import moment from 'moment';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StudentCalendar from '../../components/student/StudentCalendar';
import StudentClass from '../../components/student/StudentClass';
import StudentReport from '../../components/student/StudentReport';

const StudentHomeScreen = () => {
  const [index, setIndex] = useState(0);
  const [userId, setUserId] = useState(null);
  const [routes] = useState([
    { key: 'calendar', title: 'Home', icon: 'calendar' },
    { key: 'class', title: 'Class', icon: 'book' },
    { key: 'report', title: 'Report', icon: 'message' },
  ]);

  const [markedDates, setMarkedDates] = useState({});
  const [username, setUsername] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [selectedDate, setSelectedDate] = useState(
    moment().format('YYYY-MM-DD')
  );
  const [eventsForSelectedDate, setEventsForSelectedDate] = useState([]);
  const [appBarTitle, setAppBarTitle] = useState(routes[0].title);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    const userJson = await AsyncStorage.getItem('user');
    const user = JSON.parse(userJson);
    const userId = user.user_id;
    setUserId(userId);
    setUsername(user.username);
    setAvatarUrl(user.avatar_url);
    try {
      const response = await axios.get(`/studentClass/getClass/${userId}`);
      const clsData = response.data;
      console.log(clsData);
      let markedDatesObject = {};
      clsData.forEach((cls) => {
        const eventDates = generateEventDates(cls);
        markedDatesObject = { ...markedDatesObject, ...eventDates };
      });
      setMarkedDates(markedDatesObject);
      setEventsForSelectedDate(markedDatesObject[selectedDate]?.dots || []);
    } catch (error) {
      console.error('Failed to fetch classes:', error);
    }
  };

  const generateEventDates = (cls) => {
    let localMarkedDates = {};
    let startDate = moment(cls.date_start);
    let endDate = moment(cls.date_finish);
    let current = startDate.clone().day(cls.day_of_week % 7);
  
    if (current.isBefore(startDate, 'day')) {
      current.add(1, 'weeks');
    }
  
    while (current.isSameOrBefore(endDate)) {
      const eventDateStr = current.format('YYYY-MM-DD');
      if (!localMarkedDates[eventDateStr]) {
        localMarkedDates[eventDateStr] = { dots: [] };
      }
      localMarkedDates[eventDateStr].dots.push({
        key: cls.class_id,
        color: 'red',
        selectedDotColor: 'blue',
        class_code: cls.class_code,
        course_code: cls.course_code,
        course_name: cls.course_name,
        time_start: cls.time_start,
        time_finish: cls.time_finish,
      });
      current.add(1, 'weeks');
    }
  
    return localMarkedDates;
  };
  
  const onDayPress = (day) => {
    const newMarkedDates = { ...markedDates };
    if (newMarkedDates[selectedDate]) {
      newMarkedDates[selectedDate] = {
        ...newMarkedDates[selectedDate],
        selected: false,
      };
    }
    newMarkedDates[day.dateString] = {
      ...(newMarkedDates[day.dateString] || {}),
      selected: true,
      selectedColor: '#0da1fc',
    };
    setSelectedDate(day.dateString);
    setMarkedDates(newMarkedDates);
    setEventsForSelectedDate(newMarkedDates[day.dateString]?.dots || []);
  };

  const renderScene = ({ route }) => {
    switch (route.key) {
      case 'calendar':
        return (
          <StudentCalendar
            markedDates={markedDates}
            onDayPress={onDayPress}
            eventsForSelectedDate={eventsForSelectedDate}
          />
        );
      case 'class':
        return <StudentClass userId={userId} />;
      case 'report':
        return <StudentReport userId={userId} />;
      default:
        return null;
    }
  };

  const handleIndexChange = (index) => {
    setIndex(index);
    setAppBarTitle(routes[index].title);
  };

  return (
    <>
      <Appbar.Header style={{ backgroundColor: '#00B0FF' }}>
        <Appbar.Content
          title={appBarTitle}
          titleStyle={{
            fontSize: 20,
            textAlign: 'center',
            color: '#ffffff',
            fontWeight: 'bold',
          }}
        />
        <Appbar.Action
          icon={() =>
            avatarUrl ? (
              <Avatar.Image size={30} source={{ uri: avatarUrl }} />
            ) : (
              <Avatar.Text
                size={30}
                label={username ? username[0] : ''}
                style={{ backgroundColor: 'pink', fontWeight: 'bold' }}
              />
            )
          }
        />
      </Appbar.Header>
      <BottomNavigation
        navigationState={{ index, routes }}
        onIndexChange={handleIndexChange}
        renderScene={renderScene}
        renderIcon={({ route, focused, color }) => (
          <MaterialCommunityIcons name={route.icon} color={color} size={24} />
        )}
        activeColor="#204876"
        inactiveColor="#4b4b4b"
        barStyle={{
          backgroundColor: '#ffffff',
          borderWidth: 0.5,
          borderColor: '#ccccccac',
        }}
        activeIndicatorStyle={{
          backgroundColor: '#D3E3FF',
        }}
      />
    </>
  );
};

export default StudentHomeScreen;
