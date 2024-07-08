import React, { useState, useEffect } from 'react';
import Layout from '../../../components/Teacher/Layout';
import '../../../App.css';
import {axiosMain} from '../../../api/axios';
import * as XLSX from 'xlsx';
import { Button, Table, Upload, message, Tooltip, Input, Modal } from 'antd';
import {
  UploadOutlined,
  EditOutlined,
  DeleteOutlined,
  ExportOutlined,
} from '@ant-design/icons';
import AddCourseModal from '../../../components/Admin/Course/AddCourseModal';
import EditCourseModal from '../../../components/Admin/Course/EditCourseModal';

const CourseTeacherManagement = () => {
  const [courses, setCourses] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [uploading, setUploading] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [isAddModalVisible, setAddModalVisible] = useState(false);

  useEffect(() => {
    fetchCourse();
  }, []);

  const fetchCourse = async () => {
    try {
      const response = await axiosMain.get('/course/all');
      console.log(response.data);
      setCourses(response.data);
    } catch (error) {
      message.error('Failed to fetch courses');
    }
  };

  const handleUpload = ({ file, onSuccess, onError }) => {
    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);

    axiosMain
      .post('/course/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(() => {
        message.success('File uploaded successfully');
        fetchCourse();
        onSuccess();
        setUploading(false);
      })
      .catch(() => {
        message.error('Failed to upload file');
        onError();
        setUploading(false);
      });
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value.toLowerCase());
  };

  const filteredCourses = courses.filter((course) => {
    return (
      course.course_code.toLowerCase().includes(searchText) ||
      course.course_name.toLowerCase().includes(searchText)
    );
  });

  const handleDelete = (courseId) => {
    Modal.confirm({
      title: 'Are you sure delete this course?',
      onOk() {
        axiosMain
          .delete(`/course/${courseId}`)
          .then(() => {
            message.success('course deleted successfully');
            fetchCourse();
          })
          .catch((error) => {
            message.error('Failed to delete course');
          });
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const handleEdit = (course) => {
    setEditingCourse(course);
  };

  const handleUpdate = (courseId, values) => {
    axiosMain
      .put(`/course/${courseId}`, values)
      .then(() => {
        message.success('course updated successfully');
        setEditingCourse(null);
        fetchCourse();
      })
      .catch((error) => {
        message.error('Failed to update course');
      });
  };

  const handleCreateNewCourse = (values) => {
    axiosMain
      .post('/course', values)
      .then(() => {
        message.success('course added successfully');
        fetchCourse();
      })
      .catch((error) => {
        message.error('Failed to add course');
      });
  };

  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(courses);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'courses');
    const exportFileName = 'CourseList.xlsx';
    XLSX.writeFile(wb, exportFileName);
  };

  const getColumns = () => [
    {
      title: 'ID',
      dataIndex: 'course_id',
      key: 'course_id',
    },
    {
      title: 'Course code',
      dataIndex: 'course_code',
      key: 'course_code',
    },
    {
      title: 'Course name',
      dataIndex: 'course_name',
      key: 'course_name',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <div>
          <Tooltip title="Edit">
            <Button
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
              style={{ marginRight: 8 }}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record.course_id)}
              danger
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <div className="container-fluid container-fluid-custom">
        <h4>Course</h4>
        <div className="d-flex justify-content-between mt-5 mb-4">
          <div className="d-flex">
            <Button
              type="primary"
              className="me-2"
              onClick={() => setAddModalVisible(true)}
            >
              Add course
            </Button>
            <Tooltip title="Supported formats: .csv, .xls, .xlsx">
              <Upload customRequest={handleUpload} accept=".csv,.xls,.xlsx">
                <Button icon={<UploadOutlined />} loading={uploading}>
                  Import courses
                </Button>
              </Upload>
            </Tooltip>
            <Button
              icon={<ExportOutlined />}
              onClick={handleExport}
              style={{ marginLeft: 8 }}
            >
              Export to Excel
            </Button>
          </div>
          <div>
            <Input.Search
              placeholder="Search by course code or course name"
              onChange={handleSearch}
              style={{ width: 400 }}
            />
          </div>
        </div>
        <Table
          columns={getColumns()}
          dataSource={filteredCourses.map((course, index) => ({
            ...course,
            key: index,
          }))}
        />
        <AddCourseModal
          visible={isAddModalVisible}
          onClose={() => setAddModalVisible(false)}
          onCreate={handleCreateNewCourse}
        />
        {editingCourse && (
          <EditCourseModal
            visible={!!editingCourse}
            onClose={() => setEditingCourse(null)}
            course={editingCourse}
            onUpdate={handleUpdate}
          />
        )}
      </div>
    </Layout>
  );
}

export default CourseTeacherManagement;
