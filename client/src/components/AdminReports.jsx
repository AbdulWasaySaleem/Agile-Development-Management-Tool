import React, { useEffect, useState } from "react";
import { Layout, Card, Row, Col, Typography, Table, Button, Tag, message } from "antd";
import axios from "axios";

const { Header, Content } = Layout;
const { Title, Text } = Typography;

const ProjectReport = () => {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState({}); // Store tasks by project ID

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/v1/project/all-project");
      if (response.data.success) {
        setProjects(response.data.projects);
        // Fetch tasks for each project after getting all projects
        await Promise.all(response.data.projects.map(project => fetchTasks(project._id)));
      } else {
        message.error("Failed to fetch projects.");
      }
    } catch (error) {
      message.error("Error fetching projects: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchTasks = async (projectId) => {
    try {
      const response = await axios.get(`http://localhost:3001/api/v1/tasks/getTask/${projectId}`);
      console.log("response", response); // Debugging
      // Access the tasks through response.data.getTasks
      if (response.data.success && Array.isArray(response.data.getTasks)) {
        setTasks(prevTasks => ({ ...prevTasks, [projectId]: response.data.getTasks }));
      } else {
        message.error("No tasks found for project ID: " + projectId);
      }
    } catch (error) {
      message.error("Failed to fetch tasks for project ID " + projectId);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const columns = [
    {
      title: "Task Name",
      dataIndex: "title",  // Change from "name" to "title"
      key: "title",         // Also update the key
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => <Tag color={getStatusColor(status)}>{status}</Tag>,
    },
    {
      title: "Assignee",
      dataIndex: "assignedTo",  // Use "assignedTo" instead of "assignee" if that's what your API returns
      key: "assignedTo",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "To Do": return "orange";
      case "In Progress": return "blue";
      case "Done": return "green";
      default: return "grey";
    }
  };

  return (
    <Layout style={{ minHeight: "100vh", backgroundColor: "#f0f2f5", padding: "24px" }}>
      <Header style={{ backgroundColor: "#001529", padding: "0 24px" }}>
        <Title level={3} style={{ color: "#fff", margin: 0 }}>Project Report</Title>
      </Header>
      <Content style={{ padding: "24px" }}>
        {loading ? <Text>Loading...</Text> : 
          projects.map((project) => (
            <Card title={project.title} bordered={false} key={project._id} style={{ marginBottom: "16px" }}>
              <Text>{project.description}</Text>
              <Row style={{ marginTop: "16px" }}>
                <Col span={12}><Text strong>Status: <Tag color={getStatusColor(project.status)}>{project.status}</Tag></Text></Col>
                <Col span={12}><Text strong>Due Date: {new Date(project.endDate).toLocaleDateString()}</Text></Col>
              </Row>
              <Title level={4} style={{ marginTop: "16px" }}>Tasks</Title>
              <Table
                columns={columns}
                dataSource={Array.isArray(tasks[project._id]) ? tasks[project._id] : []} // Ensure it's an array
                rowKey="_id"
                pagination={false}
              />
              <Row justify="end" style={{ marginTop: "16px" }}>
                <Button type="primary">Download Report</Button>
              </Row>
            </Card>
          ))
        }
      </Content>
    </Layout>
  );
};

export default ProjectReport;
