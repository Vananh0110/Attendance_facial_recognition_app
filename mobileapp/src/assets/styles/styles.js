import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#f3f7fe',
    padding: 10,
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    height: 260,
    width: 260,
    marginTop: 30,
  },
  container: {
    marginTop: 40,
    alignItems: 'center',
  },
  textHeader: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'black',
  },
  button: {
    marginBottom: 10,
    backgroundColor: '#00B0FF',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    border: '1px solid transparent',
    borderRadius: 20,
    padding: 10,
  },
  textBtn: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  textLink: {
    color: '#00B0FF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    width: '100%',
    marginTop: 12,
    marginBottom: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 5,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 14,
  },
  noScheduleText: {
    textAlign: 'center',
    marginTop: 20,
  },
  calendar: {
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    margin: 10,
  },
  card: {
    marginVertical: 5,
    backgroundColor: '#D3E3FF',
  },
});

export default styles;
