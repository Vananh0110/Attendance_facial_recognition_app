import React from 'react';
import { Modal, Form, Input, Button } from 'antd';

const EditTeacherModal = ({ visible, onClose, teacher, onUpdate }) => {
  const [form] = Form.useForm();

  const handleSubmit = () => {
    form.validateFields()
      .then(values => {
        onUpdate(teacher.teacher_id, values);
        onClose();
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  };

  return (
    <Modal
      title="Edit Teacher"
      visible={visible}
      onOk={handleSubmit}
      onCancel={onClose}
      footer={[
        <Button key="back" onClick={onClose}>Cancel</Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>Submit</Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          username: teacher.username,
          email: teacher.email,
          phone: teacher.phone
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
          rules={[{ required: false, message: 'Please input the phone number!' }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditTeacherModal;
