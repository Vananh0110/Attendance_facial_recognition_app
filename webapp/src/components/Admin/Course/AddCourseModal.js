import React from 'react';
import { Modal, Form, Input, Button } from 'antd';

const AddCourseModal = ({ visible, onClose, onCreate }) => {
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
      title="Add New Course"
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
          name="course_code"
          label="Course Code"
          rules={[{ required: true, message: 'Please input the course code!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="course_name"
          label="Course Name"
          rules={[{ required: true, message: 'Please input the course name!' }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddCourseModal;
