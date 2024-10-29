import React, { useState, useEffect } from "react";
import {
  Card,
  Col,
  Row,
  Button,
  Divider,
  Typography,
  List,
  message,
  Spin,
} from "antd";
import {
  BarChartOutlined,
  TableOutlined,
  AppstoreOutlined,
  CalendarOutlined,
  CheckSquareOutlined,
} from "@ant-design/icons";
import { useParams } from "react-router-dom";
import axios from "axios";
import Kanban from "./ProjectManagments/Kanban";
import Scrum from "./ProjectManagments/Scrum";
import Dashboard from "./ProjectManagments/Services/Dashboard";
import GanttChart from "./ProjectManagments/Services/GanttChart";
import XP from "./ProjectManagments/XP";

const { Title, Text } = Typography;

const ProjectManagement = ({ project }) => {
  const [selectedView, setSelectedView] = useState("Dashboard");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  const handleViewChange = (view) => {
    setSelectedView(view);
  };

  // Fetch tasks when the selected view is "Task"
  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/v1/tasks/getTask/${id}`);
        setTasks(response.data.getTasks); // Assuming tasks are in response.data.getTasks
      } catch (error) {
        message.error(error.message || "Failed to fetch tasks");
      } finally {
        setLoading(false);
      }
    };

    if (selectedView === "Task") {
      fetchTasks();
    }
  }, [selectedView, id]);

  return (
    <div style={{ padding: "20px" }}>
      <Title level={2} style={{ textAlign: "center", color: "#1890ff" }}>
        Project Management
      </Title>
      <Divider />

      {/* Header Navigation */}
      <Row justify="center" style={{ marginBottom: "20px" }}>
        {[
          { view: "Dashboard", icon: <AppstoreOutlined />, label: "Dashboard" },
          { view: "Task", icon: <CheckSquareOutlined />, label: "Task" },
          { view: "Board", icon: <AppstoreOutlined />, label: "Board" },
          { view: "Gantt", icon: <CalendarOutlined />, label: "Gantt Chart" },
        ].map(({ view, icon, label }) => (
          <Button
            key={view}
            type={selectedView === view ? "primary" : "default"}
            icon={icon}
            onClick={() => handleViewChange(view)}
            style={{ margin: "0 5px", padding: "8px 20px" }}
          >
            {label}
          </Button>
        ))}
      </Row>

      {/* Main Content */}
      <Row gutter={[16, 16]}>
        {/* Project Overview & Statistics */}
        <Col xs={24} md={12}>
          <Card
            title="Project Overview"
            bordered={false}
            style={{
              borderRadius: "8px",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Text type="secondary">
              Summary and project details will display here.
            </Text>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card
            title="Statistics"
            bordered={false}
            style={{
              borderRadius: "8px",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Text type="secondary">
              Statistics related to this project go here.
            </Text>
          </Card>
        </Col>

        {/* Selected View Content */}
        <Col span={24}>
          <Card
            title={selectedView}
            bordered={false}
            style={{
              borderRadius: "8px",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            {selectedView === "Task" && (
              <>
                {loading ? (
                  <div style={{ textAlign: "center", padding: "20px" }}>
                    <Spin tip="Loading tasks..." size="large" />
                  </div>
                ) : (
                  <List
                    bordered
                    dataSource={tasks}
                    renderItem={(task) => (
                      <List.Item style={{ padding: "12px 24px" }}>
                        <List.Item.Meta
                          title={<Text strong>{task.title}</Text>}
                          description={
                            task.description || "No description provided"
                          }
                        />
                      </List.Item>
                    )}
                  />
                )}
              </>
            )}
            {selectedView === "Gantt" && <GanttChart />}

            {selectedView === "Board" && (
              <>
                {project.methodology === "Scrum" ? (
                  <Scrum />
                ) : project.methodology === "Kanban" ? (
                  <Kanban />
                ) : project.methodology === "XP" ? (
                  <XP />
                ) : (
                  <Text>No board available for the selected methodology.</Text>
                )}
              </>
            )}
            {selectedView === "Dashboard" && <Dashboard projects={project} />}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ProjectManagement;
