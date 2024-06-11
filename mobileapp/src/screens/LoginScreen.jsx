import React, { useState } from 'react';
import {
  Text,
  View,
  ScrollView,
  Image,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import styles from '../assets/styles/styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from '../api/axios';
const LoginScreen = (props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const saveData = async (data) => {
    try {
      await AsyncStorage.setItem('user', JSON.stringify(data));
    } catch (error) {
      console.error('Lỗi khi lưu trữ dữ liệu người dùng:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post('/user/login', {
        email: email,
        password: password,
      });
      saveData(response.data.user);

      const role_id = response.data.user.role_id;

      if (role_id == 2) {
        props.navigation.navigate('TeacherHomeScreen');
      } else if (role_id == 3) {
        props.navigation.navigate('StudentHomeScreen');
      } else {
        console.error('Role không hợp lệ:', role_id);
      }
      console.log('Login successfully with role_id: ', role_id);
    } catch (error) {
      Alert.alert('Thông báo', 'Sai thông tin đăng nhập. Vui lòng thử lại.')
      console.error('Login failed: ', error);
    }
  };

  return (
    <ScrollView style={{ backgroundColor: '#f3f7fe' }}>
      <View style={styles.mainContainer}>
        <View style={styles.logoContainer}>
          <Image
            style={styles.logo}
            source={require('../assets/images/login.png')}
          />
        </View>
        <View style={{ alignItems: 'center', marginBottom: 30 }}>
          <Text style={styles.textHeader}>Login to your account</Text>
        </View>
        <View style={{ padding: 10 }}>
          <SafeAreaView style={{ marginBottom: 20 }}>
            <Text style={styles.label}>Email:</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Email"
              value={email}
              onChangeText={(text) => setEmail(text)}
            />
            <Text style={styles.label}>Password:</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Password"
              secureTextEntry={true}
              value={password}
              onChangeText={(text) => setPassword(text)}
            />
          </SafeAreaView>
          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.8}
            onPress={handleSubmit}
          >
            <Text style={styles.textBtn}>Login</Text>
          </TouchableOpacity>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 10,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: 500, marginRight: 5 }}>
              Don't have an account?
            </Text>
            <Text
              style={styles.textLink}
              onPress={() => props.navigation.navigate('Register')}
            >
              Register
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default LoginScreen;
