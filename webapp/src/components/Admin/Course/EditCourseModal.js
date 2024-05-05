import React from 'react';
import { Modal, Form, Input, Button } from 'antd';

const EditCourseModal = ({ visible, onClose, course, onUpdate }) => {
  const [form] = Form.useForm();

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        onUpdate(course.course_id, values);
        onClose();
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  return (
    <Modal
      title="Edit Course"
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
          course_code: course.course_code,
          course_name: course.course_name,
        }}
      >
        <Form.Item
          name="course_code"
          label="Course Code"
          rules={[{ required: false, message: 'Please input the course code!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="course_name"
          label="Course Name"
          rules={[{ required: false, message: 'Please input the course name!' }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditCourseModal;
