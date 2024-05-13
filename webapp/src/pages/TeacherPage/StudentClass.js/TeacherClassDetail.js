import React, { useState, useEffect } from 'react';
import Layout from '../../../components/Teacher/Layout';
import '../../../App.css';
import { useParams } from 'react-router-dom';
import axios from '../../../api/axios';
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
import { UserOutlined, DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';
import AddStudentToClassModal from '../../../components/Admin/StudentClass/AddStudentToClassModal';

const TeacherClassDetail = () => {
    const { classId } = useParams();
    const [classInfo, setClassInfo] = useState(null);
    const [students, setStudents] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [isModalVisible, setModalVisible] = useState(false);
  
    useEffect(() => {
      fetchClassInfo();
      fetchStudents();
    }, [classId]);
    const fetchClassInfo = async () => {
      try {
        const response = await axios.get(`/class/${classId}`);
        setClassInfo(response.data);
      } catch (error) {
        console.error('Fail to fetch class info', error);
      }
    };
  
    const fetchStudents = async () => {
      try {
        const response = await axios.get(
          `/studentClass/getStudentInClass/${classId}`
        );
        setStudents(response.data);
      } catch (error) {
        console.error('Fail to fetch students', error);
      }
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
  
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        setSelectedRowKeys(selectedRowKeys);
      },
    };
  
    const handleDeleteStudents = () => {
      Modal.confirm({
        title: 'Are you sure you want to delete these students?',
        content: 'This action cannot be undone.',
        onOk: async () => {
          try {
            for (const studentId of selectedRowKeys) {
              await axios.delete(`/studentClass/${studentId}`);
            }
            message.success('Deleted selected students successfully');
            fetchStudents();
            setSelectedRowKeys([]);
          } catch (error) {
            message.error('Failed to delete some students');
            console.error('Error deleting students:', error);
          }
        },
      });
    };
  
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
            src={record.avatar_url ? record.avatar_url : undefined}
            alt="avatar"
            size={50}
            style={{ verticalAlign: 'middle' }}
            icon={<UserOutlined />}
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
                <Button
                  className="me-3"
                  type="primary"
                  onClick={() => setModalVisible(true)}
                >
                  Add Students
                </Button>
                <Button
                  danger
                  onClick={handleDeleteStudents}
                  disabled={!selectedRowKeys.length}
                  icon={<DeleteOutlined />}
                >
                  Delete Selected Students
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
            rowSelection={rowSelection}
            columns={columns()}
            dataSource={filteredStudents.map((student, index) => ({
              ...student,
              key: index,
            }))}
            rowKey="student_class_id"
          />
          <AddStudentToClassModal
            visible={isModalVisible}
            onClose={() => {
              setModalVisible(false);
              fetchStudents();
            }}
            classId={classId}
          />
        </div>
      </Layout>
    );
  };

export default TeacherClassDetail;
