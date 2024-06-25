import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from './src/screens/WelcomeScreen.jsx';
import RegisterScreen from './src/screens/RegisterScreen.jsx';
import LoginScreen from './src/screens/LoginScreen.jsx';
import StudentHomeScreen from './src/screens/student/home/StudentHomeScreen.jsx';
import TeacherHomeScreen from './src/screens/teacher/home/TeacherHomeScreen.jsx';
import TeacherDetailClassScreen from './src/screens/teacher/class/TeacherDetailClassScreen.jsx';
import TeacherAddNewClass from './src/screens/teacher/class/TeacherAddNewClass.jsx';
import TeacherModifiedClassScreen from './src/screens/teacher/class/TeacherModifiedClassScreen.jsx';
import TraditionalAttendance from './src/screens/teacher/attendance/traditional/TraditionalAttendance.jsx';
import QrCodeAttendance from './src/screens/teacher/attendance/qrcode/QrCodeAttendance.jsx';
import FaceRecognitionAttendance from './src/screens/teacher/attendance/face_recognition/FaceRecognitionAttendance.jsx';
import TeacherReportAttendanceDetail from './src/screens/teacher/report/TeacherReportAttendanceDetail.jsx';
import TeacherAttendanceClass from './src/screens/teacher/class/TeacherAttendanceClass.jsx';
import TeacherProfile from './src/screens/teacher/profile/TeacherProfile.jsx';
import StudentCalendar from './src/components/student/StudentCalendar.jsx';
import StudentClass from './src/components/student/StudentClass.jsx';
import StudentReport from './src/components/student/StudentReport.jsx';
import StudentDetailClass from './src/screens/student/class/StudentDetailClass.jsx';
import StudentProfile from './src/screens/student/profile/StudentProfile.jsx';
import QrCodeDisplayScreen from './src/screens/teacher/attendance/qrcode/QrCodeDisplayScreen.jsx';
import StudentQrCodeScanner from './src/screens/student/attendance/StudentQrCodeScanner.jsx';
import StudentFaceVerification from './src/screens/student/attendance/StudentFaceVerification.jsx';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Welcome"
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

        <Stack.Screen
          name="TeacherReportAttendanceDetail"
          component={TeacherReportAttendanceDetail}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="TeacherAttendanceClass"
          component={TeacherAttendanceClass}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="TeacherProfile"
          component={TeacherProfile}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="QrCodeDisplayScreen"
          component={QrCodeDisplayScreen}
          options={{ headerShown: false }}
        />

        {/* Student */}
        <Stack.Screen
          name="StudentHomeScreen"
          component={StudentHomeScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="StudentCalendar"
          component={StudentCalendar}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="StudentClass"
          component={StudentClass}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="StudentReport"
          component={StudentReport}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="StudentDetailClass"
          component={StudentDetailClass}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="StudentProfile"
          component={StudentProfile}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="StudentQrCodeScanner"
          component={StudentQrCodeScanner}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="StudentFaceVerification"
          component={StudentFaceVerification}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
