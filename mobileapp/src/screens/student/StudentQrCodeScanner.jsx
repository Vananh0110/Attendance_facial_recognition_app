import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Appbar } from 'react-native-paper';
import axios from '../../api/axios';
import { useNavigation } from '@react-navigation/native';

const StudentQrCodeScanner = () => {
  const navigation = useNavigation();
  return (
    <>
      <Appbar.Header style={{ backgroundColor: '#00B0FF' }}>
        <Appbar.BackAction
          onPress={() => navigation.goBack()}
          color="#ffffff"
        />
        <Appbar.Content
          title="Scan QRCode"
          titleStyle={{
            fontSize: 18,
            color: '#ffffff',
            fontWeight: 'bold',
          }}
        />
      </Appbar.Header>
      <View>
        
      </View>
    </>
  );
};

const styles = StyleSheet.create({});

export default StudentQrCodeScanner;
