import React from 'react';
import { Modal, Form, Input, Button, Select } from 'antd';
const { Option } = Select;

const AddStudentModal = ({ visible, onClose, onCreate }) => {
  const [form] = Form.useForm();

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        onCreate(values);
        form.resetFields();
        onClose();
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  return (
    <Modal
      title="Add New Student"
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
          name="username"
          label="Name"
          rules={[{ required: true, message: 'Please input the name!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true, message: 'Please input the email!' }]}
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
            { required: true, message: 'Please input the student code!' },
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
          rules={[{ required: true, message: 'Please select the gender!' }]}
        >
          <Select placeholder="Select a gender">
            <Option value="Nam">Nam</Option>
            <Option value="Nữ">Nữ</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddStudentModal;
