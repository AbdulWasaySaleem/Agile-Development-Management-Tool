import React, { useEffect, useState } from "react";
import { Row, Col, Card, Typography, Divider, Statistic, message } from "antd";
import {
  UserOutlined,
  CheckCircleOutlined,
  BarChartOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { useParams } from "react-router-dom";

const { Title } = Typography;

const Dashboard = ({ projects }) => {
  const { id } = useParams();
  
  const [tasks, setTasks] = useState({ todo: [], inProgress: [], done: [] });
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/v1/tasks/getTask/${id}`);
        const fetchedTasks = response.data.getTasks;

        // Normalize status to lowercase
        const organizedTasks = {
          todo: fetchedTasks.filter(
            (task) =>
              task.status.toLowerCase() === "todo" ||
              task.status.toLowerCase() === "to do"
          ),
          inProgress: fetchedTasks.filter(
            (task) => task.status.toLowerCase() === "inprogress"
          ),
          done: fetchedTasks.filter(
            (task) => task.status.toLowerCase() === "done"
          ),
        };

        setTasks(organizedTasks);
      } catch (error) {
        message.error(error.message || "Failed to fetch tasks");
      } finally {
        setLoading(false);
      }
    };
    
    fetchTasks();
  }, [id]);

  const totalUsers = projects?.members?.length || 0; // Get total users from members
  const totalTasks = tasks.todo.length + tasks.inProgress.length + tasks.done.length;
  const completedTasks = tasks.done.length;
  const completionPercentage = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div style={{ padding: "20px" }}>
      <Title level={2} style={{ textAlign: "center", color: "#1890ff" }}>
        Project Dashboard
      </Title>
      <Divider />

      {/* Statistics Section */}
      <Row gutter={[16, 16]} style={{ marginBottom: "20px" }}>
        {[
          { title: "Total Users", value: totalUsers, icon: <UserOutlined /> },
          { title: "Total Tasks", value: totalTasks, icon: <CheckCircleOutlined /> },
          {
            title: "Tasks Completed",
            value: `${completionPercentage}%`,
            icon: <BarChartOutlined />,
          },
        ].map((stat, index) => (
          <Col xs={24} sm={12} md={8} key={index}>
            <Card
              bordered={false}
              style={{
                textAlign: "center",
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Statistic
                title={stat.title}
                value={stat.value}
                prefix={stat.icon}
                valueStyle={{ color: "#1890ff" }}
              />
            </Card>
          </Col>
        ))}
      </Row>
      
      {/* Optional: Add any additional sections or components here */}

    </div>
  );
};

export default Dashboard;
