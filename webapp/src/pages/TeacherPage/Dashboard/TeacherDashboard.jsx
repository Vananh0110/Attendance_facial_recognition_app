import React, { useEffect, useState } from 'react';
import Layout from '../../../components/Teacher/Layout';
import '../../../App.css';
import teacherDashboardImg from '../../../assets/images/teacherdashboard.png';
import axios from '../../../api/axios';
import moment from 'moment';
import { useNavigate, Link } from 'react-router-dom';
import { Progress } from 'antd';

const TeacherDashboardPage = () => {
  const [username, setUsername] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleString());
  const [todayClasses, setTodayClasses] = useState([]);
  const [classes, setClasses] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    const username = user.username;
    const userId = user.user_id;
    setUsername(username);

    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleString());
    }, 1000);

    fetchTodayClasses();
    fetchClasses();

    return () => clearInterval(timer);
  }, []);

  const fetchTodayClasses = async () => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    const userId = user.user_id;
    const today = moment().day();
    const todayDate = moment().format('YYYY-MM-DD');

    try {
      const response = await axios.get(`/class/all`);
      const data = response.data.filter((cls) => cls.user_id === userId);
      const todayClasses = data
        .filter((cls) => {
          const classStartDate = moment(cls.date_start);
          const classEndDate = moment(cls.date_finish);
          return (
            classStartDate.isSameOrBefore(todayDate) &&
            classEndDate.isSameOrAfter(todayDate) &&
            cls.day_of_week === today
          );
        })
        .map((cls) => ({
          ...cls,
          startTime: moment(cls.time_start, 'HH:mm:ss').format('HH:mm'),
          endTime: moment(cls.time_finish, 'HH:mm:ss').format('HH:mm'),
        }));
      setTodayClasses(todayClasses);
    } catch (error) {
      console.error('Failed to fetch classes:', error);
    }
  };

  const fetchClasses = async () => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    const userId = user.user_id;
    try {
      const response = await axios.get('/class/all');
      const data = response.data.filter(
        (cls) => cls.user_id === userId
      );
      console.log('All Classes:', data); 
      const classProgress = data.map((cls) => {
        const classStartDate = moment(cls.date_start);
        const classEndDate = moment(cls.date_finish);
        const totalDays = classEndDate.diff(classStartDate, 'days');
        const elapsedDays = moment().diff(classStartDate, 'days');
        const progress = Math.min((elapsedDays / totalDays) * 100, 100).toFixed(2);
        return {
          ...cls,
          progress,
        };
      });
      console.log('Class Progress:', classProgress);
      setClasses(classProgress);
    } catch (error) {
      console.error('Failed to fetch classes:', error);
    }
  };

  const handleClassClick = (classId) => {
    navigate(`/teacher/classes/classDetail/${classId}`);
  };

  return (
    <Layout>
      <div className="container-fluid container-fluid-custom">
        <div className="row justify-content-end me-5 mt-3">
          <div className="col-auto">
            <p className="fs-6 fw-semibold">{currentTime}</p>
          </div>
        </div>
        <div className="row border ms-4 me-5 mt-1 dashboard">
          <div className="col-8 d-flex flex-column align-items-center justify-content-center">
            <p className="fs-1">Welcome, {username}</p>
            <p className="fs-6 text-center ps-4 pe-4">
              Ready to excel today! Stay focused and achieve your goals. Make
              the most of your classes and strive for excellence in all that you
              do. Take on today's challenges with confidence and keep up the
              great work.
            </p>
          </div>
          <div className="col-4">
            <img
              alt=""
              src={teacherDashboardImg}
              style={{ height: '280px', width: 'auto' }}
            />
          </div>
        </div>
        <div className="row ms-4 me-3 mt-5">
          <div className="col-5">
            <h5>Today's Classes</h5>
            <ul className="list-group">
              {todayClasses.length > 0 ? (
                todayClasses.map((cls) => (
                  <li
                    key={cls.class_id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                    onClick={() => handleClassClick(cls.class_id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <span>
                      {cls.course_name} ({cls.class_code})
                    </span>
                    <span>
                      {cls.startTime} - {cls.endTime}
                    </span>
                  </li>
                ))
              ) : (
                <li className="list-group-item">No Schedule</li>
              )}
            </ul>
          </div>
          <div className="col-1"></div>
          <div className="col-6">
            <h5>Class Progress</h5>
            <ul className="list-group">
              {classes.length > 0 ? (
                classes.map((cls) => (
                  <li
                    key={cls.class_id}
                    className="list-group-item d-flex flex-column align-items-start"
                    onClick={() => handleClassClick(cls.class_id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <span>
                      {cls.course_name} ({cls.class_code})
                    </span>
                    <Progress percent={cls.progress} />
                  </li>
                ))
              ) : (
                <li className="list-group-item">No Classes</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TeacherDashboardPage;
