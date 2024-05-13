import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../../components/Teacher/Layout';
import '../../../App.css';
import axios from '../../../api/axios';
import moment from 'moment';
import {
  message,
  Table,
  Card,
  Button,
  Switch,
  Tooltip,
  Row,
  Col,
  Input,
} from 'antd';

const TeacherReportPage = () => {
  const [classes, setClasses] = useState([]);
  const [viewMode, setViewMode] = useState('table');
  const [searchText, setSearchText] = useState('');
  const [filteredClasses, setFilteredClasses] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    setFilteredClasses(
      classes.filter((cls) =>
        `${cls.class_code} ${cls.course_code} ${cls.course_name} ${cls.username}`
          .toLowerCase()
          .includes(searchText.toLowerCase())
      )
    );
  }, [classes, searchText]);

  const fetchClasses = async () => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    const userId = user.user_id;
    try {
      const response = await axios.get('/class/all');

      const filteredData = response.data.filter(
        (cls) => cls.user_id === userId
      );
      console.log(filteredData);
      setClasses(filteredData);
    } catch (error) {
      message.error('Failed to fetch classes.');
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

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  const navigateToClassDetail = (classId) => {
    navigate(`/teacher/report/classDetail/${classId}`);
  };

  const getColumns = () => [
    { title: 'ID', dataIndex: 'class_id', key: 'class_id' },
    { title: 'Class Code', dataIndex: 'class_code', key: 'class_code' },
    { title: 'Course Code', dataIndex: 'course_code', key: 'course_code' },
    { title: 'Course Name', dataIndex: 'course_name', key: 'course_name' },
    { title: 'Teacher', dataIndex: 'username', key: 'username' },
    {
      title: 'Start Date',
      dataIndex: 'date_start',
      key: 'date_start',
      render: (date) => formatDate(date),
    },
    {
      title: 'End Date',
      dataIndex: 'date_finish',
      key: 'date_finish',
      render: (date) => formatDate(date),
    },
    {
      title: 'Day of Week',
      dataIndex: 'day_of_week',
      key: 'day_of_week',
      render: (day) => dayOfWeekAsText(day),
    },
    { title: 'Time Start', dataIndex: 'time_start', key: 'time_start' },
    { title: 'Time Finish', dataIndex: 'time_finish', key: 'time_finish' },
  ];

  const renderTable = () => (
    <Table
      columns={getColumns()}
      dataSource={filteredClasses.map((cls, index) => ({ ...cls, key: index }))}
      onRow={(record) => ({
        onClick: () => {
          navigateToClassDetail(record.class_id);
        },
      })}
      rowClassName="clickable-row"
    />
  );

  const renderCards = () => (
    <Row gutter={16}>
      {filteredClasses.map((cls) => (
        <Col
          key={cls.class_id}
          span={8}
          onClick={() => navigateToClassDetail(cls.class_id)}
        >
          <Card
            hoverable
            title={`${cls.class_code} (${cls.course_code} - ${cls.course_name})`}
            style={{
              marginBottom: 16,
              borderRadius: '8px',
              borderColor: '#cdc9c9',
            }}
          >
            <p>
              <b>Day:</b> {dayOfWeekAsText(cls.day_of_week)}
            </p>
            <p>
              <b>Time:</b> {cls.time_start} - {cls.time_finish}
            </p>
            <p>
              <b>Date:</b> {formatDate(cls.date_start)} -{' '}
              {formatDate(cls.date_finish)}
            </p>
          </Card>
        </Col>
      ))}
    </Row>
  );

  return (
    <Layout>
      <div className="container-fluid container-fluid-custom">
        <div className="d-flex">
          <h4>Report</h4>
          <div className="pt-1 ms-3">
            <Switch
              checkedChildren="Cards"
              unCheckedChildren="Table"
              onChange={(checked) => setViewMode(checked ? 'card' : 'table')}
              style={{ marginBottom: 16 }}
            />
          </div>
        </div>
        <div className="d-flex justify-content-between mt-4 mb-4">
          <div>
            <h5>List of classes</h5>
          </div>
          <div>
            <Input.Search
              placeholder="Search by class code, course code or course name"
              onChange={handleSearchChange}
              style={{ width: 400 }}
            />
          </div>
        </div>
        {viewMode === 'table' ? renderTable() : renderCards()}
      </div>
    </Layout>
  );
};

export default TeacherReportPage;
