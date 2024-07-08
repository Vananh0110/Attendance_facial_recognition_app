import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { List, Card, Image, message } from 'antd';
import Layout from '../../../components/Teacher/Layout';
import {axiosFlask} from '../../../api/axios';
import '../../../App.css';

const AdminStudentPicture = () => {
  const [pictures, setPictures] = useState([]);
  const { studentId } = useParams();

  useEffect(() => {
    if (studentId) {
      fetchPictures();
    }
  }, [studentId]);

  const fetchPictures = async () => {
    try {
      const response = await axiosFlask.get(
        `/pictures/${studentId}`
      );
      setPictures(response.data);
      console.log(response.data);
    } catch (error) {
      message.error('Failed to fetch pictures.');
    }
  };

  return (
    <Layout>
      <div className="container-fluid container-fluid-custom">
        <div className="d-flex justify-content-between mb-5">
          <h4>Pictures</h4>
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
              >
                <Card.Meta title={item.name} />
              </Card>
            </List.Item>
          )}
        />
      </div>
    </Layout>
  );
};

export default AdminStudentPicture;
