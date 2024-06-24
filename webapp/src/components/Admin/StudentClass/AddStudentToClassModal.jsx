import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, Select, message } from 'antd';
import axios from 'axios';
const { Option } = Select;

const AddStudentToClassModal = ({ visible, onClose, classId }) => {
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);

  const handleSubmit = () => {};

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/student/all`);
      console.log(response.data);
      setStudents(response.data);
    } catch (error) {
      console.log('Failed to fetch students: ', error);
    }
  };

  const handleAddStudents = async () => {
    try {
      const promises = selectedStudents.map((studentId) =>
        axios.post(`${process.env.REACT_APP_BASE_URL}/studentClass`, {
          student_id: studentId,
          class_id: classId,
        })
      );
      await Promise.all(promises);
      message.success('All selected students have been added successfully');
     
      onClose();
      trainModel();
    } catch (error) {
      message.error('Failed to add students');
      console.error('Error adding students:', error);
    }
  };

  const trainModel = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_FLASK_BASE_URL}/train_model`);
      console.success('Model trained successfully');
    } catch (error) {
      console.error('Error training model:', error);
    }
  };

  return (
    <Modal
      title="Add Students to Class"
      visible={visible}
      onOk={handleAddStudents}
      onCancel={onClose}
      footer={[
        <Button key="back" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleAddStudents}>
          Add Students
        </Button>,
      ]}
    >
      <Select
        mode="multiple"
        allowClear
        style={{ width: '100%' }}
        placeholder="Select students"
        onChange={setSelectedStudents}
      >
        {students.map((student) => (
          <Option key={student.student_id} value={student.student_id}>
            {student.student_code} - {student.username}
          </Option>
        ))}
      </Select>
    </Modal>
  );
};

export default AddStudentToClassModal;
