import React, { useEffect, useState } from 'react';
import Layout from '../../../components/Admin/Layout';
import adminDashboardImg from '../../../assets/images/admindashboard.png';
import '../../../App.css';
import axios from '../../../api/axios';
import { Row, Col } from 'antd';
import {
  UserOutlined,
  TeamOutlined,
  BookOutlined,
  ApartmentOutlined,
} from '@ant-design/icons';

const AdminDashboardPage = () => {
  const [username, setUsername] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleString());
  const [statistics, setStatistics] = useState({
    teachers: 0,
    students: 0,
    classes: 0,
    courses: 0,
  });

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    const username = user.username;
    setUsername(username);

    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleString());
    }, 1000);

    fetchStatistics();

    return () => clearInterval(timer);
  }, []);

  const fetchStatistics = async () => {
    try {
      const [teachersRes, studentsRes, classesRes, coursesRes] =
        await Promise.all([
          axios.get('/teacher/all'),
          axios.get('/student/all'),
          axios.get('/class/all'),
          axios.get('/course/all'),
        ]);

      setStatistics({
        teachers: teachersRes.data.length,
        students: studentsRes.data.length,
        classes: classesRes.data.length,
        courses: coursesRes.data.length,
      });
    } catch (error) {
      console.error('Failed to fetch statistics:', error);
    }
  };

  return (
    <Layout>
      <div className="container-fluid container-fluid-custom">
        <div className="row justify-content-end me-5 mt-3">
          <div className="col-auto">
            <p className="fs-6 fw-semibold">{currentTime}</p>
          </div>
        </div>
        <div className="row ms-4 me-5 mt-3">
          <Row gutter={16}>
            <Col span={6}>
              <div className="stat-card" style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', display: 'flex', alignItems: 'center', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
                <UserOutlined style={{ fontSize: '30px', color: '#f56a00', marginRight: '10px' }} />
                <div>
                  <p style={{ margin: 0, fontSize: '16px', color: '#999' }}>Total Teachers</p>
                  <p style={{ margin: 0, fontSize: '24px', color: '#333' }}>{statistics.teachers}</p>
                </div>
              </div>
            </Col>
            <Col span={6}>
              <div className="stat-card" style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', display: 'flex', alignItems: 'center', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
                <TeamOutlined style={{ fontSize: '30px', color: '#7265e6', marginRight: '10px' }} />
                <div>
                  <p style={{ margin: 0, fontSize: '16px', color: '#999' }}>Total Students</p>
                  <p style={{ margin: 0, fontSize: '24px', color: '#333' }}>{statistics.students}</p>
                </div>
              </div>
            </Col>
            <Col span={6}>
              <div className="stat-card" style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', display: 'flex', alignItems: 'center', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
                <ApartmentOutlined style={{ fontSize: '30px', color: '#ffbf00', marginRight: '10px' }} />
                <div>
                  <p style={{ margin: 0, fontSize: '16px', color: '#999' }}>Total Classes</p>
                  <p style={{ margin: 0, fontSize: '24px', color: '#333' }}>{statistics.classes}</p>
                </div>
              </div>
            </Col>
            <Col span={6}>
              <div className="stat-card" style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', display: 'flex', alignItems: 'center', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
                <BookOutlined style={{ fontSize: '30px', color: '#00a2ae', marginRight: '20px' }} />
                <div>
                  <p style={{ margin: 0, fontSize: '16px', color: '#999' }}>Total Courses</p>
                  <p style={{ margin: 0, fontSize: '24px', color: '#333' }}>{statistics.courses}</p>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboardPage;
