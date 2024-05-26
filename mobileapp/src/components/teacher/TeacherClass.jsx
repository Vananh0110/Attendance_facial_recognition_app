import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import {
  Card,
  Searchbar,
  Text,
  ActivityIndicator,
  Button,
} from 'react-native-paper';
import axios from '../../api/axios';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';

const TeacherClass = ({ userId }) => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const navigation = useNavigation();

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/class/all');
      const filteredData = response.data.filter(
        (cls) => cls.user_id === userId
      );
      setClasses(filteredData);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch classes', error);
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const filteredClasses = classes.filter(
    (cls) =>
      cls.course_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cls.class_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cls.course_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cls.day_of_week.toString().includes(searchQuery)
  );

  const dayOfWeekAsText = (day) => {
    const days = [
      'Chủ Nhật',
      'Thứ Hai',
      'Thứ Ba',
      'Thứ Tư',
      'Thứ Năm',
      'Thứ Sáu',
      'Thứ Bảy',
    ];
    return days[day];
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    return moment(timeString, 'HH:mm:ss').format('HH:mm');
  };

  const handleAddClass = () => {
    navigation.navigate('TeacherAddNewClass', { userId: userId });
  };

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search classes"
        onChangeText={handleSearch}
        value={searchQuery}
        style={styles.searchInput}
        inputStyle={styles.inputTextStyle}
      />
      {loading ? (
        <ActivityIndicator animating={true} color="#00B0FF" />
      ) : (
        <FlatList
          data={filteredClasses}
          keyExtractor={(item) => item.class_id.toString()}
          renderItem={({ item }) => (
            <Card style={styles.card}>
              <Card.Title
                title={item.course_code + ' ' + item.course_name}
                titleStyle={styles.title}
              />
              <Card.Content>
                <Text style={styles.text}>
                  {item.class_code}, {dayOfWeekAsText(item.day_of_week)},{' '}
                  {formatTime(item.time_start)} -{formatTime(item.time_finish)}
                </Text>
              </Card.Content>
            </Card>
          )}
        />
      )}
      <Button
        icon="plus"
        mode="contained"
        onPress={handleAddClass}
        style={styles.addButton}
      >
        Add New Class
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#ffffff',
  },
  searchInput: {
    marginBottom: 10,
    fontSize: 14,
    backgroundColor: '#eae8e8',
  },
  card: {
    marginVertical: 8,
    marginLeft: 5,
    marginRight: 5,
    backgroundColor: '#D3E3FF',
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 12,
  },
  inputTextStyle: {
    fontSize: 14,
  },
  addButton: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    margin: 10,
    backgroundColor: '#00b0ff',
    width: '50%',
    alignSelf: 'center',
    marginHorizontal: '25%',
  },
});

export default TeacherClass;
