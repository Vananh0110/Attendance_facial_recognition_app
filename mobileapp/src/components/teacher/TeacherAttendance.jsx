import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const TeacherAttendance = (userId) => {
  const navigation = useNavigation();

    const handlePress = (attendanceType) => {
      console.log(attendanceType);
      navigation.navigate('TeacherAttendanceClass', { attendanceType, userId });
    };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.option, styles.traditional]}
        onPress={() => handlePress(1)}
      >
        <MaterialCommunityIcons
          name="clipboard-list"
          size={48}
          color="#000000"
        />
        <Text style={styles.optionText}>Traditional Attendance</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.option, styles.qrCode]}
        onPress={() => handlePress(2)}
      >
        <MaterialCommunityIcons name="qrcode-scan" size={48} color="#000000" />
        <Text style={styles.optionText}>QR Code Attendance</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.option, styles.faceRecognition]}
        onPress={() => handlePress(3)}
      >
        <MaterialCommunityIcons
          name="face-recognition"
          size={48}
          color="#000000"
        />
        <Text style={styles.optionText}>Face Recognition Attendance</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  option: {
    width: '80%',
    height: '25%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  traditional: {
    backgroundColor: '#FFEDD3',
  },
  qrCode: {
    backgroundColor: '#FCD2D1',
  },
  faceRecognition: {
    backgroundColor: '#F69E7B',
  },
  optionText: {
    marginTop: 10,
    fontSize: 16,
    color: '#000000',
    fontWeight: 'bold',
  },
});

export default TeacherAttendance;
