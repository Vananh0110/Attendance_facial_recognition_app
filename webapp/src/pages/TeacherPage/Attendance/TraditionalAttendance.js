import React, { useState, useEffect } from 'react';
import Layout from '../../../components/Teacher/Layout';
import '../../../App.css';
import axios from '../../../api/axios';
import { useParams } from 'react-router-dom';
import { Avatar, Table } from 'antd';
import { UserOutlined} from '@ant-design/icons';
const TraditionalAttendance = () => {
  const { classId } = useParams();
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get(
        `/studentClass/getStudentInClass/${classId}`
      );
      setStudents(response.data);
    } catch (error) {
      console.error('Failed to fetch students in class: ', error);
    }
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
        key: 'student_code'
    },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status'
    }
  ];
  return (
    <Layout>
      <div className="container-fluid container-fluid-custom">
        <h4>Traditional Attendance</h4>
        <Table
          columns={columns()}
          dataSource={students.map((student, index) => ({
            ...student,
            key: index,
          }))}
          rowKey="student_class_id"
        />
      </div>
    </Layout>
  );
};

export default TraditionalAttendance;
