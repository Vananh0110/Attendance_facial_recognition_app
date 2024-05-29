import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from './src/screens/WelcomeScreen.jsx';
import RegisterScreen from './src/screens/RegisterScreen.jsx';
import LoginScreen from './src/screens/LoginScreen.jsx';
import StudentHomeScreen from './src/screens/student/StudentHomeScreen.jsx';
import TeacherHomeScreen from './src/screens/teacher/TeacherHomeScreen.jsx';
import TeacherDetailClassScreen from './src/screens/teacher/TeacherDetailClassScreen.jsx';
import TeacherAddNewClass from './src/screens/teacher/TeacherAddNewClass.jsx';
import TeacherModifiedClassScreen from './src/screens/teacher/TeacherModifiedClassScreen.jsx';
import TraditionalAttendance from './src/screens/teacher/TraditionalAttendance.jsx';
import QrCodeAttendance from './src/screens/teacher/QrCodeAttendance.jsx';
import FaceRecognitionAttendance from './src/screens/teacher/FaceRecognitionAttendance.jsx';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="TeacherHomeScreen"
        screenOptions={{
          statusBarColor: '#00B0FF',
          headerStyle: {
            backgroundColor: '#00B0FF',
          },
          headerTintColor: 'white',
          headerTitleAlign: 'center',
        }}
      >
        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />

        {/* Teacher */}
        <Stack.Screen
          name="TeacherHomeScreen"
          component={TeacherHomeScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="TeacherDetailClass"
          component={TeacherDetailClassScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="TeacherAddNewClass"
          component={TeacherAddNewClass}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="TeacherModifiedClassScreen"
          component={TeacherModifiedClassScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="TraditionalAttendance"
          component={TraditionalAttendance}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="QrCodeAttendance"
          component={QrCodeAttendance}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="FaceRecognitionAttendance"
          component={FaceRecognitionAttendance}
          options={{ headerShown: false }}
        />

        {/* Student */}
        <Stack.Screen
          name="StudentHomeScreen"
          component={StudentHomeScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
