import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Select, message, Typography } from 'antd';

const { Title } = Typography;
const { Option } = Select;

const PendingUsers = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [role, setRole] = useState('');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchPendingUsers = async () => {
      try {
        const response = await axios.get('/api/v1/auth/pendinguser');
        if (response.data.sucess && Array.isArray(response.data.user)) {
          setPendingUsers(response.data.user);
        } else {
          console.error('API response does not contain a valid user array');
        }
      } catch (error) {
        console.error('Error fetching pending users:', error);
      }
    };
    fetchPendingUsers();
  }, []);

  const handleClickOpen = (user) => {
    setSelectedUser(user);
    setRole(user.role);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedUser(null);
  };

  const handleApprove = async () => {
    try {
      const res = await axios.put(`http://localhost:3001/api/v1/auth/${selectedUser._id}/approve`, { role });
      if (res.data.success) {
        message.success('User approved successfully!');
        setPendingUsers(pendingUsers.filter((user) => user._id !== selectedUser._id));
        handleClose();
      } else {
        message.error('Failed to approve user');
      }
    } catch (error) {
      console.error('Error approving user:', error);
      message.error('Error approving user');
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, user) => (
        <Button type="primary" onClick={() => handleClickOpen(user)}>
          Approve
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: '20px' }}>Pending Users</Title>
      <Table
        columns={columns}
        dataSource={pendingUsers}
        rowKey="_id"
        pagination={{ pageSize: 5 }}
        loading={!pendingUsers.length}
      />

      <Modal
        title="Approve User"
        visible={open}
        onCancel={handleClose}
        onOk={handleApprove}
        okText="Approve"
        cancelText="Cancel"
      >
        <div style={{ marginBottom: '20px' }}>
          <label>Role</label>
          <Select
            value={role}
            onChange={(value) => setRole(value)}
            style={{ width: '100%', marginTop: '10px' }}
          >
            <Option value="admin">Admin</Option>
            <Option value="senior_developer">Senior Developer</Option>
            <Option value="junior_developer">Junior Developer</Option>
            <Option value="HR">HR</Option>
          </Select>
        </div>
      </Modal>
    </div>
  );
};

export default PendingUsers;
