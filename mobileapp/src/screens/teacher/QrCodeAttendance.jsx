import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Appbar, Provider } from 'react-native-paper';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';
import axios from '../../api/axios';

const QrCodeAttendance = ({ route }) => {
  const { classId, date, } = route.params;
  const navigation = useNavigation();

  console.log(classId, date);
  const navigateToReport = () => {
    navigation.navigate('TeacherReportAttendanceDetail', {
      classId: classId,
      date: date,
    });
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
});

export default QrCodeAttendance;
