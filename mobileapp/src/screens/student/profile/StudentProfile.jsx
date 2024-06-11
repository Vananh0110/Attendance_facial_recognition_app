import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { Appbar, Avatar, List, Divider, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from '../../../api/axios';
import { API_BASE_URL } from '@env';
import moment from 'moment';

const StudentProfile = () => {
  const [userData, setUserData] = useState(null);
  const [classes, setClasses] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserData = async () => {
      const userJson = await AsyncStorage.getItem('user');
      const user = JSON.parse(userJson);
      const response = await axios.get(`/student/user/${user.user_id}`);
      setUserData(response.data);
      fetchClasses(user.user_id);
    };

    const fetchClasses = async (userId) => {
      try {
        const response = await axios.get(`/studentClass/getClass/${userId}`);
        setClasses(response.data);
      } catch (error) {
        console.error('Failed to fetch classes', error);
      }
    };

    fetchUserData();
  }, []);

  const formatDate = (date) => {
    return moment(date).format('DD/MM/YYYY');
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    return moment(timeString, 'HH:mm:ss').format('HH:mm');
  };

  const dayOfWeekAsText = (day) => {
    const days = [
      'Chủ Nhật',
      'Thứ Hai',
      'Thứ Ba',
      'Thứ Tư',
      'Thứ Năm',
      'Thứ Sáu',
      'Thứ Bảy',
    ];
    return days[day];
  };

  if (!userData) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <>
      <Appbar.Header style={{ backgroundColor: '#00B0FF' }}>
        <Appbar.BackAction
          onPress={() => navigation.goBack()}
          color="#ffffff"
        />
        <Appbar.Content
          title="Profile"
          titleStyle={{
            fontSize: 18,
            color: '#ffffff',
            fontWeight: 'bold',
          }}
        />
      </Appbar.Header>
      <ScrollView style={styles.container}>
        <View style={styles.profileHeader}>
          {userData.avatar_url ? (
            <Avatar.Image
              size={120}
              source={{ uri: `${API_BASE_URL}${userData.avatar_url}` }}
              style={styles.avatar}
            />
          ) : (
            <Avatar.Text
              size={120}
              label={userData.username ? userData.username[0] : ''}
              style={{ backgroundColor: 'pink', fontWeight: 'bold' }}
            />
          )}
          <Text style={styles.username}>{userData.username}</Text>
          <Text style={styles.email}>{userData.email}</Text>
        </View>
        <Divider />
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Student ID:</Text>
          <Text style={styles.infoValue}>{userData.student_code}</Text>
        </View>
        <Divider />
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Class:</Text>
          <Text style={styles.infoValue}>{userData.student_class}</Text>
        </View>
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Gender:</Text>
          <Text style={styles.infoValue}>{userData.gender}</Text>
        </View>
        <Divider />
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Phone:</Text>
          <Text style={styles.infoValue}>{userData.phone}</Text>
        </View>
        <Divider />
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Classes Attended:</Text>
          <List.Section>
            {classes.map((item, index) => (
              <List.Item
                key={index}
                title={`${item.course_code} - ${item.course_name}`}
                description={`${item.class_code}, ${dayOfWeekAsText(
                  item.day_of_week
                )}, ${formatTime(item.time_start)} - ${formatTime(
                  item.time_finish
                )} (${formatDate(item.date_start)} - ${formatDate(
                  item.date_finish
                )})`}
                left={(props) => <List.Icon {...props} icon="book" />}
              />
            ))}
          </List.Section>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#ffffff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    marginBottom: 10,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 16,
    color: 'gray',
  },
  infoSection: {
    padding: 10,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoValue: {
    fontSize: 16,
    color: 'gray',
  },
});

export default StudentProfile;
