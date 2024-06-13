import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../../components/Admin/Layout';
import '../../../App.css';
import axios from '../../../api/axios';
import moment from 'moment';
import {
  message,
  Table,
  Card,
  Button,
  Switch,
  Tooltip,
  Row,
  Col,
  Modal,
  Input,
} from 'antd';
import * as XLSX from 'xlsx';
import {
  EditOutlined,
  DeleteOutlined,
  ExportOutlined,
} from '@ant-design/icons';
import EditClassModal from '../../../components/Admin/Class/EditClassModal';
import AddClassModal from '../../../components/Admin/Class/AddClassModal';

const ClassManagementPage = () => {
  const [classes, setClasses] = useState([]);
  const [viewMode, setViewMode] = useState('table');
  const [editingClass, setEditingClass] = useState(null);
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filteredClasses, setFilteredClasses] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    setFilteredClasses(
      classes.filter((cls) =>
        `${cls.class_code} ${cls.course_code} ${cls.course_name} ${cls.username}`
          .toLowerCase()
          .includes(searchText.toLowerCase())
      )
    );
  }, [classes, searchText]);

  const fetchClasses = async () => {
    try {
      const response = await axios.get('/class/all');
      console.log(response.data);
      setClasses(response.data);
    } catch (error) {
      message.error('Failed to fetch classes.');
    }
  };

  const formatDate = (date) => {
    return moment(date).format('DD/MM/YYYY');
  };

  const dayOfWeekAsText = (day) => {
    const days = [
      'Chủ Nhật',
      'Thứ Hai',
      'Thứ Ba',
      'Thứ Tư',
      'Thứ Năm',
      'Thứ Sáu',
      'Thứ Bảy',
    ];
    return days[day];
  };

  const handleDelete = (classId) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this class?',
      content: 'This action cannot be undone',
      onOk() {
        axios
          .delete(`/class/${classId}`)
          .then(() => {
            message.success('Class deleted successfully');
            fetchClasses();
          })
          .catch((error) => {
            message.error('Failed to delete class');
          });
      },
    });
  };

  const handleEdit = (classInfo) => {
    setEditingClass(classInfo);
  };

  const handleUpdate = (classId, values) => {
    axios
      .put(`/class/${classId}`, values)
      .then(() => {
        message.success('Class updated successfully');
        setEditingClass(null);
        fetchClasses();
      })
      .catch((error) => {
        message.error('Failed to update class');
      });
  };

  const handleCreateNewClass = (values) => {
    console.log(values);
    axios
      .post('/class', values)
      .then(() => {
        message.success('Class added successfully');
        fetchClasses();
      })
      .catch((error) => {
        message.error('Failed to add class');
      });
  };

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(classes);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'classes');
    const exportFileName = 'ClassList.xlsx';
    XLSX.writeFile(wb, exportFileName);
  };

  const navigateToClassDetail = (classId) => {
    navigate(`/admin/classes/classDetail/${classId}`);
  };

  const getColumns = () => [
    { title: 'ID', dataIndex: 'class_id', key: 'class_id' },
    { title: 'Class Code', dataIndex: 'class_code', key: 'class_code' },
    { title: 'Course Code', dataIndex: 'course_code', key: 'course_code' },
    { title: 'Course Name', dataIndex: 'course_name', key: 'course_name' },
    { title: 'Teacher', dataIndex: 'username', key: 'username' },
    {
      title: 'Start Date',
      dataIndex: 'date_start',
      key: 'date_start',
      render: (date) => formatDate(date),
    },
    {
      title: 'End Date',
      dataIndex: 'date_finish',
      key: 'date_finish',
      render: (date) => formatDate(date),
    },
    {
      title: 'Day of Week',
      dataIndex: 'day_of_week',
      key: 'day_of_week',
      render: (day) => dayOfWeekAsText(day),
    },
    { title: 'Time Start', dataIndex: 'time_start', key: 'time_start' },
    { title: 'Time Finish', dataIndex: 'time_finish', key: 'time_finish' },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <div>
          <Tooltip title="Edit">
            <Button
              icon={<EditOutlined />}
              style={{ marginRight: 8 }}
              onClick={(e) => {
                e.stopPropagation();
                handleEdit(record);
              }}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              icon={<DeleteOutlined />}
              danger
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(record.class_id);
              }}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  const renderTable = () => (
    <Table
      columns={getColumns()}
      dataSource={filteredClasses.map((cls, index) => ({ ...cls, key: index }))}
      onRow={(record) => ({
        onClick: () => {
          navigateToClassDetail(record.class_id);
        },
      })}
      rowClassName="clickable-row"
    />
  );

  const renderCards = () => (
    <Row gutter={16}>
      {filteredClasses.map((cls) => (
        <Col
          key={cls.class_id}
          span={8}
          onClick={() => navigateToClassDetail(cls.class_id)}
        >
          <Card
            hoverable
            title={`${cls.class_code} (${cls.course_code} - ${cls.course_name})`}
            style={{
              marginBottom: 16,
              borderRadius: '8px',
              borderColor: '#cdc9c9',
            }}
            actions={[
              <Tooltip title="Edit">
                <Button
                  icon={<EditOutlined />}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(cls);
                  }}
                  style={{ border: 'none', color: 'green' }}
                />
              </Tooltip>,
              <Tooltip title="Delete">
                <Button
                  icon={<DeleteOutlined />}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(cls.class_id);
                  }}
                  style={{ border: 'none', color: 'red' }}
                />
              </Tooltip>,
            ]}
          >
            <p>
              <b>Day:</b> {dayOfWeekAsText(cls.day_of_week)}
            </p>
            <p>
              <b>Time:</b> {cls.time_start} - {cls.time_finish}
            </p>
            <p>
              <b>Date:</b> {formatDate(cls.date_start)} -{' '}
              {formatDate(cls.date_finish)}
            </p>
          </Card>
        </Col>
      ))}
    </Row>
  );

  return (
    <Layout>
      <div className="container-fluid container-fluid-custom">
        <div className="d-flex">
          <h4>Class Management</h4>
          <div className="pt-1 ms-3">
            <Switch
              checkedChildren="Cards"
              unCheckedChildren="Table"
              onChange={(checked) => setViewMode(checked ? 'card' : 'table')}
              style={{ marginBottom: 16 }}
            />
          </div>
        </div>
        <div className="d-flex justify-content-between mt-4 mb-4">
          <div>
            <Button type="primary" onClick={() => setAddModalVisible(true)}>
              Add Class
            </Button>
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
              placeholder="Search by class code, course code or course name"
              onChange={handleSearchChange}
              style={{ width: 400 }}
            />
          </div>
        </div>
        {viewMode === 'table' ? renderTable() : renderCards()}
        <AddClassModal
          visible={isAddModalVisible}
          onClose={() => setAddModalVisible(false)}
          onCreate={handleCreateNewClass}
        />

        {editingClass && (
          <EditClassModal
            visible={!!editingClass}
            onClose={() => setEditingClass(null)}
            classData={editingClass}
            onUpdate={handleUpdate}
          />
        )}
      </div>
    </Layout>
  );
};

export default ClassManagementPage;
