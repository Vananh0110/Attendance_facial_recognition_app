import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {
  Appbar,
  DataTable,
  Provider,
  Portal,
  Avatar,
  Button,
  Menu,
  Modal,
  Searchbar,
  Dialog,
  Paragraph,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import axios from '../../api/axios';
import { Dropdown } from 'react-native-element-dropdown';
import moment from 'moment';

const TraditionalAttendance = ({ route }) => {
  const { classId, date } = route.params;
  const navigation = useNavigation();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [visible, setVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [attendance, setAttendance] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const studentsResponse = await axios.get(
        `/studentClass/getStudentInClass/${classId}`
      );
      setStudents(studentsResponse.data);
      const attendanceResponse = await axios.get(
        `/attendance/class/${classId}/${date}`
      );
      if (attendanceResponse.data.length > 0) {
        const newAttendance = {};
        attendanceResponse.data.forEach((att) => {
          newAttendance[att.student_class_id] = {
            status: att.status,
            attendance_id: att.attendance_id,
          };
        });
        setAttendance(newAttendance);
        setEditMode(true);
      } else {
        setEditMode(false);
      }
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setLoading(false);
    }
  };

  const showModal = (student) => {
    setSelectedStudent(student);
    setVisible(true);
  };

  const hideModal = () => {
    setVisible(false);
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  const filteredStudents = students.filter(
    (student) =>
      student.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.student_code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const statusOptions = [
    { label: 'P', value: 'P' },
    { label: 'L', value: 'L' },
    { label: 'A', value: 'A' },
    { label: 'UA', value: 'UA' },
  ];

  const handleStatusChange = (studentClassId, value) => {
    setAttendance({
      ...attendance,
      [studentClassId]: { ...attendance[studentClassId], status: value },
    });
  };

  const setAllToP = () => {
    const newAttendance = {};
    students.forEach((student) => {
      newAttendance[student.student_class_id] = {
        ...attendance[student.student_class_id],
        status: 'P',
      };
    });
    setAttendance(newAttendance);
  };

  const formatDate = (date) => {
    return moment(date).format('YYYY-MM-DD');
  };

  const submitAttendance = async () => {
    const timeAttended = moment().format('HH:mm');
    const dateAttended = formatDate(date);
    console.log('Date attended:', dateAttended);
    console.log('Time attended:', timeAttended);
    console.log('Attendance data before sending:', attendance);

    let isAllSuccess = true;

    for (const studentClassId in attendance) {
      const { status, attendance_id } = attendance[studentClassId];
      const attendanceData = {
        student_class_id: studentClassId,
        status: status,
        date_attended: dateAttended,
        time_attended: timeAttended,
      };

      try {
        if (editMode && attendance_id) {
          await axios.put(`/attendance/${attendance_id}`, attendanceData);
        } else {
          console.log(
            `Submitting new attendance for studentClassId: ${studentClassId}`
          );
          await axios.post('/attendance', attendanceData);
        }
      } catch (error) {
        console.error(
          `Error processing attendance for studentClassId ${studentClassId}:`,
          error
        );
        isAllSuccess = false;
      }
    }

    if (isAllSuccess) {
      setDialogMessage('Attendance has been successfully updated.');
    } else {
      setDialogMessage('Some entries failed to update.');
    }
    setDialogVisible(true);
  };

  const renderItem = (item) => {
    return (
      <View style={styles.itemStyle}>
        <Text style={styles.itemTextStyle}>{item.label}</Text>
      </View>
    );
  };

  const navigateToReport = () => {
    navigation.navigate('TeacherReportAttendanceDetail', {
      classId: classId,
      date: date,
    });
  };

  return (
    <>
      <Provider>
        <Appbar.Header style={{ backgroundColor: '#00B0FF' }}>
          <Appbar.BackAction
            onPress={() => navigation.goBack()}
            color="#ffffff"
          />
          <Appbar.Content
            title="Traditional Attendance"
            titleStyle={styles.titleStyle}
          />
          <Appbar.Action
            icon="chart-bar"
            color="#ffffff"
            onPress={() => navigateToReport()}
          />
        </Appbar.Header>
        <View style={styles.headerContainer}>
          <Searchbar
            placeholder="Search students"
            onChangeText={handleSearchChange}
            value={searchQuery}
            style={styles.searchBar}
            inputStyle={styles.searchInputStyle}
          />
          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              style={styles.buttonP}
              labelStyle={{ color: '#00B0FF' }}
              onPress={setAllToP}
              rippleColor="#d3e3ff"
            >
              P
            </Button>
            <Button
              mode="contained"
              style={styles.button}
              onPress={submitAttendance}
            >
              Save
            </Button>
          </View>
        </View>
        <ScrollView style={styles.container}>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title style={{ flex: 1 }}>No.</DataTable.Title>
              <DataTable.Title style={{ flex: 4 }}>Name</DataTable.Title>
              <DataTable.Title style={{ flex: 2 }}>ID</DataTable.Title>
              <DataTable.Title style={{ flex: 2 }}>Status</DataTable.Title>
            </DataTable.Header>
            {filteredStudents.map((student, index) => (
              <TouchableOpacity key={index} onPress={() => showModal(student)}>
                <DataTable.Row>
                  <DataTable.Cell style={{ flex: 1 }}>
                    {index + 1}
                  </DataTable.Cell>
                  <DataTable.Cell style={{ flex: 4 }}>
                    {student.username}
                  </DataTable.Cell>
                  <DataTable.Cell style={{ flex: 2 }}>
                    {student.student_code}
                  </DataTable.Cell>

                  <DataTable.Cell style={{ flex: 2 }}>
                    <View style={styles.selectContainer}>
                      <Dropdown
                        style={styles.dropdown}
                        containerStyle={styles.dropdownContainer}
                        selectedTextStyle={styles.selectedTextStyle}
                        data={statusOptions}
                        activeColor="#f0f0f0"
                        placeholder=""
                        labelField="label"
                        valueField="value"
                        value={attendance[student.student_class_id]?.status}
                        onChange={(item) =>
                          handleStatusChange(
                            student.student_class_id,
                            item.value
                          )
                        }
                        renderItem={renderItem}
                      />
                    </View>
                  </DataTable.Cell>
                </DataTable.Row>
              </TouchableOpacity>
            ))}
          </DataTable>

          <Portal>
            <Dialog
              visible={dialogVisible}
              onDismiss={() => setDialogVisible(false)}
              style={styles.dialogStyle}
            >
              <Dialog.Title>Notification</Dialog.Title>
              <Dialog.Content>
                <Paragraph>{dialogMessage}</Paragraph>
              </Dialog.Content>
              <Dialog.Actions>
                <Button
                  onPress={() => setDialogVisible(false)}
                  labelStyle={{ color: '#00b0ff' }}
                  rippleColor="#d3e3ff"
                >
                  OK
                </Button>
              </Dialog.Actions>
            </Dialog>
            <Modal
              visible={visible}
              onDismiss={hideModal}
              contentContainerStyle={styles.modalContentContainer}
            >
              <View style={styles.modalContent}>
                <View style={{ alignItems: 'center', marginBottom: 10 }}>
                  {selectedStudent?.avatar_url ? (
                    <Avatar.Image
                      size={100}
                      source={{ uri: selectedStudent.avatar_url }}
                    />
                  ) : (
                    <Avatar.Text
                      size={100}
                      label={selectedStudent?.username[0]}
                      style={{ backgroundColor: '#00B0FF' }}
                    />
                  )}
                </View>
                <View style={{ paddingLeft: 20 }}>
                  <Text style={styles.textModal}>
                    Name: {selectedStudent?.username}
                  </Text>
                  <Text style={styles.textModal}>
                    Student ID: {selectedStudent?.student_code}
                  </Text>
                  <Text style={styles.textModal}>
                    Class: {selectedStudent?.student_class}
                  </Text>
                  <Text style={styles.textModal}>
                    Email: {selectedStudent?.email}
                  </Text>
                  <Text style={styles.textModal}>
                    Gender: {selectedStudent?.gender}
                  </Text>
                </View>
                <Button
                  labelStyle={{ color: '#00B0FF' }}
                  onPress={hideModal}
                  rippleColor="#d3e3ff"
                >
                  Close
                </Button>
              </View>
            </Modal>
          </Portal>
        </ScrollView>
      </Provider>
    </>
  );
};

export default TraditionalAttendance;

const styles = StyleSheet.create({
  headerContainer: {
    padding: 10,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#ffffff',
  },
  titleStyle: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  searchBar: {
    marginTop: 10,
    marginBottom: 10,
    marginHorizontal: 9,
    fontSize: 14,
    backgroundColor: '#eae8e8',
  },
  searchInputStyle: {
    fontSize: 14,
  },
  modalContentContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    margin: 20,
    padding: 10,
  },
  modalContent: {
    margin: 20,
    padding: 5,
  },
  textModal: {
    marginBottom: 10,
  },
  selectContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdown: {
    backgroundColor: 'transparent',
    height: 40,
    width: 65,
    fontSize: 14,
    color: '#111827cc',
    borderWidth: 1.5,
    borderRadius: 15,
    borderColor: '#11182711',
    paddingLeft: 16,
  },
  dropdownContainer: {
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  itemStyle: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#e1e1e1',
    alignItems: 'center',
  },
  itemTextStyle: {
    fontSize: 14,
    color: '#333',
  },
  selectedTextStyle: {
    fontSize: 14,
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  button: {
    backgroundColor: '#00b0ff',
  },
  buttonP: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#00b0ff',
  },
  dialogStyle: {
    backgroundColor: '#ffffff',
  },
});
