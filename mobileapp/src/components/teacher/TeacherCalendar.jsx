import React, { useState, useEffect } from 'react';
import { ScrollView, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Card, Text, Title, Paragraph } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import styles from '../../assets/styles/styles';

const TeacherCalendar = ({ markedDates, onDayPress, eventsForSelectedDate }) => {
  const [username, setUsername] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      const userJson = await AsyncStorage.getItem('user');
      const user = JSON.parse(userJson);
      setUsername(user.username);
    };
    fetchUserData();
  }, []);

  return (
    <ScrollView style={styles.scrollContainer}>
      <View>
        <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20, marginBottom: 15 }}>
          <Text style={{ fontSize: 24, color: '#001C39', fontWeight: 'bold' }}>Welcome, {username}</Text>
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
                  <Title style={styles.title}>{`${event.course_code} - ${event.course_name}`}</Title>
                  <Paragraph style={styles.text}>Class code: {event.class_code}</Paragraph>
                  <Paragraph style={styles.text}>Time: {event.time_start} - {event.time_finish}</Paragraph>
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

export default TeacherCalendar;
