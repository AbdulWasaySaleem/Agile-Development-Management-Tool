import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  Input,
  List,
  Select,
  Spin,
  message,
  Row,
  Col,
} from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import { useAuth } from "../../../Context/UserContext";

const { Option } = Select;


const AddTask = ({ onTaskAdded }) => {
  const [auth] = useAuth();
  const [title, setTitle] = useState("");
  const [tasks, setTasks] = useState([]);
  const [description, setDescription] = useState("");
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    try {
      const response = await axios.get("/api/v1/project/all-project");
      if (response.data.success) setProjects(response.data.projects);
      else message.error("Failed to fetch projects.");
    } catch (err) {
      message.error("Error fetching projects.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async () => {
    if (!title || !description) {
      message.error("Please enter a title and description!");
      return;
    }

    const taskData = {
      title,
      description,
      assignedBy: auth.user.id,
      assignedTo: selectedProject,
    };

    try {
      const response = await axios.post("/api/v1/tasks/add-new-task", taskData);
      if (response.data.success) {
        message.success("Task added successfully!");
        setTitle("");
        setDescription("");
        setSelectedProject(null);
        onTaskAdded && onTaskAdded(response.data.task);
      } else {
        message.error("Failed to add task!");
      }
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "#f9f9f9",
        borderRadius: "8px",
      }}
    >
      <Row gutter={[16, 16]} justify="center">
        <Col span={8}>
          <Input
            placeholder="Enter task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Col>
        <Col span={8}>
          <Input
            placeholder="Enter task description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Col>
        <Col span={6}>
          <Select
            placeholder="Select a project"
            value={selectedProject}
            onChange={(value) => setSelectedProject(value)}
            style={{ width: "100%" }}
          >
            {projects.map((project) => (
              <Option key={project._id} value={project._id}>
                {project.title} ({project._id})
              </Option>
            ))}
          </Select>
        </Col>
        <Col span={2}>
          <Button
            type="primary"
            onClick={handleAddTask}
            icon={<PlusOutlined />}
          >
            Add Task
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default AddTask;
