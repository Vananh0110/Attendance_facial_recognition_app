import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
const TeacherReportAttendanceDetail = ({ route }) => {
  const { classId, date } = route.params;
  console.log(classId, date);

  return (
    <>
      <View>
        <Text>Detail</Text>
      </View>
    </>
  );
};

export default TeacherReportAttendanceDetail;
