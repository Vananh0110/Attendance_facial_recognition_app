import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Appbar, Provider } from 'react-native-paper';
import moment from 'moment';
import QRCode from 'react-native-qrcode-svg';
import { useNavigation } from '@react-navigation/native';

const QrCodeDisplayScreen = ({ route }) => {
  const { classId, date, duration } = route.params;
  const navigation = useNavigation();
  const [qrCode, setQrCode] = useState(null);
  const [timeLeft, setTimeLeft] = useState(duration * 60); // thời gian đếm ngược tính bằng giây

  useEffect(() => {
    const expirationTime = moment().add(duration, 'minutes').toISOString();
    const data = JSON.stringify({ classId, date, expirationTime });
    setQrCode(data);
  }, [classId, date, duration]);

  useEffect(() => {
    if (timeLeft <= 0) {
      navigation.goBack();
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft, navigation]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <Provider>
      <Appbar.Header style={{ backgroundColor: '#00B0FF' }}>
        <Appbar.BackAction
          onPress={() => navigation.goBack()}
          color="#ffffff"
        />
        <Appbar.Content title="QRCode Display" titleStyle={styles.titleStyle} />
      </Appbar.Header>
      <View style={styles.container}>
        {qrCode && (
          <View style={styles.qrContainer}>
            <Text style={styles.textTitleStyle}>Scan QR Code</Text>
            <Text style={styles.textContentStyle}>Scan this code to mark attendance</Text>
            <QRCode
              value={qrCode}
              size={280}
              color="black"
              backgroundColor="white"
            />
            <Text style={styles.timer}>
              Time left: {formatTime(timeLeft)}
            </Text>
          </View>
        )}
      </View>
    </Provider>
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
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#ffffff',
  },
  qrContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  textTitleStyle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10
  },
  textContentStyle: {
    marginBottom: 10,
  },
  timer: {
    marginTop: 20,
    fontSize: 16,
    color: 'red'
  },
});

export default QrCodeDisplayScreen;
