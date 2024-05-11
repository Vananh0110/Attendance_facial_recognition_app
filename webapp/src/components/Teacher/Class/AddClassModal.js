import React, { useEffect, useState } from 'react';
import {
  Button,
  DatePicker,
  TimePicker,
  Form,
  Input,
  Modal,
  Select,
  message,
  Row,
  Col,
} from 'antd';
import { EditOutlined } from '@ant-design/icons';
import axios from '../../../api/axios';
import AddCourseModal from '../../Admin/Course/AddCourseModal';

const { Option } = Select;

const AddClassModal = ({ visible, onClose, onCreate }) => {
  const [form] = Form.useForm();
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);

  useEffect(() => {
    if (visible) {
      fetchCourses();
      fetchTeachers();
    }
  }, [visible]);

  const fetchCourses = async () => {
    try {
      const response = await axios.get('/course/all');
      setCourses(response.data);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    }
  };

  const fetchTeachers = async () => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    const userId = user.user_id;
    try {
      const response = await axios.get('/teacher/all');
      const filteredTeacher = response.data.filter(
        (teacher) => teacher.user_id === userId
      );
      setTeachers(filteredTeacher);
    } catch (error) {
      console.error('Failed to fetch teachers:', error);
    }
  };

  const handleCreateNewCourse = (values) => {
    axios
      .post('/course', values)
      .then(() => {
        message.success('course added successfully');
        fetchCourses();
      })
      .catch((error) => {
        message.error('Failed to add course');
      });
  };

  const handleCreateNewTeacher = (values) => {
    axios
      .post('/teacher', values)
      .then(() => {
        message.success('Teacher added successfully');
        fetchTeachers();
      })
      .catch((error) => {
        message.error('Failed to add teacher');
      });
  };

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        if (values.date_start) {
          values.date_start = values.date_start.format('YYYY-MM-DD');
        }

        if (values.date_finish) {
          values.date_finish = values.date_finish.format('YYYY-MM-DD');
        }

        if (values.time_start) {
          values.time_start = values.time_start.format('HH:mm');
        }

        if (values.time_finish) {
          values.time_finish = values.time_finish.format('HH:mm');
        }

        onCreate(values);
        form.resetFields();
        onClose();
      })
      .catch((info) => {
        console.log('Validate Failed: ', info);
      });
  };

  return (
    <Modal
      title="Add New Class"
      visible={visible}
      onOk={handleSubmit}
      onCancel={onClose}
      footer={[
        <Button key="back" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          Submit
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="class_code"
          label="Class Code"
          rules={[{ required: true, message: 'Please input the class code!' }]}
        >
          <Input placeholder="Input the class code" />
        </Form.Item>
        <Form.Item
          name="course_id"
          label="Course"
          rules={[{ required: true, message: 'Please select a course!' }]}
        >
          <Select
            placeholder="Select a course"
            onSelect={(value) => {
              if (value === 'add_new_course') {
                setShowAddCourseModal(true);
              }
            }}
          >
            {courses.map((course) => (
              <Option key={course.course_id} value={course.course_id}>
                {course.course_code} - {course.course_name}
              </Option>
            ))}
            <Option key="add_new_course" value="add_new_course">
              <EditOutlined className="me-3" />
              Add New Course
            </Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="teacher_id"
          label="Teacher"
          rules={[{ required: true, message: 'Please select a teacher!' }]}
        >
          <Select placeholder="Select a teacher">
            {teachers.map((teacher) => (
              <Option key={teacher.teacher_id} value={teacher.teacher_id}>
                {teacher.username}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="date_start"
              label="Date Start"
              rules={[
                { required: true, message: 'Please select the start date!' },
              ]}
            >
              <DatePicker />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="date_finish"
              label="Date Finish"
              rules={[
                { required: true, message: 'Please select the end date!' },
              ]}
            >
              <DatePicker />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="time_start"
              label="Time Start"
              rules={[
                { required: true, message: 'Please select the start time!' },
              ]}
            >
              <TimePicker />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="time_finish"
              label="Time Finish"
              rules={[
                { required: true, message: 'Please select the finish time!' },
              ]}
            >
              <TimePicker />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item
          name="day_of_week"
          label="Day of the Week"
          rules={[
            { required: true, message: 'Please select the day of the week!' },
          ]}
        >
          <Select placeholder="Select the day of the week">
            <Option value={0}>Chủ Nhật</Option>
            <Option value={1}>Thứ Hai</Option>
            <Option value={2}>Thứ Ba</Option>
            <Option value={3}>Thứ Tư</Option>
            <Option value={4}>Thứ Năm</Option>
            <Option value={5}>Thứ Sáu</Option>
            <Option value={6}>Thứ Bảy</Option>
          </Select>
        </Form.Item>
        <AddCourseModal
          visible={showAddCourseModal}
          onClose={() => setShowAddCourseModal(false)}
          onCreate={(newCourse) => {
            handleCreateNewCourse(newCourse);
            form.setFieldsValue({ course_id: newCourse.course_id });
            setShowAddCourseModal(false);
          }}
        />
      </Form>
    </Modal>
  );
};

export default AddClassModal;
