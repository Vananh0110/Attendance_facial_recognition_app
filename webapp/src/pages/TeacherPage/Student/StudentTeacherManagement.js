import React, { useEffect, useState } from 'react';
import Layout from '../../../components/Teacher/Layout';
import '../../../App.css';
import axios from '../../../api/axios';
import * as XLSX from 'xlsx';
import {
  Button,
  Table,
  Upload,
  message,
  Tooltip,
  Input,
  Modal,
  Avatar,
} from 'antd';
import {
  UploadOutlined,
  EditOutlined,
  DeleteOutlined,
  ExportOutlined,
  UserOutlined,
} from '@ant-design/icons';
import AddStudentModal from '../../../components/Admin/Student/AddStudentModal';
import EditStudentModal from '../../../components/Admin/Student/EditStudentModal';

const BASE_URL = process.env.REACT_APP_BASE_URL;

const StudentTeacherManagement = () => {
  const [students, setStudents] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [uploading, setUploading] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [isAddModalVisible, setAddModalVisible] = useState(false);

  useEffect(() => {
    fetchStudent();
  }, []);

  const fetchStudent = async () => {
    try {
      const response = await axios.get('/student/all');
      console.log(response.data);
      setStudents(response.data);
    } catch (error) {
      message.error('Failed to fetch students');
    }
  };

  const handleUpload = ({ file, onSuccess, onError }) => {
    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);

    axios
      .post('/student/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(() => {
        message.success('File uploaded successfully');
        fetchStudent();
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

  const filteredStudents = students.filter((student) => {
    return (
      student.username.toLowerCase().includes(searchText) ||
      student.email.toLowerCase().includes(searchText) ||
      student.student_class.toLowerCase().includes(searchText) ||
      student.gender.toLowerCase().includes(searchText) ||
      student.student_code.includes(searchText) ||
      student.phone.includes(searchText)
    );
  });

  const handleDelete = (studentId) => {
    Modal.confirm({
      title: 'Are you sure delete this student?',
      onOk() {
        axios
          .delete(`/student/${studentId}`)
          .then(() => {
            message.success('Student deleted successfully');
            fetchStudent();
          })
          .catch((error) => {
            message.error('Failed to delete student');
          });
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
  };

  const handleUpdate = (studentId, values) => {
    axios
      .put(`/student/${studentId}`, values)
      .then(() => {
        message.success('Student updated successfully');
        setEditingStudent(null);
        fetchStudent();
      })
      .catch((error) => {
        message.error('Failed to update student');
      });
  };

  const handleCreateNewStudent = (values) => {
    axios
      .post('/student', values)
      .then(() => {
        message.success('Student added successfully');
        fetchStudent();
      })
      .catch((error) => {
        message.error('Failed to add student');
      });
  };

  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(students);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Students');
    const exportFileName = 'StudentList.xlsx';
    XLSX.writeFile(wb, exportFileName);
  };

  const getColumns = () => [
    {
      title: 'ID',
      dataIndex: 'student_id',
      key: 'student_id',
    },
    {
      title: 'Image',
      key: 'avatar',
      render: (text, record) => (
        <Avatar
          src={record.avatar_url ? `${BASE_URL}${record.avatar_url}` : undefined}
          alt="avatar"
          size={50}
          style={{ verticalAlign: 'middle' }}
          icon={!record.avatar_url && <UserOutlined />}
          onError={() => {
            return false;
          }}
        />
      ),
    },
    {
      title: 'Name',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Student code',
      dataIndex: 'student_code',
      key: 'student_code',
    },
    {
      title: 'Class',
      dataIndex: 'student_class',
      key: 'student_class',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'gender',
      dataIndex: 'gender',
      key: 'gender',
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
              onClick={() => handleDelete(record.student_id)}
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
        <h4>Students</h4>
        <div className="d-flex justify-content-between mt-5 mb-4">
          <div className="d-flex">
            <Button
              type="primary"
              className="me-2"
              onClick={() => setAddModalVisible(true)}
            >
              Add Student
            </Button>
            <Tooltip title="Supported formats: .csv, .xls, .xlsx">
              <Upload customRequest={handleUpload} accept=".csv,.xls,.xlsx">
                <Button icon={<UploadOutlined />} loading={uploading}>
                  Import Students
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
              placeholder="Search by name, email, phone, student code, class or gender"
              onChange={handleSearch}
              style={{ width: 500 }}
            />
          </div>
        </div>
        <Table
          columns={getColumns()}
          dataSource={filteredStudents.map((student, index) => ({
            ...student,
            key: index,
          }))}
        />
        <AddStudentModal
          visible={isAddModalVisible}
          onClose={() => setAddModalVisible(false)}
          onCreate={handleCreateNewStudent}
        />
        {editingStudent && (
          <EditStudentModal
            visible={!!editingStudent}
            onClose={() => setEditingStudent(null)}
            student={editingStudent}
            onUpdate={handleUpdate}
          />
        )}
      </div>
    </Layout>
  );
}

export default StudentTeacherManagement;
