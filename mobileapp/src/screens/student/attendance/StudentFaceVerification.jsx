import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, ScrollView, Alert } from 'react-native';
import {
  Appbar,
  Button,
  ActivityIndicator,
  Provider,
  IconButton,
  Portal,
  Tooltip,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { API_FLASK_BASE_URL, API_BASE_URL } from '@env';

const StudentFaceVerification = ({ route }) => {
  const { studentId, classId, date, qrData, studentClassId } = route.params;
  const navigation = useNavigation();
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets ? result.assets[0].uri : result.uri;
      console.log("Image picked URI: ", uri); 
      if (uri) {
        setImage(uri);
        await verifyFace(uri);
      } else {
        Alert.alert('Error', 'Failed to pick image');
      }
    }
  };

  const verifyFace = async (uri) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', {
        uri,
        name: `image.jpg`,
        type: 'image/jpeg',
      });
      formData.append('student_id', studentId);

      console.log("FormData: ", formData); 

      const response = await axios.post(
        `${API_FLASK_BASE_URL}/face_recognition/verify`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.status === 200 && response.data.verified) {
        Alert.alert('Success', 'Face verified successfully');
        await markAttendance(qrData.date, qrData.expirationTime);
      } else {
        Alert.alert('Error', 'Face verification failed');
        navigation.goBack();
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred during face verification');
    } finally {
      setLoading(false);
    }
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
      const response = await axios.post(`${API_BASE_URL}/attendance/qr`, {
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

  return (
    <Provider>
      <Appbar.Header style={{ backgroundColor: '#00B0FF' }}>
        <Appbar.BackAction
          onPress={() => navigation.goBack()}
          color="#ffffff"
        />
        <Appbar.Content
          title="Face Verification"
          titleStyle={{
            fontSize: 18,
            color: '#ffffff',
            fontWeight: 'bold',
          }}
        />
      </Appbar.Header>
      <View style={styles.container}>
        <Button onPress={pickImage} style={{backgroundColor: '#00b0ff'}}>Capture Image</Button>
        <ScrollView contentContainerStyle={styles.imagesContainer}>
          {image && <Image source={{ uri: image }} style={styles.image} />}
        </ScrollView>
        {loading && (
          <ActivityIndicator
            size="large"
            color="#00B0ff"
            style={styles.loading}
          />
        )}
      </View>
    </Provider>
  );
};

export default StudentFaceVerification;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginVertical: 20,
  },
  image: {
    width: 200,
    height: 200,
    margin: 5,
  },
  loading: {
    marginTop: 20,
  },
});
