import React, { useEffect, useState } from 'react';
import Layout from '../../../components/Admin/Layout';
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
import EditTeacherModal from '../../../components/Admin/Teacher/EditTeacherModal';
import AddTeacherModal from '../../../components/Admin/Teacher/AddTeacherModal';

const TeacherManagementPage = () => {
  const [teachers, setTeachers] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [uploading, setUploading] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [isAddModalVisible, setAddModalVisible] = useState(false);

  useEffect(() => {
    fetchTeacher();
  }, []);

  const fetchTeacher = async () => {
    try {
      const response = await axios.get('/teacher/all');
      console.log(response.data);
      setTeachers(response.data);
    } catch (error) {
      message.error('Failed to fetch teachers');
    }
  };

  const handleUpload = ({ file, onSuccess, onError }) => {
    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);

    axios
      .post('/teacher/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(() => {
        message.success('File uploaded successfully');
        fetchTeacher();
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

  const filteredTeachers = teachers.filter((teacher) => {
    return (
      teacher.username.toLowerCase().includes(searchText) ||
      teacher.email.toLowerCase().includes(searchText) ||
      teacher.phone.includes(searchText)
    );
  });

  const handleDelete = (teacherId) => {
    Modal.confirm({
      title: 'Are you sure delete this teacher?',
      onOk() {
        axios
          .delete(`/teacher/${teacherId}`)
          .then(() => {
            message.success('Teacher deleted successfully');
            fetchTeacher();
          })
          .catch((error) => {
            message.error('Failed to delete teacher');
          });
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const handleEdit = (teacher) => {
    setEditingTeacher(teacher);
  };

  const handleUpdate = (teacherId, values) => {
    axios
      .put(`/teacher/${teacherId}`, values)
      .then(() => {
        message.success('Teacher updated successfully');
        setEditingTeacher(null);
        fetchTeacher();
      })
      .catch((error) => {
        message.error('Failed to update teacher');
      });
  };

  const handleCreateNewTeacher = (values) => {
    axios
      .post('/teacher', values)
      .then(() => {
        message.success('Teacher added successfully');
        fetchTeacher();
      })
      .catch((error) => {
        message.error('Failed to add teacher');
      });
  };

  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(teachers);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Teachers');
    const exportFileName = 'TeacherList.xlsx';
    XLSX.writeFile(wb, exportFileName);
  };

  const getColumns = () => [
    {
      title: 'ID',
      dataIndex: 'teacher_id',
      key: 'teacher_id',
    },
    {
      title: 'Image',
      key: 'avatar',
      render: (text, record) => (
        <Avatar
          src={record.avatar_url ? record.avatar_url : undefined}
          alt="avatar"
          size={50}
          style={{ verticalAlign: 'middle' }}
          icon={<UserOutlined />}
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
              onClick={() => handleDelete(record.teacher_id)}
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
        <h4>Teacher</h4>
        <div className="d-flex justify-content-between mt-5 mb-4">
          <div className="d-flex">
            <Button
              type="primary"
              className="me-2"
              onClick={() => setAddModalVisible(true)}
            >
              Add Teacher
            </Button>
            <Tooltip title="Supported formats: .csv, .xls, .xlsx">
              <Upload customRequest={handleUpload} accept=".csv,.xls,.xlsx">
                <Button icon={<UploadOutlined />} loading={uploading}>
                  Import Teachers
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
              placeholder="Search by name, email or phone"
              onChange={handleSearch}
              style={{ width: 400 }}
            />
          </div>
        </div>
        <Table
          columns={getColumns()}
          dataSource={filteredTeachers.map((teacher, index) => ({
            ...teacher,
            key: index,
          }))}
        />
        <AddTeacherModal
          visible={isAddModalVisible}
          onClose={() => setAddModalVisible(false)}
          onCreate={handleCreateNewTeacher}
        />
        {editingTeacher && (
          <EditTeacherModal
            visible={!!editingTeacher}
            onClose={() => setEditingTeacher(null)}
            teacher={editingTeacher}
            onUpdate={handleUpdate}
          />
        )}
      </div>
    </Layout>
  );
};

export default TeacherManagementPage;
