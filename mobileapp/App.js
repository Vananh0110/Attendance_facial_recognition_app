import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from './src/screens/WelcomeScreen.jsx';
import RegisterScreen from './src/screens/RegisterScreen.jsx';
import LoginScreen from './src/screens/LoginScreen.jsx';
import TeacherDashboard from './src/screens/teacher/TeacherDashboard.jsx';
import StudentDashboard from './src/screens/student/StudentDashboard.jsx';

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
        <Stack.Screen name="Teacher Dashboard" component={TeacherDashboard} />

        {/* Student */}
        <Stack.Screen name="Student Dashboard" component={StudentDashboard} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
