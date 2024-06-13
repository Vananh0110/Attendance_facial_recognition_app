import React, { useState, useEffect } from 'react';
import Layout from '../../../components/Teacher/Layout';
import axios from '../../../api/axios';
import '../../../App.css';
import {
  message,
  Avatar,
  Upload,
  Button,
  Modal,
  Form,
  Input,
} from 'antd';
import { UploadOutlined, UserOutlined } from '@ant-design/icons';
import moment from 'moment';

const AdminProfile = () => {
  const [userData, setUserData] = useState(null);
  const [classes, setClasses] = useState([]);
  const [isHovering, setIsHovering] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [userId, setUserId] = useState(null);

  const BASE_URL = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    const userData = JSON.parse(sessionStorage.getItem('user'));
    if (userData && userData.user_id) {
      setUserId(userData.user_id);
    }
  }, []);

  useEffect(() => {
    if (userId) {
      fetchUser(userId);
    }
  }, [userId]);

  const fetchUser = async (userId) => {
    try {
      const response = await axios.get(`/user/${userId}`);
      console.log(response.data);
      setUserData(response.data);
    } catch (error) {
      console.error('Failed to fetch userData');
    }
  };

  const handleUpload = async ({ file }) => {
    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const response = await axios.post(`/user/upload-avatar/${userId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setUserData({ ...userData, avatar_url: response.data.avatar_url });
      message.success('Avatar updated successfully');
    } catch (error) {
      console.error('Error uploading avatar', error);
      message.error('Failed to upload avatar');
    }
  };

  const handleChangePassword = async (values) => {
    try {
      const response = await axios.post(
        `/user/change-password/${userId}`,
        values
      );
      message.success('Password changed successfully');
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('Error changing password', error);
      message.error('Failed to change password');
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <Layout>
      <div className="container-fluid container-fluid-custom">
        <h4>Profile</h4>
        <div className="mt-5">
          {userData && (
            <div className="profile-container">
              <div className="d-flex flex-column">
                <div
                  className="avatar-section"
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                >
                  <Avatar
                    size={200}
                    icon={userData.avatar_url ? null : <UserOutlined />}
                    src={
                      userData.avatar_url
                        ? `${BASE_URL}${userData.avatar_url}`
                        : undefined
                    }
                    className="avatar"
                  />
                  {isHovering && (
                    <div className="change-avatar-overlay">
                      <Upload
                        showUploadList={false}
                        customRequest={handleUpload}
                        className="avatar-upload"
                      >
                        <div className="change-avatar-text">
                          <UploadOutlined style={{ marginRight: 8 }} />
                          Change Avatar
                        </div>
                      </Upload>
                    </div>
                  )}
                </div>
                <div className="d-flex justify-content-center align-items-center mt-3">
                  <Button onClick={showModal} style={{ marginTop: 16 }}>
                    Change Password
                  </Button>
                </div>
              </div>
              <div className="info-section">
                <div className="row mb-3">
                  <div className="col-2"></div>
                  <div className="col-2 fw-bold">Username: </div>
                  <div className="col-8">{userData.username} </div>
                </div>
                <div className="row mb-3">
                  <div className="col-2"></div>
                  <div className="col-2 fw-bold">Email:</div>
                  <div className="col-8">{userData.email} </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Modal
        title="Change Password"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} onFinish={handleChangePassword}>
          <Form.Item
            name="oldPassword"
            label="Old Password"
            rules={[
              { required: true, message: 'Please input your old password!' },
            ]}
            className="mt-5"
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="newPassword"
            label="New Password"
            rules={[
              { required: true, message: 'Please input your new password!' },
            ]}
            className="mt-3"
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="Confirm New Password"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: 'Please confirm your new password!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error('The two passwords do not match!')
                  );
                },
              }),
            ]}
            className="mt-3 mb-5"
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Change Password
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default AdminProfile;
