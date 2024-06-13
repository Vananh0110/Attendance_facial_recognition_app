import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, Select, message } from 'antd';
import axios from '../../../api/axios';
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
      const response = await axios.get('/student/all');
      console.log(response.data);
      setStudents(response.data);
    } catch (error) {
      console.log('Failed to fetch students: ', error);
    }
  };

  const handleAddStudents = async () => {
    try {
      const promises = selectedStudents.map((studentId) =>
        axios.post('/studentClass', {
          student_id: studentId,
          class_id: classId,
        })
      );
      await Promise.all(promises);
      message.success('All selected students have been added successfully');
      onClose();
    } catch (error) {
      message.error('Failed to add students');
      console.error('Error adding students:', error);
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
