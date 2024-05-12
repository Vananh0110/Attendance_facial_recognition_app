import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../../../api/axios';
import { Table, Button, Tag, Select, Modal } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import Layout from '../../../components/Teacher/Layout';
import '../../../App.css';

const { Option } = Select;

const TraditionalAttendance = () => {
  const { classId } = useParams();
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [schedule, setSchedule] = useState([]);
  const [activeColumn, setActiveColumn] = useState(null);
  const [columnChanges, setColumnChanges] = useState({});

  useEffect(() => {
    fetchClassInfo();
  }, [classId]);

  const fetchClassInfo = async () => {
    const studentData = await axios.get(
      `/studentClass/getStudentInClass/${classId}`
    );
    setStudents(studentData.data);

    const scheduleData = await axios.get(`/class/${classId}/schedule`);
    setSchedule(scheduleData.data);

    const attendanceData = await axios.get(`/attendance/class/${classId}`);
    const attendanceMap = {};
    attendanceData.data.forEach((att) => {
      const date = new Date(att.date_attended);
      console.log(date);
      const formattedDate = new Date(
        new Date(date).getTime() - new Date().getTimezoneOffset() * 60000
      )
        .toISOString()
        .split('T')[0];
      console.log(formattedDate);
      const key = `${att.student_class_id}_${formattedDate}`;
      attendanceMap[key] = att.status;
    });
    setAttendance(attendanceMap);
    console.log(attendanceMap);
  };

  const handleAttendanceChange = (studentClassId, date, status) => {
    setColumnChanges({
      ...columnChanges,
      [`${studentClassId}_${date}`]: status,
    });
  };

  const saveColumnAttendance = async () => {
    const entries = Object.entries(columnChanges);
    for (let i = 0; i < entries.length; i++) {
      const [key, status] = entries[i];
      const [studentClassId, date] = key.split('_');
      const timeAttended = new Date().toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
      });
      console.log(studentClassId, date, timeAttended, status);
      try {
        await axios.post('/attendance', {
          student_class_id: studentClassId,
          date_attended: date,
          time_attended: timeAttended,
          status,
        });

        setAttendance((prev) => ({ ...prev, [key]: status }));
      } catch (error) {
        Modal.error({
          title: 'Error',
          content: `There was an error recording the attendance for ${date}.`,
        });
        break;
      }
    }
    setActiveColumn(null);
    setColumnChanges({});
  };

  const columns = [
    {
      title: 'No',
      dataIndex: 'index',
      key: 'index',
      render: (text, record, index) => index + 1,
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
    ...schedule.map((day) => ({
      title: (
        <>
          {day.date}
          <Button
            icon={<UserOutlined />}
            onClick={() =>
              setActiveColumn(day.date === activeColumn ? null : day.date)
            }
            style={{ marginLeft: 8, padding: 0 }}
          />
        </>
      ),
      key: day.date,
      render: (text, record) => {
        const key = `${record.student_class_id}_${day.date}`;
        if (activeColumn === day.date) {
          return (
            <Select
              defaultValue={columnChanges[key] || attendance[key] || 'P'}
              style={{ width: 120 }}
              onChange={(value) =>
                handleAttendanceChange(record.student_class_id, day.date, value)
              }
            >
              <Option value="P">P</Option>
              <Option value="L">L</Option>
              <Option value="A">A</Option>
              <Option value="UA">UA</Option>
            </Select>
          );
        }
        return attendance[key] ? (
          <Tag color={attendance[key] === 'P' ? 'green' : 'volcano'}>
            {attendance[key]}
          </Tag>
        ) : (
          '--/--'
        );
      },
    })),
  ];

  return (
    <Layout>
      <div className="container-fluid container-fluid-custom">
        <h4>Traditional Attendance</h4>
        <Table dataSource={students} columns={columns} rowKey="id" />
        {activeColumn && (
          <Button
            type="primary"
            onClick={saveColumnAttendance}
            style={{ marginTop: 16 }}
          >
            Save Changes
          </Button>
        )}
      </div>
    </Layout>
  );
};

export default TraditionalAttendance;
