import React, { useState } from 'react';
import {
  Text,
  View,
  ScrollView,
  Image,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import styles from '../assets/styles/styles';

const RegisterScreen = (props) => {
  return (
    <ScrollView style={{ backgroundColor: '#f3f7fe' }}>
      <View style={styles.mainContainer}>
        <View style={styles.logoContainer}>
          <Image
            style={styles.logo}
            source={require('../assets/images/register.png')}
          />
        </View>
        <View style={{ alignItems: 'center', marginBottom: 30 }}>
          <Text style={styles.textHeader}>Get Started 🚀</Text>
        </View>
        <View style={{ padding: 10 }}>
          <SafeAreaView style={{ marginBottom: 20 }}>
            <Text style={styles.label}>Username:</Text>
            <TextInput style={styles.input} placeholder="Enter Username" />
            <Text style={styles.label}>Email:</Text>
            <TextInput style={styles.input} placeholder="Enter Email" />
            <Text style={styles.label}>Password:</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Password"
              secureTextEntry={true}
            />
          </SafeAreaView>
          <TouchableOpacity style={styles.button} activeOpacity={0.8}>
            <Text style={styles.textBtn}>Register</Text>
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
              Already have an account?
            </Text>
            <Text
              style={styles.textLink}
              onPress={() => props.navigation.navigate('Login')}
            >
              Sign in instead
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default RegisterScreen;
