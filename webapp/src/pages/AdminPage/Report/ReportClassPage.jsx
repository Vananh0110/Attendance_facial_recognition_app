import React, { useState, useEffect } from 'react';
import Layout from '../../../components/Admin/Layout';
import '../../../App.css';
import {axiosMain} from '../../../api/axios';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { Table, Input } from 'antd';

const ReportClassPage = () => {
  const [classes, setClasses] = useState([]);
  const [searchText, setSearchText] = useState('');

  const { courseId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await axiosMain.get(`/class/listclasses/${courseId}`);
      console.log(response.data);
      setClasses(response.data);
    } catch (error) {
      console.error('Failed to fetch classes: ', error);
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

  const navigateToClassAttendance = (classId) => {
    navigate(`/admin/reports/${courseId}/classes/${classId}/attendance`);
  };

  const onRowClick = (record) => {
    return {
      onClick: () => {
        navigateToClassAttendance(record.class_id);
      },
    };
  };

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  const filteredClasses = classes.filter((cls) => {
    return (
      cls.class_code.toLowerCase().includes(searchText) ||
      cls.username.toLowerCase().includes(searchText)
    );
  });

  const columns = () => [
    {
      title: 'ID',
      dataIndex: 'class_id',
      key: 'class_id',
    },
    { title: 'Class Code', dataIndex: 'class_code', key: 'class_code' },
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

  return (
    <Layout>
      <div className="container-fluid container-fluid-custom">
        <h4>Report</h4>
        <div className="d-flex justify-content-between mt-5 mb-4">
          <div>
            <h5>List of courses</h5>
          </div>
          <div>
            <Input.Search
              placeholder="Search by course code or course name"
              onChange={handleSearchChange}
              style={{ width: 400 }}
            />
          </div>
        </div>
        <Table
          columns={columns()}
          dataSource={filteredClasses.map((cls, index) => ({
            ...cls,
            key: index,
          }))}
          onRow={onRowClick}
        />
      </div>
    </Layout>
  );
};

export default ReportClassPage;
