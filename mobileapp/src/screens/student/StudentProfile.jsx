import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { Appbar, Avatar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const StudentProfile = (userId) => {
  const navigation = useNavigation();

  return (
    <>
      <Appbar.Header style={{ backgroundColor: '#00B0FF' }}>
        <Appbar.BackAction
          onPress={() => navigation.goBack()}
          color="#ffffff"
        />
        <Appbar.Content
          title="Profile"
          titleStyle={{
            fontSize: 18,
            color: '#ffffff',
            fontWeight: 'bold',
          }}
        />
      </Appbar.Header>
      <ScrollView style={styles.container}>
        <Text>Student Profile</Text>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#ffffff',
    }
});

export default StudentProfile;
