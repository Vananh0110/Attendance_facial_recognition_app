import React, { useState, useEffect } from 'react';
import {
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import { Appbar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Camera, CameraType } from 'expo-camera/legacy';
import axios from '../../api/axios';

const StudentQrCodeScanner = ({ route }) => {
  const { classId, date, studentClassId } = route.params;
  const navigation = useNavigation();
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [facing, setFacing] = useState(CameraType.back);

  useEffect(() => {
    (async () => {
      const { status } = await requestPermission();
      if (status !== 'granted') {
        alert('Permission to access camera is required!');
      }
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    console.log(`QR code with type ${type} and data ${data} has been scanned!`);
    const qrData = JSON.parse(data);
    const { classId, date, expirationTime } = qrData;
    markAttendance(date, expirationTime);
  };

  const markAttendance = async (date, expirationTime) => {
    const student_class_id = studentClassId;
    const date_attended = date;
    const now = new Date();
    const time_attended = `${now.getHours()}:${now
      .getMinutes()
      .toString()
      .padStart(2, '0')}`;
    const status = 'P';
    const attendance_type = 'QR';

    try {
      const response = await axios.post('/attendance/qr', {
        student_class_id,
        date_attended,
        time_attended,
        status,
        attendance_type,
        expiration_time: expirationTime,
      });

      console.log('Success:', response.data);
      Alert.alert('Success', 'Attendance marked successfully', [
        {
          text: 'OK',
          onPress: () =>
            navigation.navigate('TeacherReportAttendanceDetail', {
              classId,
              date,
            }),
        },
      ]);
    } catch (error) {
      console.error('Error:', error.response?.data || error.message);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to mark attendance',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    }
  };

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
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
          title="Scan QR Code"
          titleStyle={{
            fontSize: 18,
            color: '#ffffff',
            fontWeight: 'bold',
          }}
        />
      </Appbar.Header>
      <View style={styles.container}>
        <Camera
          style={styles.camera}
          type={facing}
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          barCodeScannerSettings={{
            barCodeTypes: ['qr'],
          }}
        >
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={toggleCameraFacing}
            >
              <Text style={styles.text}>Flip Camera</Text>
            </TouchableOpacity>
          </View>
        </Camera>
      </View>
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
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default StudentQrCodeScanner;
