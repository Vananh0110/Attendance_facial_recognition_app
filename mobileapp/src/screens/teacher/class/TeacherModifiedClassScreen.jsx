import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {
  Appbar,
  Card,
  ActivityIndicator,
  DataTable,
  Modal,
  Portal,
  Provider,
  Avatar,
  Button,
  Checkbox,
  List,
  Searchbar,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import axios from '../../../api/axios';
import moment from 'moment';
import { API_BASE_URL } from '@env';

const TeacherModifiedClassScreen = ({ route }) => {
  const { classId } = route.params;
  const navigation = useNavigation();
  const [classInfo, setClassInfo] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [visible, setVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedStudents, setSelectedStudents] = useState(new Set());
  const [allStudents, setAllStudents] = useState([]);
  const [selectedStudentsToAdd, setSelectedStudentsToAdd] = useState(new Set());
  const [addStudentModalVisible, setAddStudentModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchClassInfo();
    fetchStudentsInClass();
    fetchAllStudents();
  }, [classId]);

  const fetchClassInfo = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/class/${classId}`);
      setClassInfo(response.data);
    } catch (error) {
      console.error('Failed to fetch class info:', error);
      setError('Failed to load class data, please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentsInClass = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `/studentClass/getStudentInClass/${classId}`
      );
      setStudents(response.data);
    } catch (error) {
      console.error('Failed to fetch students:', error);
      setError('Failed to load students, please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllStudents = async () => {
    try {
      const response = await axios.get('/student/all');
      setAllStudents(response.data);
    } catch (error) {
      console.error('Failed to fetch students:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.centeredView}>
        <ActivityIndicator animating={true} color="#00B0FF" />
      </View>
    );
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  const showModal = (student) => {
    setSelectedStudent(student);
    setVisible(true);
  };

  const hideModal = () => {
    setVisible(false);
  };

  const formatDate = (date) => {
    return moment(date).format('DD/MM/YYYY');
  };

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

  const toggleStudentSelection = (studentClassId, event) => {
    event.stopPropagation();
    const newSelectedStudents = new Set(selectedStudents);
    if (newSelectedStudents.has(studentClassId)) {
      newSelectedStudents.delete(studentClassId);
    } else {
      newSelectedStudents.add(studentClassId);
    }
    console.log(newSelectedStudents);
    setSelectedStudents(newSelectedStudents);
  };

  const handleRemoveStudents = async () => {
    for (let studentClassId of selectedStudents) {
      try {
        await axios.delete(`/studentClass/${studentClassId}`);
        console.log(`Deleted student_class_id ${studentClassId}`);
      } catch (error) {
        console.error('Error deleting student', error);
      }
    }
    fetchStudentsInClass();
    setSelectedStudents(new Set());
  };

  const openAddStudentModal = () => {
    setAddStudentModalVisible(true);
  };

  const closeAddStudentModal = () => {
    setAddStudentModalVisible(false);
  };

  const toggleStudentToAddSelection = (studentId) => {
    const newSelectedStudentsToAdd = new Set(selectedStudentsToAdd);
    if (newSelectedStudentsToAdd.has(studentId)) {
      newSelectedStudentsToAdd.delete(studentId);
    } else {
      newSelectedStudentsToAdd.add(studentId);
    }
    setSelectedStudentsToAdd(newSelectedStudentsToAdd);
  };

  const handleAddStudents = async () => {
    for (let studentId of selectedStudentsToAdd) {
      try {
        await axios.post('/studentClass', {
          class_id: classId,
          student_id: studentId,
        });
      } catch (error) {
        console.error('Error adding student to class:', error);
      }
    }
    fetchStudentsInClass();
    setAddStudentModalVisible(false);
    setSelectedStudentsToAdd(new Set());
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  const filteredStudents = allStudents.filter(
    (student) =>
      student.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.student_code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Appbar.Header style={{ backgroundColor: '#00B0FF' }}>
        <Appbar.BackAction
          onPress={() => navigation.goBack()}
          color="#ffffff"
        />
        <Appbar.Content
          title="Class Modified"
          titleStyle={{
            fontSize: 18,
            color: '#ffffff',
            fontWeight: 'bold',
          }}
        />
      </Appbar.Header>
      <Provider>
        <ScrollView style={styles.scrollContainer}>
          <View>
            <Card style={styles.card}>
              <Card.Title
                title={classInfo.course_name}
                titleStyle={styles.cardTitle}
              />
              <Card.Content style={{ paddingLeft: 20 }}>
                <Text style={styles.detailText}>
                  <Text style={styles.detailLabel}>Class: </Text>
                  {classInfo.class_code}
                </Text>
                <Text style={styles.detailText}>
                  <Text style={styles.detailLabel}>Course code: </Text>
                  {classInfo.course_code}
                </Text>
                <Text style={styles.detailText}>
                  <Text style={styles.detailLabel}>Teacher: </Text>
                  {classInfo.username}
                </Text>
                <Text style={styles.detailText}>
                  <Text style={styles.detailLabel}>Day of the week: </Text>
                  {dayOfWeekAsText(classInfo.day_of_week)}
                </Text>
                <Text style={styles.detailText}>
                  <Text style={styles.detailLabel}>Time: </Text>
                  {formatTime(classInfo.time_start)} -{' '}
                  {formatTime(classInfo.time_finish)}
                </Text>
                <Text style={styles.detailText}>
                  <Text style={styles.detailLabel}>Date start: </Text>
                  {formatDate(classInfo.date_start)}
                </Text>
                <Text style={styles.detailText}>
                  <Text style={styles.detailLabel}>Date finish: </Text>
                  {formatDate(classInfo.date_finish)}
                </Text>
              </Card.Content>
            </Card>
          </View>
          <View style={styles.studentsSection}>
            <Text style={styles.header}>
              List of Students ({students.length})
            </Text>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-around',
                marginTop: 10,
                marginBottom: 5,
              }}
            >
              <Button
                icon="account-plus"
                mode="contained"
                onPress={openAddStudentModal}
                style={{ backgroundColor: '#00b0ff' }}
              >
                Add Students
              </Button>
              <Button
                icon="delete"
                mode="contained"
                onPress={handleRemoveStudents}
                disabled={selectedStudents.size === 0}
                style={{
                  backgroundColor:
                    selectedStudents.size > 0 ? '#ff0000' : '#d4d1d1',
                }}
              >
                Remove Selected
              </Button>
            </View>
            <Portal>
              <Modal
                visible={addStudentModalVisible}
                onDismiss={closeAddStudentModal}
                contentContainerStyle={styles.modalContentContainer}
              >
                <Searchbar
                  placeholder="Search students"
                  onChangeText={handleSearchChange}
                  value={searchQuery}
                  style={styles.searchBar}
                  inputStyle={styles.searchInputStyle}
                />
                <ScrollView style={styles.modalAddScrollContainer}>
                  {filteredStudents.map((student, index) => (
                    <List.Item
                      key={student.student_id}
                      title={`${student.username} (${student.student_code})`}
                      titleStyle={{ fontSize: 14 }}
                      style={styles.listItemStyle}
                      left={() => (
                        <Checkbox
                          status={
                            selectedStudentsToAdd.has(student.student_id)
                              ? 'checked'
                              : 'unchecked'
                          }
                          color="#00b0ff"
                          onPress={() =>
                            toggleStudentToAddSelection(student.student_id)
                          }
                          disabled={students.some(
                            (s) => s.student_id === student.student_id
                          )}
                        />
                      )}
                    />
                  ))}
                </ScrollView>
                <View style={styles.fixedFooter}>
                  <Button
                    mode="contained"
                    onPress={handleAddStudents}
                    style={{ backgroundColor: '#00b0ff' }}
                  >
                    Confirm Add
                  </Button>
                </View>
              </Modal>
            </Portal>
            <DataTable>
              <DataTable.Header>
                <DataTable.Title style={{ flex: 1 }}>Select</DataTable.Title>
                <DataTable.Title style={{ flex: 4 }}>Name</DataTable.Title>
                <DataTable.Title style={{ flex: 2 }}>ID</DataTable.Title>
              </DataTable.Header>
              {students.map((student, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => showModal(student)}
                >
                  <DataTable.Row>
                    <DataTable.Cell>
                      <Checkbox
                        status={
                          selectedStudents.has(student.student_class_id)
                            ? 'checked'
                            : 'unchecked'
                        }
                        color="#00b0ff"
                        onPress={(event) =>
                          toggleStudentSelection(
                            student.student_class_id,
                            event
                          )
                        }
                      />
                    </DataTable.Cell>
                    <DataTable.Cell style={{ flex: 4 }}>
                      {student.username}
                    </DataTable.Cell>
                    <DataTable.Cell style={{ flex: 2 }}>
                      {student.student_code}
                    </DataTable.Cell>
                  </DataTable.Row>
                </TouchableOpacity>
              ))}
            </DataTable>
          </View>

          <Portal>
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
                      source={{ uri: `${API_BASE_URL}${selectedStudent.avatar_url}` }}
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

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 10,
  },
  card: {
    marginHorizontal: 16,
    elevation: 2,
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: '#d3e3ff',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  detailText: {
    fontSize: 14,
    textAlign: 'left',
    lineHeight: 24,
    marginTop: 8,
  },
  header: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  detailLabel: {
    fontWeight: 'bold',
  },
  studentsSection: {
    marginTop: 20,
    marginBottom: 30,
  },
  button: {
    marginTop: 10,
    backgroundColor: '#ddd',
    padding: 10,
  },
  modalContentContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    margin: 20,
    maxHeight: 400,
  },
  modalContent: {
    margin: 20,
    padding: 5,
  },
  textModal: {
    marginBottom: 10,
  },
  fixedFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    backgroundColor: '#ffffff',
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
  modalAddScrollContainer: {
    paddingLeft: 20,
  },
});

export default TeacherModifiedClassScreen;
