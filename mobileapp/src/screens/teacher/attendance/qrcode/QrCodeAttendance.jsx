import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import {
  Appbar,
  Provider,
  TextInput,
  Button,
  ActivityIndicator,
  Card,
  HelperText,
} from 'react-native-paper';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';
import axios from '../../../../api/axios';

const QrCodeAttendance = ({ route }) => {
  const { classId, date } = route.params;
  const navigation = useNavigation();
  const [duration, setDuration] = useState('');
  const [classInfo, setClassInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const createQRCode = () => {
    if (!duration) {
      setError('Please enter duration in minutes');
      return;
    }
    setError('');
    const expirationTime = moment(date)
      .add(parseInt(duration, 10), 'minutes')
      .toISOString();
    navigation.navigate('QrCodeDisplayScreen', {
      classId,
      date,
      duration,
      expirationTime,
    });
  };

  const navigateToReport = () => {
    navigation.navigate('TeacherReportAttendanceDetail', {
      classId: classId,
      date: date,
    });
  };

  useEffect(() => {
    const fetchClassInfo = async () => {
      try {
        const response = await axios.get(`/class/${classId}`);
        setClassInfo(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching class info: ', error);
        setLoading(false);
      }
    };

    fetchClassInfo();
  }, [classId]);
  const formatDate = (date) => {
    return moment(date).format('DD/MM/YYYY');
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

  const formatTime = (timeString) => {
    if (!timeString) return '';
    return moment(timeString, 'HH:mm:ss').format('HH:mm');
  };

  return (
    <>
      <Provider>
        <Appbar.Header style={{ backgroundColor: '#00B0FF' }}>
          <Appbar.BackAction
            onPress={() => navigation.goBack()}
            color="#ffffff"
          />
          <Appbar.Content
            title="QRCode Attendance"
            titleStyle={styles.titleStyle}
          />
          <Appbar.Action
            icon="chart-bar"
            color="#ffffff"
            onPress={() => navigateToReport()}
          />
        </Appbar.Header>
        <View style={styles.container}>
          {loading ? (
            <ActivityIndicator size="small" color="#00B0FF" />
          ) : (
            classInfo && (
              <Card style={styles.card}>
                <Card.Title
                  title={classInfo.course_name}
                  titleStyle={styles.cardTitle}
                />
                <Card.Content style={{ paddingLeft: 20 }}>
                  <Text style={styles.detailText}>
                    <Text style={styles.detailLabel}>Class: </Text>
                    {classInfo.class_code}
                  </Text>
                  <Text style={styles.detailText}>
                    <Text style={styles.detailLabel}>Course code: </Text>
                    {classInfo.course_code}
                  </Text>
                  <Text style={styles.detailText}>
                    <Text style={styles.detailLabel}>Teacher: </Text>
                    {classInfo.username}
                  </Text>
                  <Text style={styles.detailText}>
                    <Text style={styles.detailLabel}>Day of the week: </Text>
                    {dayOfWeekAsText(classInfo.day_of_week)}
                  </Text>
                  <Text style={styles.detailText}>
                    <Text style={styles.detailLabel}>Time: </Text>
                    {formatTime(classInfo.time_start)} -{' '}
                    {formatTime(classInfo.time_finish)}
                  </Text>
                  <Text style={styles.detailText}>
                    <Text style={styles.detailLabel}>Date attended: </Text>
                    {formatDate(date)}
                  </Text>
                </Card.Content>
              </Card>
            )
          )}
          <View style={styles.inputContainer}>
            <TextInput
              label="Enter duration in minutes"
              value={duration}
              onChangeText={setDuration}
              keyboardType="numeric"
              mode="outlined"
              style={styles.input}
              outlineStyle={styles.outlineStyle}
              cursorColor="#00b0ff"
              selectionColor="#00b0ff"
              theme={{ colors: { primary: '#000000' } }}
            />
            <HelperText type="error" visible={!!error}>
              {error}
            </HelperText>
          </View>
          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              onPress={createQRCode}
              style={styles.button}
            >
              Create QR Code
            </Button>
          </View>
        </View>
      </Provider>
    </>
  );
};

const styles = StyleSheet.create({
  titleStyle: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#ffffff',
  },
  card: {
    marginHorizontal: 16,
    elevation: 2,
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: '#d3e3ff',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  detailText: {
    fontSize: 14,
    textAlign: 'left',
    lineHeight: 24,
    marginTop: 8,
  },
  qrContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#00b0ff',
  },
  outlineStyle: {
    borderColor: '#ccc',
    borderRadius: 10,
  },
  inputContainer: {
    marginVertical: 10,
    marginHorizontal: 10,
  },
  buttonContainer: {
    marginHorizontal: 10,
  },
});

export default QrCodeAttendance;
