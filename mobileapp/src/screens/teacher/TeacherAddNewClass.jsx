import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
} from 'react-native';
import {
  Appbar,
  Modal,
  Portal,
  Provider,
  Button,
  IconButton,
} from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Dropdown } from 'react-native-element-dropdown';
import { TimePickerModal, registerTranslation } from 'react-native-paper-dates';
import { vi } from 'date-fns/locale';
import axios from '../../api/axios';

registerTranslation('vi', vi);

const TeacherAddNewClass = () => {
  const route = useRoute();
  const userId = route.params?.userId;
  const navigation = useNavigation();
  const [classCode, setClassCode] = useState('');
  const [teacherId, setTeacherId] = useState(null);
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [dateStart, setDateStart] = useState(new Date());
  const [dateFinish, setDateFinish] = useState(new Date());
  const [showDateStartPicker, setShowDateStartPicker] = useState(false);
  const [showDateFinishPicker, setShowDateFinishPicker] = useState(false);
  const [dayOfWeek, setDayOfWeek] = useState(null);
  const [timeStart, setTimeStart] = useState(new Date());
  const [showTimeStartPicker, setShowTimeStartPicker] = useState(false);
  const [timeFinish, setTimeFinish] = useState(new Date());
  const [showTimeFinishPicker, setShowTimeFinishPicker] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [newCourseCode, setNewCourseCode] = useState('');
  const [newCourseName, setNewCourseName] = useState('');
  const [alertModalVisible, setAlertModalVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertIcon, setAlertIcon] = useState('alert');
  const [iconColor, setIconColor] = useState('#FFCC00');

  const fetchCourses = async () => {
    try {
      const response = await axios.get('/course/all');
      const coursesWithAddNew = [
        ...response.data,
        { course_code: 'Add', course_name: 'new course', course_id: 'add_new' },
      ];
      setCourses(coursesWithAddNew);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const fetchTeacherId = async () => {
    try {
      const response = await axios.get('/teacher/all');
      const teacher = response.data.find(
        (teacher) => teacher.user_id === userId
      );
      setTeacherId(teacher.teacher_id);
    } catch (error) {
      console.error('Failed to fetch teachers: ', error);
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchTeacherId();
  }, []);

  const toggleDateStartPicker = () => {
    setShowDateStartPicker(!showDateStartPicker);
  };

  const toggleDateFinishPicker = () => {
    setShowDateFinishPicker(!showDateFinishPicker);
  };

  const onChangeStart = (event, selectedDate) => {
    const currentDate = selectedDate || dateStart;
    setDateStart(currentDate);
    setShowDateStartPicker(false);
  };

  const onChangeFinish = (event, selectedDate) => {
    const currentDate = selectedDate || dateFinish;
    setDateFinish(currentDate);
    setShowDateFinishPicker(false);
  };

  const dayOfWeekData = [
    { label: 'Chủ Nhật', value: 0 },
    { label: 'Thứ Hai', value: 1 },
    { label: 'Thứ Ba', value: 2 },
    { label: 'Thứ Tư', value: 3 },
    { label: 'Thứ Năm', value: 4 },
    { label: 'Thứ Sáu', value: 5 },
    { label: 'Thứ Bảy', value: 6 },
  ];

  const onDismissTimeStartPicker = () => {
    setShowTimeStartPicker(false);
  };

  const onConfirmTimeStart = ({ hours, minutes }) => {
    const updatedTime = new Date(timeStart);
    updatedTime.setHours(hours);
    updatedTime.setMinutes(minutes);
    setTimeStart(updatedTime);
    setShowTimeStartPicker(false);
  };

  const showTimeFinishPickerModal = () => {
    setShowTimeFinishPicker(true);
  };

  const onDismissTimeFinishPicker = () => {
    setShowTimeFinishPicker(false);
  };

  const onConfirmTimeFinish = ({ hours, minutes }) => {
    const updatedTime = new Date(timeFinish);
    updatedTime.setHours(hours);
    updatedTime.setMinutes(minutes);
    setTimeFinish(updatedTime);
    setShowTimeFinishPicker(false);
  };

  const showTimeStartPickerModal = () => {
    setShowTimeStartPicker(true);
  };

  const renderItem = (item) => {
    return (
      <View style={styles.itemStyle}>
        <Text style={styles.itemTextStyle}>{item.label}</Text>
      </View>
    );
  };

  const renderCourseItem = (item) => {
    return (
      <View style={styles.itemStyle}>
        <Text style={styles.itemTextStyle}>{item.label}</Text>
      </View>
    );
  };

  const formatTime = (date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const handleDayOfWeekChange = (item) => {
    setDayOfWeek(item.value);
  };

  const handleCourseChange = (item) => {
    if (item.value === 'add_new') {
      setModalVisible(true);
    } else {
      setSelectedCourseId(item.value);
    }
  };

  const showAlert = (message, type) => {
    setAlertMessage(message);
    switch (type) {
      case 'success':
        setAlertIcon('check');
        setIconColor('#4CAF50');
        break;
      case 'error':
        setAlertIcon('close');
        setIconColor('#F44336');
        break;
      default:
        setAlertIcon('alert');
        setIconColor('#FFCC00');
    }
    setAlertModalVisible(true);
  };

  const handleAddNewCourse = async () => {
    if (!newCourseCode || !newCourseName) {
      showAlert('Please fill all fields.', 'warning');
      return;
    }
    try {
      const response = await axios.post('/course', {
        course_code: newCourseCode,
        course_name: newCourseName,
      });
      setModalVisible(false);
      fetchCourses();
      setNewCourseCode('');
      setNewCourseName('');
      showAlert('Course added successfully!', 'success');
    } catch (error) {
      console.error('Error adding new course:', error);
      showAlert('Failed to add course.', 'error');
    }
  };

  const handleSubmit = async () => {
    const formData = {
      teacher_id: teacherId,
      class_code: classCode,
      course_id: selectedCourseId,
      day_of_week: dayOfWeek,
      time_start: `${timeStart
        .getHours()
        .toString()
        .padStart(2, '0')}:${timeStart
        .getMinutes()
        .toString()
        .padStart(2, '0')}`,
      time_finish: `${timeFinish
        .getHours()
        .toString()
        .padStart(2, '0')}:${timeFinish
        .getMinutes()
        .toString()
        .padStart(2, '0')}`,
      date_start: dateStart.toISOString().split('T')[0],
      date_finish: dateFinish.toISOString().split('T')[0],
    };

    try {
      const response = await axios.post('/class', formData);
      console.log(response.data);
    } catch (error) {
      console.error('Failed to submit data', error);
    }
  };

  return (
    <>
      <Appbar.Header style={{ backgroundColor: '#00B0FF' }}>
        <Appbar.BackAction
          onPress={() => navigation.goBack()}
          color="#ffffff"
        />
        <Appbar.Content title="Add New Class" titleStyle={styles.titleStyle} />
      </Appbar.Header>
      <Provider>
        <ScrollView style={styles.container}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Class code:</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter class code"
              value={classCode}
              onChangeText={setClassCode}
              placeholderTextColor="#11182744"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Course: </Text>
            <Dropdown
              style={styles.dropdown}
              containerStyle={styles.dropdownContainer}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              itemStyle={styles.itemStyle}
              data={courses.map((course) => ({
                label: `${course.course_code} ${course.course_name}`,
                value: course.course_id,
              }))}
              search
              searchPlaceholder="Search..."
              maxHeight={320}
              labelField="label"
              valueField="value"
              placeholder="Select a course"
              onChange={handleCourseChange}
              renderItem={renderCourseItem}
            />
          </View>
          <Portal>
            <Modal
              visible={modalVisible}
              onDismiss={() => setModalVisible(false)}
              contentContainerStyle={styles.modalContainer}
            >
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Add New Course</Text>
                <IconButton
                  icon="close"
                  size={20}
                  onPress={() => setModalVisible(false)}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Course code: </Text>
                <TextInput
                  label="Course Code"
                  value={newCourseCode}
                  onChangeText={setNewCourseCode}
                  style={styles.textInput}
                  placeholder="Enter course code"
                  placeholderTextColor="#11182744"
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Course name: </Text>
                <TextInput
                  label="Course Name"
                  value={newCourseName}
                  onChangeText={setNewCourseName}
                  style={styles.textInput}
                  placeholder="Enter course name"
                  placeholderTextColor="#11182744"
                />
              </View>
              <Button
                mode="contained"
                onPress={handleAddNewCourse}
                style={styles.button}
              >
                Add Course
              </Button>
            </Modal>
            <Modal
              visible={alertModalVisible}
              onDismiss={() => setAlertModalVisible(false)}
              contentContainerStyle={styles.modalContainer}
            >
              <View style={styles.alertHeader}>
                <View style={{ display: 'flex', alignItems: 'flex-end' }}>
                  <IconButton
                    icon="close"
                    size={20}
                    onPress={() => setAlertModalVisible(false)}
                  />
                </View>
                <View
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <IconButton
                    icon={alertIcon}
                    size={40}
                    color="#ffffff"
                    style={{
                      backgroundColor: iconColor,
                      color: '#FFFFFF',
                    }}
                  />
                  <Text>{alertMessage}</Text>
                </View>
              </View>
            </Modal>
          </Portal>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Day of week: </Text>
            <Dropdown
              style={styles.dropdown}
              containerStyle={styles.dropdownContainer}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              itemStyle={styles.itemStyle}
              data={dayOfWeekData}
              search
              searchPlaceholder="Search..."
              maxHeight={320}
              labelField="label"
              valueField="value"
              placeholder="Select day of week"
              value={dayOfWeek}
              onChange={handleDayOfWeekChange}
              renderItem={renderItem}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Time Start:</Text>
            <Pressable
              onPress={showTimeStartPickerModal}
              style={styles.pressable}
            >
              <Text style={styles.placeholderText}>
                {formatTime(timeStart)}
              </Text>
            </Pressable>
            <TimePickerModal
              visible={showTimeStartPicker}
              onDismiss={onDismissTimeStartPicker}
              onConfirm={onConfirmTimeStart}
              hours={timeStart.getHours()}
              minutes={timeStart.getMinutes()}
              locale="vi"
              label="Select time start"
              cancelLabel="Cancel"
              confirmLabel="Ok"
              animationType="fade"
              is24Hour={true}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Time Finish:</Text>
            <Pressable
              onPress={showTimeFinishPickerModal}
              style={styles.pressable}
            >
              <Text style={styles.placeholderText}>
                {formatTime(timeFinish)}
              </Text>
            </Pressable>
            <TimePickerModal
              visible={showTimeFinishPicker}
              onDismiss={onDismissTimeFinishPicker}
              onConfirm={onConfirmTimeFinish}
              hours={timeStart.getHours()}
              minutes={timeStart.getMinutes()}
              locale="vi"
              label="Select time start"
              cancelLabel="Cancel"
              confirmLabel="Ok"
              animationType="fade"
              is24Hour={true}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Date Start:</Text>
            <Pressable onPress={toggleDateStartPicker} style={styles.pressable}>
              <Text style={styles.placeholderText}>
                {dateStart.toLocaleDateString()}
              </Text>
            </Pressable>
            {showDateStartPicker && (
              <DateTimePicker
                mode="date"
                display="spinner"
                value={dateStart}
                onChange={onChangeStart}
                maximumDate={new Date(2099, 11, 31)}
                style={styles.datePicker}
              />
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Date Finish:</Text>
            <Pressable
              onPress={toggleDateFinishPicker}
              style={styles.pressable}
            >
              <Text style={styles.placeholderText}>
                {dateFinish.toLocaleDateString()}
              </Text>
            </Pressable>
            {showDateFinishPicker && (
              <DateTimePicker
                mode="date"
                display="spinner"
                value={dateFinish}
                onChange={onChangeFinish}
                maximumDate={new Date(2099, 11, 31)}
                minimumDate={dateStart}
                style={styles.datePicker}
              />
            )}
          </View>
          <View style={{ marginBottom: 50 }}>
            <Button
              mode="contained"
              onPress={handleSubmit}
              style={styles.button}
            >
              Save
            </Button>
          </View>
        </ScrollView>
      </Provider>
    </>
  );
};

export default TeacherAddNewClass;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#ffffff',
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    marginBottom: 10,
    fontWeight: 'bold',
    fontSize: 13,
    color: '#111827cc',
  },
  textInput: {
    backgroundColor: 'transparent',
    height: 50,
    fontSize: 14,
    color: '#111827cc',
    borderRadius: 50,
    borderWidth: 1.5,
    borderColor: '#11182711',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  pressable: {
    backgroundColor: 'transparent',
    height: 50,
    fontSize: 14,
    color: '#111827cc',
    borderRadius: 50,
    borderWidth: 1.5,
    borderColor: '#11182711',
    paddingHorizontal: 20,
    marginBottom: 20,
    display: 'flex',
    justifyContent: 'center',
  },
  titleStyle: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  placeholderText: {
    color: '#111827',
    fontSize: 14,
  },
  datePicker: {
    height: 120,
    marginTop: -10,
  },
  placeholderStyle: {
    color: '#11182744',
    fontSize: 14,
  },
  selectedTextStyle: {
    fontSize: 14,
  },
  dropdown: {
    backgroundColor: 'transparent',
    height: 50,
    fontSize: 14,
    color: '#111827cc',
    borderRadius: 50,
    borderWidth: 1.5,
    borderColor: '#11182711',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  dropdownContainer: {
    paddingHorizontal: 10,
    paddingTop: 8,
    borderRadius: 10,
  },
  textItem: {
    fontSize: 14,
  },
  inputSearchStyle: {
    fontSize: 14,
  },
  itemStyle: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#e1e1e1',
  },
  itemTextStyle: {
    fontSize: 14,
    color: '#333',
  },
  modalContainer: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: '#ccc',
    marginHorizontal: 20,
  },
  button: {
    backgroundColor: '#00b0ff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
