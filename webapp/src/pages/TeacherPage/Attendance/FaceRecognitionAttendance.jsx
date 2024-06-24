import React, { useState, useEffect } from 'react';
import Layout from '../../../components/Teacher/Layout';
import '../../../App.css';
import { useParams, useNavigate } from 'react-router-dom';
import { Upload, Button, List, Card, message, Modal, Image, Spin } from 'antd';
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Dragger } = Upload;

const FaceRecognitionAttendance = () => {
  const { classId, date } = useParams();
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchImages();
  }, [date]);

  const fetchImages = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_FLASK_BASE_URL}/attendance_image/${classId}/${date}`
      );
      setImages(response.data.images);
      console.log(response.data);
    } catch (error) {
      console.error('Failed to fetch images');
    }
  };

  const handleUpload = async ({ file }) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('class_id', classId);
    formData.append('date', date);

    try {
      await axios.post(
        `${process.env.REACT_APP_FLASK_BASE_URL}/upload_attendance_image`,
        formData
      );
      message.success('Image uploaded successfully');
      setVisible(false);
      fetchImages();
    } catch (error) {
      message.error('Failed to upload image');
    }
  };

  const handleDelete = async (imageId) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_FLASK_BASE_URL}/delete_attendance_image/${imageId}`
      );
      message.success('Image deleted successfully');
      setImages((prevImages) =>
        prevImages.filter((image) => image.id !== imageId)
      );
    } catch (error) {
      message.error('Failed to delete image');
    }
  };

  const handleProceedAttendance = async () => {
    setLoading(true);
    try {
      await axios.post(`${process.env.REACT_APP_FLASK_BASE_URL}/attendance`, {
        class_id: classId,
        date: date,
      });
      message.success('Attendance recorded successfully');
      navigate(`/teacher/report/classDetail/${classId}`);
    } catch (error) {
      message.error('Failed to proceed attendance');
    }
    setLoading(false);
  };

  return (
    <Layout>
      <div className="container-fluid container-fluid-custom">
        <div className="d-flex justify-content-between mb-5">
          <h4>Face Recognition Attendance</h4>
          <div className="d-flex justify-content-end mt-3 mb-4">
            {images.length > 0 && (
              <Button
                type="primary"
                onClick={handleProceedAttendance}
                className="me-2"
              >
                Proceed Attendance
              </Button>
            )}
            <Button
              type="default"
              onClick={() => setVisible(true)}
              className="me-4"
            >
              Upload Image
            </Button>
          </div>
        </div>

        <List
          grid={{ gutter: 16, column: 4 }}
          dataSource={images}
          renderItem={(item) => (
            <List.Item>
              <Card
                cover={
                  <Image
                    alt={`image-${item.id}`}
                    src={`${process.env.REACT_APP_FLASK_BASE_URL}${item.image_url}`}
                    style={{ height: '400px', objectFit: 'cover' }}
                  />
                }
                actions={[
                  <DeleteOutlined
                    key="delete"
                    onClick={() => handleDelete(item.id)}
                    style={{ color: 'red' }}
                  />,
                ]}
              ></Card>
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
            accept="image/*"
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

        <Modal visible={loading} footer={null} closable={false} centered>
          <div className="d-flex justify-content-center align-items-center">
            <Spin size="large" />
            <span className="ms-3">Processing attendance, please wait...</span>
          </div>
        </Modal>
      </div>
    </Layout>
  );
};

export default FaceRecognitionAttendance;
