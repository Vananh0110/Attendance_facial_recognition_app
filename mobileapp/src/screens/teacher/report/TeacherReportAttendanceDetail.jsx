import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import {
  Appbar,
  DataTable,
  Provider,
  ActivityIndicator,
  Card,
  Portal,
  Modal,
  Avatar,
  Button
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import axios from '../../../api/axios';
import moment from 'moment';

const TeacherReportAttendanceDetail = ({ route }) => {
  const { classId, date } = route.params;
  const navigation = useNavigation();
  const [students, setStudents] = useState([]);
  const [attendanceData, setAttendanceData] = useState({});
  const [loading, setLoading] = useState(true);
  const [attendanceTime, setAttendanceTime] = useState('');
  const [summary, setSummary] = useState({
    P: 0,
    L: 0,
    A: 0,
    UA: 0,
  });
  const [visible, setVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

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
        `/attendance/class/${classId}/${moment(date).format('YYYY-MM-DD')}`
      );
      if (attendanceResponse.data.length > 0) {
        const newAttendance = {};
        let newSummary = { P: 0, L: 0, A: 0, UA: 0 };
        attendanceResponse.data.forEach((att) => {
          newAttendance[att.student_class_id] = {
            status: att.status,
            attendance_id: att.attendance_id,
          };
          newSummary[att.status]++;
        });
        setAttendanceData(newAttendance);
        setSummary(newSummary);
        setAttendanceTime(attendanceResponse.data[0].time_attended);
      }
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setLoading(false);
    }
  };

  const totalStudents = students.length;

  const showModal = (student) => {
    setSelectedStudent(student);
    setVisible(true);
  };

  const hideModal = () => {
    setVisible(false);
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
            title="Attendance Details"
            titleStyle={styles.titleStyle}
          />
        </Appbar.Header>
        <View style={styles.container}>
          {loading ? (
            <ActivityIndicator animating={true} color="#00B0FF" />
          ) : (
            <View style={styles.cardContainer}>
              <Card style={styles.summaryCard}>
                <Card.Content>
                  <Text style={styles.summaryText}>
                    <Text style={styles.summaryTextTitle}>Date Attended: </Text>
                    {moment(date).format('DD/MM/YYYY')}
                  </Text>
                  <Text style={styles.summaryText}>
                    <Text style={styles.summaryTextTitle}>Time Attended: </Text>
                    {moment(attendanceTime, 'HH:mm:ss').format('HH:mm')}
                  </Text>
                  <Text style={styles.summaryText}>
                    <Text style={styles.summaryTextTitle}>Students: </Text>
                    {totalStudents}
                  </Text>
                  <Text style={styles.summaryText}>
                    <Text style={styles.summaryTextTitle}>P: </Text>
                    {summary.P}/{totalStudents}
                  </Text>
                  <Text style={styles.summaryText}>
                    <Text style={styles.summaryTextTitle}>L: </Text> {summary.L}
                    /{totalStudents}
                  </Text>
                  <Text style={styles.summaryText}>
                    <Text style={styles.summaryTextTitle}>A: </Text>
                    {summary.A}/{totalStudents}
                  </Text>
                  <Text style={styles.summaryText}>
                    <Text style={styles.summaryTextTitle}>UA: </Text>
                    {summary.UA}/{totalStudents}
                  </Text>
                </Card.Content>
              </Card>
              <ScrollView>
                <DataTable>
                  <DataTable.Header>
                    <DataTable.Title style={{ flex: 1 }}>No.</DataTable.Title>
                    <DataTable.Title
                      style={{ flex: 4, justifyContent: 'center' }}
                    >
                      Name
                    </DataTable.Title>
                    <DataTable.Title
                      style={{ flex: 2, justifyContent: 'center' }}
                    >
                      ID
                    </DataTable.Title>
                    <DataTable.Title
                      style={{ flex: 2, justifyContent: 'center' }}
                    >
                      Status
                    </DataTable.Title>
                  </DataTable.Header>
                  {students.map((student, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => showModal(student)}
                    >
                      <DataTable.Row key={student.student_class_id}>
                        <DataTable.Cell style={{ flex: 1 }}>
                          {index + 1}
                        </DataTable.Cell>
                        <DataTable.Cell style={{ flex: 4 }}>
                          {student.username}
                        </DataTable.Cell>
                        <DataTable.Cell
                          style={{ flex: 2, justifyContent: 'center' }}
                        >
                          {student.student_code}
                        </DataTable.Cell>
                        <DataTable.Cell
                          style={{ flex: 2, justifyContent: 'center' }}
                        >
                          {attendanceData[student.student_class_id]?.status ||
                            'N/A'}
                        </DataTable.Cell>
                      </DataTable.Row>
                    </TouchableOpacity>
                  ))}
                </DataTable>
              </ScrollView>
            </View>
          )}
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
        </View>
      </Provider>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 10,
  },
  titleStyle: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  cardContainer: {
    marginTop: 20,
    marginBottom: 30,
  },
  summaryCard: {
    marginHorizontal: 20,
    backgroundColor: '#d3e3ff',
  },
  summaryText: {
    fontSize: 14,
    marginBottom: 10,
  },
  summaryTextTitle: {
    fontWeight: 'bold',
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
});

export default TeacherReportAttendanceDetail;
