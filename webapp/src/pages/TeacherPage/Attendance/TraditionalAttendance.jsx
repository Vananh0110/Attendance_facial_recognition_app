import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Table, Button, Tag, Select, Modal, Avatar, Input, List, Card, Image, message } from 'antd';
import { UserOutlined, SearchOutlined } from '@ant-design/icons';
import Layout from '../../../components/Teacher/Layout';
import { axiosMain, axiosFlask } from '../../../api/axios';
import '../../../App.css';

const { Option } = Select;
const BASE_URL = process.env.REACT_APP_BASE_URL;

const TraditionalAttendance = () => {
  const { classId } = useParams();
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [schedule, setSchedule] = useState([]);
  const [activeColumn, setActiveColumn] = useState(null);
  const [columnChanges, setColumnChanges] = useState({});
  const [pictures, setPictures] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchClassInfo();
  }, [classId]);

  const fetchClassInfo = async () => {
    const studentData = await axiosMain.get(`/studentClass/getStudentInClass/${classId}`);
    setStudents(studentData.data);

    const scheduleData = await axiosMain.get(`/class/${classId}/schedule`);
    setSchedule(scheduleData.data);
    console.log(scheduleData.data);

    const attendanceData = await axiosMain.get(`/attendance/class/${classId}`);
    console.log(attendanceData.data);
    const attendanceMap = {};
    attendanceData.data.forEach((att) => {
      const date = new Date(att.date_attended);
      const formattedDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
        .toISOString()
        .split('T')[0];
      const key = `${att.student_class_id}_${formattedDate}`;
      attendanceMap[key] = { status: att.status, attendance_id: att.attendance_id };
    });
    
    setAttendance(attendanceMap);
  };

  const goToReport = () => {
    navigate(`/teacher/report/classDetail/${classId}`);
  };

  const handleAttendanceChange = (studentClassId, date, value) => {
    const key = `${studentClassId}_${date}`;
    const currentStatus = attendance[key] ? attendance[key].status : '';
    if (currentStatus !== value) {
      setColumnChanges((prevChanges) => ({
        ...prevChanges,
        [key]: value,
      }));
    }
  };

  const activateColumn = (date) => {
    const isColumnPopulated = students.some(
      (student) => columnChanges[`${student.student_class_id}_${date}`] !== undefined
    );
    if (!isColumnPopulated) {
      const newColumnChanges = {};
      students.forEach((student) => {
        const key = `${student.student_class_id}_${date}`;
        if (newColumnChanges[key] === undefined) {
          newColumnChanges[key] = undefined;
        }
      });
      setColumnChanges(newColumnChanges);
    }
    setActiveColumn(date);
  };

  const setAllToPresent = (date) => {
    const updates = { ...columnChanges };
    students.forEach((student) => {
      const key = `${student.student_class_id}_${date}`;
      updates[key] = 'P';
    });
    setColumnChanges(updates);
  };

  const saveColumnAttendance = async () => {
    console.log('Saving changes:', columnChanges);
    const entries = Object.entries(columnChanges);
    if (entries.length === 0) {
      console.log('No changes to save');
      return;
    }
    
    for (let i = 0; i < entries.length; i++) {
      const [key, status] = entries[i];
      if (!status) continue;
      const [studentClassId, date] = key.split('_');
      const existingAttendance = attendance[key];
      const method = existingAttendance ? 'put' : 'post';
      const url = method === 'put' ? `/attendance/${existingAttendance.attendance_id}` : '/attendance';

      try {
        await axiosMain[method](url, {
          student_class_id: studentClassId,
          date_attended: date,
          time_attended: new Date().toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
          }),
          status,
          attendance_type: 'traditional',
        });
        setAttendance((prev) => ({ ...prev, [key]: { status, attendance_id: existingAttendance ? existingAttendance.attendance_id : undefined } }));
      } catch (error) {
        console.error(`Error saving attendance for ${key}:`, error);
        Modal.error({
          title: 'Error',
          content: `There was an error processing the attendance for ${date}.`,
        });
        break;
      }
    }
  
    setActiveColumn(null);
    setColumnChanges({});
  };
  
  const attendanceColors = {
    P: 'green',
    L: 'orange',
    A: 'cyan',
    UA: 'red',
  };

  const fetchPictures = async (studentId) => {
    try {
      const response = await axiosFlask.get(`/pictures/${studentId}`);
      setPictures(response.data);
      setIsModalVisible(true);
    } catch (error) {
      message.error('Failed to fetch pictures.');
    }
  };

  const handleAvatarClick = (student) => {
    setSelectedStudent(student);
    fetchPictures(student.student_id);
  };

  const columns = [
    {
      title: 'STT',
      key: 'index',
      fixed: 'left',
      width: 60,
      render: (text, record, index) => index + 1,
    },
    {
      title: 'Image',
      key: 'avatar',
      fixed: 'left',
      width: 60,
      render: (text, record) => (
        <Avatar
          src={record.avatar_url ? `${BASE_URL}${record.avatar_url}` : undefined}
          alt="avatar"
          size={50}
          style={{ verticalAlign: 'middle' }}
          icon={!record.avatar_url && <UserOutlined />}
          onClick={() => handleAvatarClick(record)}
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
      fixed: 'left',
      width: 180,
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search name"
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
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
          <Button onClick={() => clearFilters()} size="small" style={{ width: 90 }}>
            Reset
          </Button>
        </div>
      ),
      onFilter: (value, record) => record.username.toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: 'Student Code',
      dataIndex: 'student_code',
      key: 'student_code',
      fixed: 'left',
      width: 120,
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search student code"
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
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
          <Button onClick={() => clearFilters()} size="small" style={{ width: 90 }}>
            Reset
          </Button>
        </div>
      ),
      onFilter: (value, record) => record.student_code.toLowerCase().includes(value.toLowerCase()),
    },
    ...schedule.map((day) => ({
      title: (
        <>
          {day.date}
          <Button
            icon={<UserOutlined />}
            onClick={() => activateColumn(day.date)}
            style={{
              marginLeft: 8,
              padding: 0,
              border: 'none',
              backgroundColor: 'transparent',
            }}
          />
        </>
      ),
      key: day.date,
      width: 180,
      filters: [
        { text: 'P', value: 'P' },
        { text: 'L', value: 'L' },
        { text: 'A', value: 'A' },
        { text: 'UA', value: 'UA' },
      ],
      onFilter: (value, record) => {
        const key = `${record.student_class_id}_${day.date}`;
        return attendance[key] && attendance[key].status === value;
      },
      render: (text, record) => {
        const key = `${record.student_class_id}_${day.date}`;
        const currentValue =
          columnChanges[key] !== undefined ? columnChanges[key] : attendance[key] ? attendance[key].status : undefined;
        return activeColumn === day.date ? (
          <Select
            style={{ width: 120 }}
            onChange={(value) => {
              if (value !== currentValue) {
                handleAttendanceChange(record.student_class_id, day.date, value);
              }
            }}
            value={currentValue}
          >
            <Option value="P">P</Option>
            <Option value="L">L</Option>
            <Option value="A">A</Option>
            <Option value="UA">UA</Option>
          </Select>
        ) : attendance[key] ? (
          <Tag color={attendanceColors[attendance[key].status]}>{attendance[key].status}</Tag>
        ) : (
          '--/--'
        );
      },
    })),
  ];

  return (
    <Layout>
      <div className="container-fluid container-fluid-custom">
        <h4>Attendance</h4>
        <div className="mt-4 mb-3 d-flex justify-content-between">
          {activeColumn && (
            <div className="d-flex justify-content-end">
              <Button
                type="default"
                onClick={() => setAllToPresent(activeColumn)}
                className="me-2"
                style={{ borderRadius: '50%' }}
              >
                P
              </Button>
              <Button type="primary" onClick={saveColumnAttendance} className="ms-2">
                Save
              </Button>
            </div>
          )}
          <Button type="default" onClick={goToReport}>
            Go to Report
          </Button>
        </div>
        <Table
          dataSource={students}
          columns={columns}
          rowKey="id"
          scroll={{ x: 'max-content', y: 400 }}
          pagination={false}
        />
        <Modal
          visible={isModalVisible}
          title="Student Pictures"
          onCancel={() => setIsModalVisible(false)}
          footer={null}
        >
          <List
            grid={{ gutter: 16, column: 4 }}
            dataSource={pictures}
            renderItem={(item) => (
              <List.Item>
                <Card
                  cover={
                    <Image
                      src={`${process.env.REACT_APP_FLASK_BASE_URL}${item.url}`}
                      style={{ height: '200px', objectFit: 'cover' }}
                    />
                  }
                >
                  <Card.Meta title={item.name} />
                </Card>
              </List.Item>
            )}
          />
        </Modal>
      </div>
    </Layout>
  );
};

export default TraditionalAttendance;
