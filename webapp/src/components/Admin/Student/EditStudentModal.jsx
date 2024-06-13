import React from 'react';
import { Modal, Form, Input, Button, Select } from 'antd';
const {Option} = Select;
const EditStudentModal = ({ visible, onClose, student, onUpdate }) => {
  const [form] = Form.useForm();

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        onUpdate(student.student_id, values);
        onClose();
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  return (
    <Modal
      title="Edit Student"
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
          username: student.username,
          email: student.email,
          phone: student.phone,
          student_code: student.student_code,
          student_class: student.student_class,
          gender: student.gender,
        }}
      >
        <Form.Item
          name="username"
          label="Name"
          rules={[{ required: false, message: 'Please input the name!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: false, message: 'Please input the email!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="phone"
          label="Phone"
          rules={[
            { required: false, message: 'Please input the phone number!' },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="student_code"
          label="Student Code"
          rules={[
            { required: false, message: 'Please input the student code!' },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="student_class"
          label="Class"
          rules={[
            { required: false, message: 'Please input the student class!' },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="gender"
          label="Gender"
          rules={[{ required: false, message: 'Please select the gender!' }]}
        >
          <Select>
            <Option value="Nam">Nam</Option>
            <Option value="Nữ">Nữ</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditStudentModal;
