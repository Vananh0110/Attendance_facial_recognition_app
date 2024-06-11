import React, { useState, useEffect } from 'react';
import {
  Appbar,
  Avatar,
  BottomNavigation,
  Menu,
  Provider,
  Portal,
  Dialog,
  TouchableRipple,
  Button,
} from 'react-native-paper';
import { Text } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StudentCalendar from '../../../components/student/StudentCalendar';
import StudentClass from '../../../components/student/StudentClass';
import StudentReport from '../../../components/student/StudentReport';
import { useNavigation } from '@react-navigation/native';
import { API_BASE_URL } from '@env';

const StudentHomeScreen = () => {
  const [index, setIndex] = useState(0);
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [routes] = useState([
    { key: 'calendar', title: 'Home', icon: 'calendar' },
    { key: 'class', title: 'Class', icon: 'book' },
    { key: 'report', title: 'Report', icon: 'message' },
  ]);
  const [appBarTitle, setAppBarTitle] = useState(routes[0].title);
  const [visible, setVisible] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserData = async () => {
      const userJson = await AsyncStorage.getItem('user');
      const user = JSON.parse(userJson);
      setUserId(user.user_id);
      setUsername(user.username);
      setAvatarUrl(user.avatar_url);
    };
    fetchUserData();
  }, []);

  const renderScene = ({ route }) => {
    switch (route.key) {
      case 'calendar':
        return <StudentCalendar userId={userId} username={username} />;
      case 'class':
        return <StudentClass userId={userId} />;
      case 'report':
        return <StudentReport userId={userId} />;
      default:
        return null;
    }
  };

  const handleIndexChange = (index) => {
    setIndex(index);
    setAppBarTitle(routes[index].title);
  };

  const handleSignOut = async () => {
    setShowDialog(false);
    await AsyncStorage.removeItem('user');
    navigation.navigate('Welcome');
  };

  const handleProfilePress = () => {
    closeMenu();
    navigation.navigate('StudentProfile');
  };

  return (
    <>
      <Provider>
        <Appbar.Header style={{ backgroundColor: '#00B0FF' }}>
          <Appbar.Content
            title={appBarTitle}
            titleStyle={{
              fontSize: 20,
              textAlign: 'center',
              color: '#ffffff',
              fontWeight: 'bold',
            }}
          />
          <Menu
            visible={visible}
            onDismiss={closeMenu}
            contentStyle={{ fontSize: 14 }}
            style={{
              marginTop: 50,
            }}
            anchor={
              <TouchableRipple onPress={openMenu}>
                <Appbar.Action
                  icon={() =>
                    avatarUrl ? (
                      <Avatar.Image size={30} source={{ uri: `${API_BASE_URL}${avatarUrl}` }} />
                    ) : (
                      <Avatar.Text
                        size={30}
                        label={username ? username[0] : ''}
                        style={{ backgroundColor: 'pink', fontWeight: 'bold' }}
                      />
                    )
                  }
                />
              </TouchableRipple>
            }
          >
            <Menu.Item
              onPress={handleProfilePress}
              title="Profile"
              leadingIcon="account-edit"
              titleStyle={{ fontSize: 14 }}
            />
            <Menu.Item
              onPress={() => setShowDialog(true)}
              title="Sign Out"
              leadingIcon="account-arrow-right"
              titleStyle={{ fontSize: 14 }}
            />
          </Menu>
        </Appbar.Header>
        <Portal>
          <Dialog
            visible={showDialog}
            onDismiss={() => setShowDialog(false)}
            style={{ backgroundColor: '#ffffff' }}
          >
            <Dialog.Title>Confirm Sign Out</Dialog.Title>
            <Dialog.Content>
              <Text>Are you sure you want to sign out?</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button
                onPress={() => setShowDialog(false)}
                labelStyle={{ color: '#11182744' }}
                rippleColor="#d3e3ff"
              >
                Cancel
              </Button>
              <Button
                onPress={handleSignOut}
                labelStyle={{ color: '#00B0FF' }}
                rippleColor="#d3e3ff"
              >
                OK
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
        <BottomNavigation
          navigationState={{ index, routes }}
          onIndexChange={handleIndexChange}
          renderScene={renderScene}
          renderIcon={({ route, focused, color }) => (
            <MaterialCommunityIcons name={route.icon} color={color} size={24} />
          )}
          activeColor="#204876"
          inactiveColor="#4b4b4b"
          barStyle={{
            backgroundColor: '#ffffff',
            borderWidth: 0.5,
            borderColor: '#ccccccac',
          }}
          activeIndicatorStyle={{
            backgroundColor: '#D3E3FF',
          }}
        />
      </Provider>
    </>
  );
};

export default StudentHomeScreen;
