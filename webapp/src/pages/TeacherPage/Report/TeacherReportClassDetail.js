import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../../api/axios';
import { Table, Button, Tag, Avatar, Modal, Input } from 'antd';
import {
  UserOutlined,
  FileExcelOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import * as XLSX from 'xlsx';
import Layout from '../../../components/Teacher/Layout';
import '../../../App.css';

const BASE_URL = process.env.REACT_APP_BASE_URL;

const TeacherReportClassDetail = () => {
  const { classId } = useParams();
  const [students, setStudents] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [attendance, setAttendance] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    fetchClassInfo();
  }, [classId]);

  const fetchClassInfo = async () => {
    try {
      const responses = await Promise.all([
        axios.get(`/studentClass/getStudentInClass/${classId}`),
        axios.get(`/class/${classId}/schedule`),
        axios.get(`/attendance/class/${classId}`),
      ]);
      setStudents(responses[0].data);
      setSchedule(responses[1].data);

      const attendanceMap = {};
      responses[2].data.forEach((att) => {
        const date = new Date(att.date_attended);
        const formattedDate = new Date(
          date.getTime() - date.getTimezoneOffset() * 60000
        )
          .toISOString()
          .split('T')[0];
        const key = `${att.student_class_id}_${formattedDate}`;
        attendanceMap[key] = att.status;
      });
      setAttendance(attendanceMap);
    } catch (error) {
      Modal.error({
        title: 'Error',
        content: 'There was an error fetching the class information.',
      });
    }
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      students.map((student, index) => ({
        STT: index + 1,
        Name: student.username,
        'Student Code': student.student_code,
        ...schedule.reduce((acc, day) => {
          const key = `${student.student_class_id}_${day.date}`;
          acc[day.date] = attendance[key] || '--/--';
          return acc;
        }, {}),
      }))
    );

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Attendance Data');
    XLSX.writeFile(wb, 'AttendanceData.xlsx');
  };

  const goToAttendance = () => {
    navigate(`/teacher/attendance/classDetail/${classId}/traditional`);
  };

  const attendanceColors = {
    P: 'green',
    L: 'orange',
    A: 'cyan',
    UA: 'red',
  };

  const columns = [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'index',
      fixed: 'left',
      render: (text, record, index) => index + 1,
      width: 60,
    },
    {
      title: 'Image',
      key: 'avatar',
      fixed: 'left',
      width: 60,
      render: (text, record) => (
        <Avatar
          src={
            record.avatar_url ? `${BASE_URL}${record.avatar_url}` : undefined
          }
          alt="avatar"
          size={50}
          style={{ verticalAlign: 'middle' }}
          icon={!record.avatar_url && <UserOutlined />}
          onError={() => false}
        />
      ),
    },
    {
      title: 'Name',
      dataIndex: 'username',
      key: 'username',
      fixed: 'left',
      width: 180,
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search student code"
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() => confirm()}
            style={{ width: 188, marginBottom: 8, display: 'block' }}
          />
          <Button
            type="primary"
            onClick={() => confirm()}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90, marginRight: 8 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters()}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </div>
      ),
      onFilter: (value, record) =>
        record.username.toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: 'Student Code',
      dataIndex: 'student_code',
      key: 'student_code',
      fixed: 'left',
      width: 120,
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search student code"
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() => confirm()}
            style={{ width: 188, marginBottom: 8, display: 'block' }}
          />
          <Button
            type="primary"
            onClick={() => confirm()}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90, marginRight: 8 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters()}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </div>
      ),
      onFilter: (value, record) =>
        record.student_code.toLowerCase().includes(value.toLowerCase()),
    },
    ...schedule.map((day) => ({
      title: day.date,
      dataIndex: day.date,
      key: day.date,
      width: 150,
      filters: [
        { text: 'P', value: 'P' },
        { text: 'L', value: 'L' },
        { text: 'A', value: 'A' },
        { text: 'UA', value: 'UA' },
      ],
      onFilter: (value, record) => {
        const key = `${record.student_class_id}_${day.date}`;
        return attendance[key] === value;
      },
      render: (text, record) => {
        const key = `${record.student_class_id}_${day.date}`;
        const status = attendance[key] || '--/--';
        return <Tag color={attendanceColors[status]}>{status}</Tag>;
      },
    })),
  ];

  return (
    <Layout>
      <div className="container-fluid container-fluid-custom">
        <h4>View Attendance</h4>
        <div className="d-flex justify-content-end mt-3 mb-4">
          <Button
            icon={<FileExcelOutlined />}
            onClick={exportToExcel}
            type="primary"
            className="me-2"
          >
            Export to Excel
          </Button>

          <Button onClick={goToAttendance} type="default">
            Go to Attendance
          </Button>
        </div>
        <Table
          dataSource={students}
          columns={columns}
          rowKey="id"
          pagination={false}
          scroll={{ x: 'max-content', y: 400 }}
        />
      </div>
    </Layout>
  );
};

export default TeacherReportClassDetail;
