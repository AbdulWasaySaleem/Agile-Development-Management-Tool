import React, { useEffect, useState } from "react";
import {
  Layout,
  Card,
  Row,
  Col,
  Typography,
  message,
  Tag,
  Tooltip,
  Button,
} from "antd";
import BarChart from "../components/UI/Barchart"; // Bar chart component
import LineChart from "../components/UI/LineChart"; // Line chart component
import { useAuth } from "../components/Context/UserContext";
import axios from "axios";
import { Link } from "react-router-dom";
import { PlusOutlined } from "@ant-design/icons"; // Import the desired Ant Design icon

const { Header, Content } = Layout;
const { Title, Text } = Typography;

const Homepage = () => {
  const [auth] = useAuth();
  const user = auth?.user;

  const [loading, setLoading] = useState(true); // State for loading status
  const [tasks, setTasks] = useState([]); // State to store tasks
  const [taskCounts, setTaskCounts] = useState({}); // State for task status counts
  const [projects, setProjects] = useState([]); // State for projects

  const fetchProjects = async () => {
    try {
      const response = await axios.get("/api/v1/project/all-project");
      if (response.data.success) {
        setProjects(response.data.projects);
      } else {
        message.error("Failed to fetch projects.");
      }
    } catch (err) {
      console.error("Error fetching projects:", err);
      message.error("Error fetching projects.");
    } finally {
      setLoading(false);
    }
  };

  const fetchTasks = async () => {
    setLoading(true); // Set loading to true before fetching
    try {
      const response = await axios.get(
        "http://localhost:3001/api/v1/tasks/alltask"
      );
      if (response.data) {
        setTasks(response.data);
        calculateTaskCounts(response.data); // Calculate task counts after fetching
      } else {
        message.error("No tasks found!");
      }
    } catch (error) {
      message.error("Failed to fetch tasks!");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const calculateTaskCounts = (tasks) => {
    const counts = {
      todo: 0,
      inProgress: 0,
      done: 0,
      total: tasks.length, // Count total tasks
    };

    tasks.forEach((task) => {
      if (task.status === "To Do") {
        counts.todo += 1;
      } else if (task.status === "inProgress") {
        counts.inProgress += 1;
      } else if (task.status === "done") {
        counts.done += 1;
      }
    });

    setTaskCounts(counts); // Update the state with the counts
  };

  useEffect(() => {
    fetchTasks();
    fetchProjects();
  }, []); // Fetch tasks on component mount

  return (
    <Layout
      style={{ minHeight: "100vh", backgroundColor: "#f0f2f5", padding: "6px" }}
    >
      <Header style={{ backgroundColor: "#001529", padding: "0 24px" }}>
        <Title level={3} style={{ color: "#fff", margin: 0 }}>
          {user?.name || "User"}
        </Title>
      </Header>

      <Content style={{ padding: "24px" }}>
        {/* Project Overview */}
        <Card
          title="Project Overview"
          bordered={false}
          style={{ marginBottom: "16px" }}
        >
          <Text>Summary of project details or KPIs can go here.</Text>
        </Card>

        {/* Task Statuses */}
        <Card
          title="Task Statuses"
          bordered={false}
          style={{ marginBottom: "16px" }}
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} md={8}>
              <Card>
                <Title level={4}>To Do</Title>
                <Text>{taskCounts.todo || 0} tasks</Text>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card>
                <Title level={4}>In Progress</Title>
                <Text>{taskCounts.inProgress || 0} tasks</Text>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card>
                <Title level={4}>Done</Title>
                <Text>{taskCounts.done || 0} tasks</Text>
              </Card>
            </Col>
            <Col span={24}>
              {loading ? (
                <Text>Loading tasks...</Text>
              ) : (
                <Text>Total Tasks: {taskCounts.total || 0}</Text>
              )}
            </Col>
          </Row>
          <Row justify="end" style={{ marginTop: "16px" }}>
            <Link to="/tasks">
              {" "}
              {/* Change this to your desired route */}
              <Button type="link" icon={<PlusOutlined />}>
                View More
              </Button>
            </Link>
          </Row>
        </Card>

        {/* Projects Status */}
        <Card
          title="Project Statuses"
          bordered={false}
          style={{ marginBottom: "16px" }}
        >
          <Row gutter={[16, 16]}>
            {loading ? (
              <Text>Loading projects...</Text>
            ) : (
              projects.map((project) => (
                <Col xs={24} sm={12} md={8} key={project._id}>
                  <Card
                    title={project.title}
                    bordered={true}
                    style={{ borderColor: getStatusColor(project.status) }}
                  >
                    <Text>{project.description}</Text>
                    <Row justify="space-between" style={{ marginTop: "16px" }}>
                      <Text strong>
                        Status:{" "}
                        <Tag color={getStatusColor(project.status)}>
                          {project.status}
                        </Tag>
                      </Text>
                      <Text>
                        Start:{" "}
                        {new Date(project.startDate).toLocaleDateString()}
                      </Text>
                      <Text>
                        End: {new Date(project.endDate).toLocaleDateString()}
                      </Text>
                    </Row>
                    <Row gutter={8} style={{ marginTop: "16px" }}>
                      {project.members.map((member) => (
                        <Col key={member._id} style={{ textAlign: "center" }}>
                          <Tooltip title={member.name}>
                            <img
                              src={member.profilePicture.url}
                              alt={member.name}
                              style={{ width: "30px", borderRadius: "50%" }}
                            />
                          </Tooltip>
                          <Text
                            style={{
                              display: "block",
                              marginTop: "4px",
                              fontSize: "12px",
                            }}
                          >
                            {member.username}
                          </Text>
                        </Col>
                      ))}
                    </Row>
                  </Card>
                </Col>
              ))
            )}
          </Row>

          {/* View More Button or Avatar */}
          <Row justify="end" style={{ marginTop: "16px" }}>
            <Link to="/adminProjects">
              {" "}
              {/* Change this to your desired route */}
              <Button type="link" icon={<PlusOutlined />}>
                View More
              </Button>
            </Link>
          </Row>
        </Card>

        {/* Charts */}
        <Card title="Project Metrics" bordered={false}>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Card bordered={false} style={{ backgroundColor: "#fafafa" }}>
                <BarChart />
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card bordered={false} style={{ backgroundColor: "#fafafa" }}>
                <LineChart />
              </Card>
            </Col>
          </Row>
        </Card>
      </Content>
    </Layout>
  );
};

// Helper function to get status color
const getStatusColor = (status) => {
  switch (status) {
    case "not started":
      return "grey";
    case "in progress":
      return "orange";
    case "done":
      return "green";
    default:
      return "blue"; // Default for any unexpected status
  }
};

export default Homepage;
