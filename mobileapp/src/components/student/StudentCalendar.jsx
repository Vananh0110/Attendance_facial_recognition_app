import React, { useState, useEffect } from 'react';
import { ScrollView, View } from 'react-native';
import {Card, Text, Title, Paragraph } from 'react-native-paper';
import axios from '../../api/axios';
import moment from 'moment';
import styles from '../../assets/styles/styles';
import { useNavigation } from '@react-navigation/native';
import { Calendar } from 'react-native-calendars';

const StudentCalendar = ({ userId, username }) => {
  const [markedDates, setMarkedDates] = useState({});
  const [eventsForSelectedDate, setEventsForSelectedDate] = useState([]);
  const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD'));
  const navigation = useNavigation();

  useEffect(() => {
    if (userId) {
      fetchClasses(userId);
    }
  }, [userId]);

  const fetchClasses = async (userId) => {
    try {
      const response = await axios.get(`/studentClass/getClass/${userId}`);
      const clsData = response.data;
      let markedDatesObject = {};
      clsData.forEach(cls => {
        const eventDates = generateEventDates(cls);
        Object.keys(eventDates).forEach(date => {
          if (!markedDatesObject[date]) {
            markedDatesObject[date] = { dots: [] };
          }
          markedDatesObject[date].dots = markedDatesObject[date].dots.concat(eventDates[date].dots);
        });
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
    let index = 0;
  
    if (current.isBefore(startDate, 'day')) {
      current.add(1, 'weeks');
    }
  
    while (current.isSameOrBefore(endDate)) {
      const eventDateStr = current.format('YYYY-MM-DD');
      if (!localMarkedDates[eventDateStr]) {
        localMarkedDates[eventDateStr] = { dots: [] };
      }
      localMarkedDates[eventDateStr].dots.push({
        key: `${cls.class_id}-${index}`,
        color: 'red',
        selectedDotColor: 'blue',
        class_code: cls.class_code,
        course_code: cls.course_code,
        course_name: cls.course_name,
        time_start: cls.time_start,
        time_finish: cls.time_finish,
      });
      index++;
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

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
    onDayPress && onDayPress(day);
  };

  const goToDetailClass = (classId) => {
    navigation.navigate('StudentDetailClass', { classId, date: selectedDate });
  };
  
  return (
    <ScrollView style={styles.scrollContainer}>
      <View>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 20,
            marginBottom: 15,
          }}
        >
          <Text style={{ fontSize: 24, color: '#001C39', fontWeight: 'bold' }}>
            Welcome, {username}
          </Text>
        </View>
        <View>
          <Calendar
            current={Date()}
            markingType={'multi-dot'}
            markedDates={markedDates}
            onDayPress={handleDayPress}
            style={styles.calendar}
          />
        </View>
        <View style={{ padding: 10 }}>
          {eventsForSelectedDate.length > 0 ? (
            eventsForSelectedDate
              .sort(
                (a, b) =>
                  moment(a.time_start, 'HH:mm') - moment(b.time_start, 'HH:mm')
              )
              .map((event, index) => (
                <Card
                  style={styles.card}
                  key={index}
                  onPress={() => {
                    const classId = event.key.split('-')[0];
                    goToDetailClass(classId);
                  }}
                >
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
    </ScrollView>
  );
};

export default StudentCalendar;
