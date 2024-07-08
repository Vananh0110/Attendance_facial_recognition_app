import React, { useState, useEffect } from 'react';
import Layout from '../../../components/Teacher/Layout';
import '../../../App.css';
import { useNavigate, useParams } from 'react-router-dom';
import {axiosMain} from '../../../api/axios';
import {
  Table,
  message,
  Avatar,
  Row,
  Col,
  Input,
  Modal,
  Button,
  Select,
} from 'antd';
import { UserOutlined } from '@ant-design/icons';
import moment from 'moment';

const BASE_URL = process.env.REACT_APP_BASE_URL;

const { Option } = Select;

const TeacherAttendanceClassDetail = () => {
  const { classId } = useParams();
  const [classInfo, setClassInfo] = useState(null);
  const [students, setStudents] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [isAttendanceModalVisible, setAttendanceModalVisible] = useState(false);
  const [isScheduleModalVisible, setScheduleModalVisible] = useState(false);
  const [schedule, setSchedule] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  
  const navigate = useNavigate();
  useEffect(() => {
    fetchClassInfo();
    fetchStudents();
    fetchSchedule();
  }, [classId]);
  const fetchClassInfo = async () => {
    try {
      const response = await axiosMain.get(`/class/${classId}`);
      setClassInfo(response.data);
    } catch (error) {
      console.error('Fail to fetch class info', error);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await axiosMain.get(
        `/studentClass/getStudentInClass/${classId}`
      );
      setStudents(response.data);
    } catch (error) {
      console.error('Fail to fetch students', error);
    }
  };

  const fetchSchedule = async () => {
    try {
      const scheduleData = await axiosMain.get(
        `/class/${classId}/schedule`
      );
      setSchedule(scheduleData.data);
    } catch (error) {
      console.error('Fail to fetch schedule', error);
    }
  };

  const showAttendanceModal = () => {
    setAttendanceModalVisible(true);
  };

  const formatDate = (date) => {
    return moment(date).format('DD/MM/YYYY');
  };

  const handleDateChange = (value) => {
    setSelectedDate(value);
  };

  const handleFaceRecognitionClick = () => {
    setAttendanceModalVisible(false);
    setScheduleModalVisible(true);
  };

  const handleNavigateToFaceRecognition = () => {
    if (selectedDate) {
      navigate(`/teacher/attendance/classDetail/${classId}/${selectedDate}/facerecognition`);
    } else {
      message.error('Please select a date');
    }
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

  const handleSearch = (e) => {
    setSearchText(e.target.value.toLowerCase());
  };

  const filteredStudents = students.filter((student) => {
    return (
      student.username.toLowerCase().includes(searchText) ||
      student.email.toLowerCase().includes(searchText) ||
      student.student_class.toLowerCase().includes(searchText) ||
      student.gender.toLowerCase().includes(searchText) ||
      student.student_code.includes(searchText)
    );
  });

  const columns = () => [
    {
      title: 'STT',
      key: 'index',
      render: (text, record, index) => index + 1,
    },
    {
      title: 'Image',
      key: 'avatar',
      render: (text, record) => (
        <Avatar
          src={
            record.avatar_url ? `${BASE_URL}${record.avatar_url}` : undefined
          }
          alt="avatar"
          size={50}
          style={{ verticalAlign: 'middle' }}
          icon={!record.avatar_url && <UserOutlined />}
          onError={() => {
            return false;
          }}
        />
      ),
    },
    {
      title: 'Name',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Student Code',
      dataIndex: 'student_code',
      key: 'student_code',
    },
    {
      title: 'Student Class',
      dataIndex: 'student_class',
      key: 'student_class',
    },
    {
      title: 'gender',
      dataIndex: 'gender',
      key: 'gender',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
  ];

  return (
    <Layout>
      <div className="container-fluid container-fluid-custom">
        <h4>Class Detail </h4>
        <div className="container mt-4 mb-4">
          <Row className="mb-3">
            <Col span={4}></Col>
            <Col span={2}>
              <b>Class Code:</b>
            </Col>
            <Col span={6}>{classInfo?.class_code}</Col>
            <Col span={2}>
              <b>Date Start:</b>
            </Col>
            <Col span={6}>{formatDate(classInfo?.date_start)}</Col>
            <Col span={4}></Col>
          </Row>
          <Row className="mb-3">
            <Col span={4}></Col>
            <Col span={2}>
              <b>Course:</b>
            </Col>
            <Col span={6}>
              {classInfo?.course_code} - {classInfo?.course_name}
            </Col>
            <Col span={2}>
              <b>Date Finish:</b>
            </Col>
            <Col span={6}>{formatDate(classInfo?.date_finish)}</Col>
            <Col span={4}></Col>
          </Row>

          <Row className="mb-3">
            <Col span={4}></Col>
            <Col span={2}>
              <b>Day of week:</b>
            </Col>
            <Col span={6}>{dayOfWeekAsText(classInfo?.day_of_week)}</Col>
            <Col span={2}>
              <b>Time:</b>
            </Col>
            <Col span={6}>
              {classInfo?.time_start} - {classInfo?.time_finish}
            </Col>
            <Col span={4}></Col>
          </Row>
          <Row className="mb-3">
            <Col span={4}></Col>
            <Col span={2}>
              <b>Teacher:</b>
            </Col>
            <Col span={6}>{classInfo?.username}</Col>
            <Col span={2}>
              <b>Students:</b>
            </Col>
            <Col span={6}>{students.length}</Col>
            <Col span={4}></Col>
          </Row>
        </div>
        <div className="mt-3">
          <h5>List of students</h5>
          <div className="mt-3 mb-4 d-flex justify-content-between">
            <div>
              <Button type="primary" onClick={showAttendanceModal}>
                Attendance
              </Button>
            </div>
            <div>
              <Input.Search
                placeholder="Search by name, email, phone, student code, class or gender"
                onChange={handleSearch}
                style={{ width: 400 }}
              />
            </div>
          </div>
        </div>
        <Table
          columns={columns()}
          dataSource={filteredStudents.map((student, index) => ({
            ...student,
            key: index,
          }))}
          rowKey="student_class_id"
        />
      </div>
      <Modal
        title="Select Attendance Method"
        visible={isAttendanceModalVisible}
        onCancel={() => setAttendanceModalVisible(false)}
        footer={null}
      >
        <Button
          block
          style={{ marginBottom: '10px' }}
          onClick={() =>
            navigate(`/teacher/attendance/classDetail/${classId}/traditional`)
          }
        >
          Traditional Attendance
        </Button>
        <Button
          block
          style={{ marginBottom: '10px' }}
          onClick={() =>
            navigate(`/teacher/attendance/classDetail/${classId}/qrcode`)
          }
        >
          QR Code Attendance
        </Button>
        <Button
          block
          onClick={handleFaceRecognitionClick}
        >
          Face Recognition Attendance
        </Button>
      </Modal>
      <Modal
        title="Select Date for Face Recognition Attendance"
        visible={isScheduleModalVisible}
        onCancel={() => setScheduleModalVisible(false)}
        onOk={handleNavigateToFaceRecognition}
      >
        <Select
          placeholder="Select date"
          onChange={handleDateChange}
          style={{ width: '100%' }}
        >
          {schedule.map((item) => (
            <Option key={item.date} value={item.date}>
              {item.date}
            </Option>
          ))}
        </Select>
      </Modal>
    </Layout>
  );
};

export default TeacherAttendanceClassDetail;
