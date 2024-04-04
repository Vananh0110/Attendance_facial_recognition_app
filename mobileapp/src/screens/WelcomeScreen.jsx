import { Text, View, Image, TouchableOpacity } from 'react-native';
import styles from '../assets/styles/styles';

const WelcomeScreen = (props) => {
  return (
    <View style={styles.mainContainer}>
      <View style={styles.logoContainer}>
        <Image
          style={{height: 300, width: 300, marginTop: 30}}
          source={require('../assets/images/welcome.png')}
        />
      </View>
      <View style={{alignItems: 'center', paddingTop: 40}}>
        <Text style={styles.textHeader}>Welcome to Attendance!</Text>
      </View>
      <View
        style={{
          marginTop: 40,
        }}
      >
        <View style={{ padding: 20, marginTop: 30 }}>
          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.8}
            onPress={() => props.navigation.navigate('Login')}
          >
            <Text style={styles.textBtn}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.8}
            onPress={() => props.navigation.navigate('Register')}
          >
            <Text style={styles.textBtn}>Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default WelcomeScreen;
