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
  Menu,
  List,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import axios from '../../../api/axios';
import moment from 'moment';
import { API_BASE_URL } from '@env';

const StudentDetailScreen = ({ route }) => {
  const { classId } = route.params;
  const { date } = route.params;
  const { userId } = route.params;
  const navigation = useNavigation();
  const [classInfo, setClassInfo] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [visible, setVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentClassId, setStudentClassId] = useState(null);

  useEffect(() => {
    fetchClassAndStudents();
  }, [classId]);

  const fetchClassAndStudents = async () => {
    try {
      setLoading(true);
      const classResponse = await axios.get(`/class/${classId}`);
      const studentsResponse = await axios.get(
        `/studentClass/getStudentInClass/${classId}`
      );
      setClassInfo(classResponse.data);
      setStudents(studentsResponse.data);
      const student = studentsResponse.data.find(
        (student) => student.user_id === userId
      );
      if (student) {
        setStudentClassId(student.student_class_id);
      }
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setError('Failed to load data, please try again.');
      setLoading(false);
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

  const navigateToQrScanner = () => {
    navigation.navigate('StudentQrCodeScanner', {
      classId,
      date,
      studentClassId,
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
            title="Class Detail"
            titleStyle={{
              fontSize: 18,
              color: '#ffffff',
              fontWeight: 'bold',
            }}
          />
          <Appbar.Action
            icon="qrcode-scan"
            color="#ffffff"
            onPress={navigateToQrScanner}
          />
        </Appbar.Header>

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
            <DataTable>
              <DataTable.Header>
                <DataTable.Title style={{ flex: 1 }}>No.</DataTable.Title>
                <DataTable.Title style={{ flex: 4 }}>Name</DataTable.Title>
                <DataTable.Title style={{ flex: 2 }}>ID</DataTable.Title>
              </DataTable.Header>
              {students.map((student, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => showModal(student)}
                >
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
    padding: 10,
  },
  modalContent: {
    margin: 20,
    padding: 5,
  },
  textModal: {
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  textAttendance: {
    fontSize: 14,
  },
});

export default StudentDetailScreen;
