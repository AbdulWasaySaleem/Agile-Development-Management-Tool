import React, { useEffect, useState } from 'react';
import { Table, Typography, message } from 'antd';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs'; // Import Day.js

const { Title } = Typography;

const GanttChart = () => {
  const { id } = useParams(); // Get the project ID from URL parameters
  const [tasks, setTasks] = useState([]); // State to hold tasks
  const [loading, setLoading] = useState(false); // State to manage loading

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/v1/tasks/getTask/${id}`);
        const fetchedTasks = response.data.getTasks;

        // Map the fetched tasks to match your table structure
        const formattedTasks = fetchedTasks.map(task => ({
          key: task._id, // or however you uniquely identify tasks
          name: task.title,
          start: dayjs(task.startDate).format('YYYY-MM-DD'), // Format date with Day.js
          end: dayjs(task.endDate).format('YYYY-MM-DD'), // Format date with Day.js
          status: task.status || 'Not Started', // Ensure there's a default value
        }));

        setTasks(formattedTasks); // Set the formatted tasks in state
      } catch (error) {
        message.error(error.message || "Failed to fetch tasks");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks(); // Call the function to fetch tasks
  }, [id]); // Dependency on project ID

  const columns = [
    {
      title: 'Task Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <a>{text}</a>, // Link or clickable item
    },
    {
      title: 'Start Date',
      dataIndex: 'start',
      key: 'start',
    },
    {
      title: 'End Date',
      dataIndex: 'end',
      key: 'end',
    },
    {
      title: 'Status', // Change this title from Progress to Status
      dataIndex: 'status',
      key: 'status',
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <Title level={2}>Project Gantt Chart</Title>
      <Table
        dataSource={tasks}
        columns={columns}
        pagination={false}
        bordered
        rowKey="key"
        loading={loading} // Show loading indicator
      />
    </div>
  );
};

export default GanttChart;
