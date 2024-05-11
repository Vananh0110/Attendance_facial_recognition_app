import React, { useEffect, useState } from 'react';
import {
  Modal,
  Form,
  Input,
  DatePicker,
  Button,
  Select,
  TimePicker,
  Row,
  Col,
  message,
} from 'antd';
import moment from 'moment';
import axios from '../../../api/axios';
import { EditOutlined } from '@ant-design/icons';
import AddCourseModal from '../../Admin/Course/AddCourseModal';
const { Option } = Select;

const EditClassModal = ({ visible, onClose, classData, onUpdate }) => {
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
    console.log(userId);
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

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onUpdate(classData.class_id, {
        ...values,
        date_start: values.date_start.format('YYYY-MM-DD'),
        date_finish: values.date_finish.format('YYYY-MM-DD'),
        time_start: values.time_start.format('HH:mm'),
        time_finish: values.time_finish.format('HH:mm'),
      });
      onClose();
    } catch (error) {
      console.log('Validation Failed:', error);
    }
  };

  return (
    <Modal
      title="Edit Class"
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
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          class_code: classData.class_code,
          course_id: classData.course_id,
          date_start: moment(classData.date_start),
          date_finish: moment(classData.date_finish),
          day_of_week: classData.day_of_week,
          time_start: moment(classData.time_start, 'HH:mm'),
          time_finish: moment(classData.time_finish, 'HH:mm'),
          teacher_id: classData.teacher_id,
        }}
      >
        <Form.Item
          name="class_code"
          label="Class Code"
          rules={[{ required: true, message: 'Please input the class code!' }]}
        >
          <Input />
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
              label="Start Date"
              rules={[
                { required: true, message: 'Please select the start date!' },
              ]}
            >
              <DatePicker format="YYYY-MM-DD" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="date_finish"
              label="End Date"
              rules={[
                { required: true, message: 'Please select the end date!' },
              ]}
            >
              <DatePicker format="YYYY-MM-DD" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="time_start"
              label="Start Time"
              rules={[
                { required: true, message: 'Please select the start time!' },
              ]}
            >
              <TimePicker format="HH:mm" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="time_finish"
              label="Finish Time"
              rules={[
                { required: true, message: 'Please select the finish time!' },
              ]}
            >
              <TimePicker format="HH:mm" />
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

export default EditClassModal;
