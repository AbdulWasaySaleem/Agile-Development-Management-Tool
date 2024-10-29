import React, { useEffect, useState } from 'react';
import { Table, Typography, message } from 'antd';
import axios from 'axios';

const { Title } = Typography;

const Allusers = () => {
  const [users, setUsers] = useState([]); // State to hold users
  const [loading, setLoading] = useState(false); // State to manage loading

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/api/v1/auth/all-users'); // Fetch all users
        const { users } = response.data; // Destructure users from response
        setUsers(users); // Set users in state
      } catch (error) {
        message.error(error.message || "Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers(); // Call the function to fetch users
  }, []); // Empty dependency array means this runs once when the component mounts

  // Define the columns for the Ant Design Table
  const columns = [
    {
      title: 'User ID',
      dataIndex: '_id',
      key: '_id',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Skills',
      dataIndex: 'skills',
      key: 'skills',
      render: (skills) => skills.join(', '), // Assuming skills is an array
    },
    {
      title: 'Profile Picture',
      dataIndex: 'profilePicture',
      key: 'profilePicture',
      render: (profilePicture) => (
        <img
          src={profilePicture.url} // Access the URL from the profilePicture object
          alt="Profile"
          style={{ width: 50, height: 50, borderRadius: '50%' }} // Styling for the image
        />
      ),
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <Title level={2}>All Users</Title>
      <Table
        dataSource={users}
        columns={columns}
        pagination={false}
        bordered
        loading={loading} // Show loading indicator
        rowKey="_id" // Use user ID as the row key
      />
    </div>
  );
};

export default Allusers;
