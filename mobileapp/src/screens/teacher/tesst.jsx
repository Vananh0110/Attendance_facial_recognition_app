import React, { useEffect, useState } from 'react';
import { Appbar, BottomNavigation, Avatar } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from '../../api/axios';
import moment from 'moment';
import CalendarRoute from '../components/CalendarRoute';
import AssignmentsRoute from '../components/AssignmentsRoute';
import MessagesRoute from '../components/MessagesRoute';
import styles from '../../assets/styles/styles';

const TeacherHomeScreen = () => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'calendar', title: 'Calendar', icon: 'calendar' },
    { key: 'assignments', title: 'Assignments', icon: 'book' },
    { key: 'messages', title: 'Messages', icon: 'message' },
  ]);

  const [markedDates, setMarkedDates] = useState({});
  const [username, setUsername] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD'));
  const [eventsForSelectedDate, setEventsForSelectedDate] = useState([]);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    const userJson = await AsyncStorage.getItem('user');
    const user = JSON.parse(userJson);
    const userId = user.user_id;
    setUsername(user.username);
    setAvatarUrl(user.avatar_url);

    try {
      const response = await axios.get('/class/all');
      const filteredData = response.data.filter((cls) => cls.user_id === userId);
      let markedDatesObject = {};
      filteredData.forEach((cls) => {
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

  const renderScene = BottomNavigation.SceneMap({
    calendar: CalendarRoute,
    assignments: AssignmentsRoute,
    messages: MessagesRoute,
  });

  return (
    <>
      <Appbar.Header style={{ backgroundColor: '#00B0FF' }}>
        <Appbar.Content
          title="Home"
          titleStyle={{ fontSize: 20, textAlign: 'center', color: '#ffffff', fontWeight: 'bold' }}
        />
        <Appbar.Action
          icon={() =>
            avatarUrl ? (
              <Avatar.Image size={30} source={{ uri: avatarUrl }} />
            ) : (
              <Avatar.Text size={30} label={username ? username[0] : ''} style={{ backgroundColor: 'pink', fontWeight: 'bold' }} />
            )
          }
        />
      </Appbar.Header>
      <BottomNavigation
        navigationState={{ index, routes }}
        onIndexChange={setIndex}
        renderScene={renderScene}
      />
    </>
  );
};

export default TeacherHomeScreen;


     {/* <ScrollView style={styles.scrollContainer}>
        <View>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 20,
              marginBottom: 15,
            }}
          >
            <Text
              style={{ fontSize: 24, color: '#001C39', fontWeight: 'bold' }}
            >
              Welcome, {username}
            </Text>
          </View>
          <View>
            <Calendar
              current={Date()}
              markingType={'multi-dot'}
              markedDates={markedDates}
              onDayPress={onDayPress}
              style={styles.calendar}
            />
          </View>
          <View style={{ padding: 10 }}>
            {eventsForSelectedDate.length > 0 ? (
              eventsForSelectedDate.map((event, index) => (
                <Card key={index} style={styles.card}>
                  <Card.Content>
                    <Title
                      style={styles.title}
                    >{`${event.course_code} - ${event.course_name}`}</Title>
                    <Paragraph style={styles.text}>
                      Class code: {event.class_code}
                    </Paragraph>
                    <Paragraph style={styles.text}>
                      Time: {event.time_start} - {event.time_finish}
                    </Paragraph>
                  </Card.Content>
                </Card>
              ))
            ) : (
              <Card style={styles.card}>
                <Card.Content>
                  <Title style={styles.title}>No schedule</Title>
                </Card.Content>
              </Card>
            )}
          </View>
        </View>
      </ScrollView> */}