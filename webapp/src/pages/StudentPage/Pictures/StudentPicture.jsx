import React, { useEffect, useState } from 'react';
import { Upload, Button, Modal, List, Card, Image, message } from 'antd';
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons';
import Layout from '../../../components/Student/Layout';
import axios from 'axios';
import '../../../App.css';

const { Dragger } = Upload;

const StudentPicture = () => {
  const [pictures, setPictures] = useState([]);
  const [studentId, setStudentId] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    const userId = user.user_id;
    fetchStudentId(userId);
  }, []);

  useEffect(() => {
    if (studentId) {
      fetchPictures();
    }
  }, [studentId]);

  const fetchStudentId = async (userId) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_FLASK_BASE_URL}/getStudentId/${userId}`
      );
      setStudentId(response.data.student_id);
    } catch (error) {
      message.error('Failed to fetch student ID.');
    }
  };

  const fetchPictures = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_FLASK_BASE_URL}/pictures/${studentId}`
      );
      setPictures(response.data);
      console.log(response.data);
    } catch (error) {
      message.error('Failed to fetch pictures.');
    }
  };

  const handleUpload = async (info) => {
    const formData = new FormData();
    formData.append('file', info.file);
    formData.append('student_id', studentId);

    try {
      await axios.post(
        `${process.env.REACT_APP_FLASK_BASE_URL}/upload`,
        formData
      );
      message.success('Upload successful');
      setVisible(false);
      fetchPictures();
    } catch (error) {
      message.error('Upload failed');
    }
  };

  const handleDelete = async (pictureId) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_FLASK_BASE_URL}/delete/${pictureId}`
      );
      message.success('Delete successful');
      fetchPictures();
    } catch (error) {
      message.error('Delete failed');
    }
  };

  return (
    <Layout>
      <div className="container-fluid container-fluid-custom">
        <div className="d-flex justify-content-between mb-5">
          <h4>Pictures</h4>
          <Button
            type="primary"
            onClick={() => setVisible(true)}
            className="me-4"
          >
            Upload Image
          </Button>
        </div>

        <List
          grid={{ gutter: 16, column: 6 }}
          dataSource={pictures}
          renderItem={(item) => (
            <List.Item>
              <Card
                cover={
                  <Image
                    src={`${process.env.REACT_APP_FLASK_BASE_URL}${item.url}`}
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                }
                actions={[
                  <DeleteOutlined
                    key="delete"
                    onClick={() => handleDelete(item.id)}
                  />,
                ]}
              >
                <Card.Meta title={item.name} />
              </Card>
            </List.Item>
          )}
        />
        <Modal
          visible={visible}
          title="Upload Image"
          onCancel={() => setVisible(false)}
          footer={null}
        >
          <Dragger
            name="file"
            multiple={false}
            customRequest={({ file }) => handleUpload({ file })}
            showUploadList={false}
          >
            <p className="ant-upload-drag-icon">
              <UploadOutlined />
            </p>
            <p className="ant-upload-text">
              Click or drag file to this area to upload
            </p>
            <p className="ant-upload-hint">Support for a single upload.</p>
          </Dragger>
        </Modal>
      </div>
    </Layout>
  );
};

export default StudentPicture;
