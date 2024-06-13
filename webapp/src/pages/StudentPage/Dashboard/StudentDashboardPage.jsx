import React, { useEffect, useState } from 'react';
import Layout from '../../../components/Student/Layout';
import '../../../App.css';
import studentDashboardImg from '../../../assets/images/studentdashboard.png';
import axios from '../../../api/axios';
import moment from 'moment';
import { useNavigate, Link } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const StudentDashboardPage = () => {
  const [username, setUsername] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleString());
  const [todayClasses, setTodayClasses] = useState([]);
  const [attendanceData, setAttendanceData] = useState({
    P: {},
    L: {},
    A: {},
    UA: {},
  });

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
    fetchAttendanceData(userId);

    return () => clearInterval(timer);
  }, []);

  const fetchTodayClasses = async () => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    const userId = user.user_id;
    const today = moment().day();
    const todayDate = moment().format('YYYY-MM-DD');

    try {
      const response = await axios.get(`/studentClass/getClass/${userId}`);
      const data = response.data;
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

  const handleClassClick = (classId) => {
    navigate(`/student/classes/classDetail/${classId}`);
  };

  const fetchAttendanceData = async (userId) => {
    try {
      const response = await axios.get(
        `/attendance/getStudentAttendance/${userId}`
      );
      const data = response.data;

      const attendanceCount = {
        P: {},
        L: {},
        A: {},
        UA: {},
      };

      data.forEach((attendance) => {
        const classCode = attendance.class_code;
        const courseName = attendance.course_name;
        if (!attendanceCount[attendance.status][classCode]) {
          attendanceCount[attendance.status][classCode] = {
            count: 0,
            courseName: courseName,
          };
        }
        attendanceCount[attendance.status][classCode].count += 1;
      });

      setAttendanceData(attendanceCount);
    } catch (error) {
      console.error('Failed to fetch attendance data:', error);
    }
  };

  const chartData = {
    labels: ['P', 'L', 'A', 'UA'],
    datasets: [
      {
        label: 'Attendance Count',
        data: [
          Object.values(attendanceData.P).reduce((a, b) => a + b.count, 0),
          Object.values(attendanceData.L).reduce((a, b) => a + b.count, 0),
          Object.values(attendanceData.A).reduce((a, b) => a + b.count, 0),
          Object.values(attendanceData.UA).reduce((a, b) => a + b.count, 0),
        ],
        backgroundColor: ['#4caf50', '#ffeb3b', '#f44336', '#9e9e9e'],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
        text: 'Attendance Statistics',
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const statusKey = context.label;
            const classes = Object.entries(attendanceData[statusKey])
              .map(
                ([classCode, { count, courseName }]) =>
                  `${courseName} (${classCode}): ${count}`
              )
              .join('\n');
            return `${classes}`;
          },
        },
      },
    },
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
              src={studentDashboardImg}
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
            <Link to="/student/report" className="text-black">
              <h5>Attendance</h5>
            </Link>
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default StudentDashboardPage;
