import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { List, Searchbar, Text, ActivityIndicator } from 'react-native-paper';
import axios from '../../api/axios';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';

const TeacherReport = ({ userId }) => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedClassId, setExpandedClassId] = useState(null);

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

  const fetchScheduleData = async (classId) => {
    try {
      const response = await axios.get(`/class/${classId}/schedule`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch schedule data', error);
      return [];
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleAccordionPress = async (classId) => {
    if (expandedClassId === classId) {
      setExpandedClassId(null);
    } else {
      setLoading(true);
      const scheduleData = await fetchScheduleData(classId);
      const updatedClasses = classes.map((cls) =>
        cls.class_id === classId ? { ...cls, scheduleData } : cls
      );
      setClasses(updatedClasses);
      setExpandedClassId(classId);
      setLoading(false);
    }
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

  const handleDatePress = (classId, date) => {
    navigation.navigate('TeacherReportAttendanceDetail', {
      classId: classId,
      date: date,
    });
  }
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
        <ScrollView>
          <List.Section>
            {filteredClasses.map((cls) => (
              <List.Accordion
                key={cls.class_id}
                title={`${cls.course_code} ${cls.course_name}`}
                description={`${cls.class_code}, ${dayOfWeekAsText(
                  cls.day_of_week
                )}, ${formatTime(cls.time_start)} - ${formatTime(
                  cls.time_finish
                )}`}
                left={(props) => (
                  <List.Icon {...props} icon="folder" color="#ffd700" />
                )}
                expanded={expandedClassId === cls.class_id}
                onPress={() => handleAccordionPress(cls.class_id)}
                titleStyle={styles.accordionTitle}
                descriptionStyle={styles.accordionDescription}
                style={styles.accordionStyle}
                rippleColor='#d3e3ff'
              >
                {cls.scheduleData ? (
                  cls.scheduleData.map((item, index) => (
                    <List.Item
                      key={index + 1}
                      title={`${moment(item.date).format('DD/MM/YYYY')}`}
                      titleStyle={styles.itemTitle}
                      style={styles.itemStyle}
                      onPress={() => handleDatePress(cls.class_id, item.date)}
                    />
                  ))
                ) : (
                  <ActivityIndicator animating={true} color="#00B0FF" />
                )}
              </List.Accordion>
            ))}
          </List.Section>
        </ScrollView>
      )}
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
  inputTextStyle: {
    fontSize: 14,
  },
  accordionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  accordionDescription: {
    fontSize: 12,
    color: '#666',
  },
  accordionStyle: {
    backgroundColor: '#ffffff',
  },
  itemTitle: {
    fontSize: 13,
    color: '#555',
  },
  itemStyle: {
    padding: 10,
  },
});

export default TeacherReport;
