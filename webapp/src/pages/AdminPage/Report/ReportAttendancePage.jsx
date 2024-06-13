import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../../components/Admin/Layout';
import '../../../App.css';
import axios from '../../../api/axios';
import { message, Row, Col, Card, Input } from 'antd';

const ReportAttendancePage = () => {
  const [courses, setCourses] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filteredCourses, setFilteredCourses] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    setFilteredCourses(
      courses.filter((course) =>
        `${course.course_code} ${course.course_name}`
          .toLowerCase()
          .includes(searchText.toLowerCase())
      )
    );
  }, [courses, searchText]);

  const fetchCourses = async () => {
    try {
      const response = await axios.get('/course/all');
      console.log(response.data);
      setCourses(response.data);
    } catch (error) {
      console.error('Failed to fetch courses: ', error);
      message.error('Failed to fetch courses');
    }
  };

  const navigateToClasses = (courseId) => {
    navigate(`/admin/reports/${courseId}/classes`);
  };

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  return (
    <Layout>
      <div className="container-fluid container-fluid-custom">
        <h4>Report</h4>
        <div className="d-flex justify-content-between mt-5">
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
        <div className="mt-4">
          <Row gutter={16}>
            {filteredCourses.map((course) => (
              <Col
                key={course.course_id}
                span={6}
                onClick={() => navigateToClasses(course.course_id)}
              >
                <Card
                  hoverable
                  title={course.course_name}
                  style={{
                    marginBottom: 16,
                    borderRadius: '8px',
                    borderColor: '#cdc9c9',
                    transition: '0.3s',
                  }}
                >
                  <Row className="mb-2">
                    <Col span={8}>Course Code:</Col>
                    <Col span={16}>{course.course_code}</Col>
                  </Row>
                  <Row>
                    <Col span={8}>Classes:</Col>
                    <Col span={16}>{course.course_code}</Col>
                  </Row>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </div>
    </Layout>
  );
};

export default ReportAttendancePage;
