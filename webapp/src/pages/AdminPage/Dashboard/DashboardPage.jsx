import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../../components/Admin/Layout';
import adminDashboardImg from '../../../assets/images/admindashboard.png';
import '../../../App.css';
import { axiosMain, axiosFlask } from '../../../api/axios';
import { Row, Col, Button, Modal, message } from 'antd';
import {
  UserOutlined,
  TeamOutlined,
  BookOutlined,
  ApartmentOutlined,
  LoadingOutlined,
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
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

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
          axiosMain.get('/teacher/all'),
          axiosMain.get('/student/all'),
          axiosMain.get('/class/all'),
          axiosMain.get('/course/all'),
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

  const handleCardClick = (path) => {
    navigate(path);
  };

  const handleTrainModel = async () => {
    Modal.confirm({
      title: 'Train Model',
      content: 'Are you sure you want to train the model? This might take a while.',
      onOk: async () => {
        setLoading(true);
        try {
          const response = await axiosFlask.post('/train_model');
          if (response.status === 200) {
            message.success('Model trained successfully');
          } else {
            message.error('Failed to train the model');
          }
        } catch (error) {
          console.error('Error training model:', error);
          message.error('An error occurred while training the model');
        } finally {
          setLoading(false);
        }
      },
    });
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
              <div
                className="stat-card"
                style={{
                  backgroundColor: 'white',
                  padding: '20px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  boxShadow: '0 0 10px rgba(0,0,0,0.1)',
                  cursor: 'pointer',
                }}
                onClick={() => handleCardClick('/admin/teachers')}
              >
                <UserOutlined style={{ fontSize: '30px', color: '#f56a00', marginRight: '10px' }} />
                <div>
                  <p style={{ margin: 0, fontSize: '16px', color: '#999' }}>Total Teachers</p>
                  <p style={{ margin: 0, fontSize: '24px', color: '#333' }}>{statistics.teachers}</p>
                </div>
              </div>
            </Col>
            <Col span={6}>
              <div
                className="stat-card"
                style={{
                  backgroundColor: 'white',
                  padding: '20px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  boxShadow: '0 0 10px rgba(0,0,0,0.1)',
                  cursor: 'pointer',
                }}
                onClick={() => handleCardClick('/admin/students')}
              >
                <TeamOutlined style={{ fontSize: '30px', color: '#7265e6', marginRight: '10px' }} />
                <div>
                  <p style={{ margin: 0, fontSize: '16px', color: '#999' }}>Total Students</p>
                  <p style={{ margin: 0, fontSize: '24px', color: '#333' }}>{statistics.students}</p>
                </div>
              </div>
            </Col>
            <Col span={6}>
              <div
                className="stat-card"
                style={{
                  backgroundColor: 'white',
                  padding: '20px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  boxShadow: '0 0 10px rgba(0,0,0,0.1)',
                  cursor: 'pointer',
                }}
                onClick={() => handleCardClick('/admin/classes')}
              >
                <ApartmentOutlined style={{ fontSize: '30px', color: '#ffbf00', marginRight: '10px' }} />
                <div>
                  <p style={{ margin: 0, fontSize: '16px', color: '#999' }}>Total Classes</p>
                  <p style={{ margin: 0, fontSize: '24px', color: '#333' }}>{statistics.classes}</p>
                </div>
              </div>
            </Col>
            <Col span={6}>
              <div
                className="stat-card"
                style={{
                  backgroundColor: 'white',
                  padding: '20px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  boxShadow: '0 0 10px rgba(0,0,0,0.1)',
                  cursor: 'pointer',
                }}
                onClick={() => handleCardClick('/admin/courses')}
              >
                <BookOutlined style={{ fontSize: '30px', color: '#00a2ae', marginRight: '20px' }} />
                <div>
                  <p style={{ margin: 0, fontSize: '16px', color: '#999' }}>Total Courses</p>
                  <p style={{ margin: 0, fontSize: '24px', color: '#333' }}>{statistics.courses}</p>
                </div>
              </div>
            </Col>
          </Row>
          <Row gutter={16} className="mt-4">
            <Col span={24} style={{ textAlign: 'center' }}>
              <Button
                type="primary"
                icon={loading ? <LoadingOutlined /> : null}
                onClick={handleTrainModel}
                loading={loading}
              >
                {loading ? 'Training Model...' : 'Train Model'}
              </Button>
            </Col>
          </Row>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboardPage;
