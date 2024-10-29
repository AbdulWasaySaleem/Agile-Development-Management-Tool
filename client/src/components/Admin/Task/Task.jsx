import React, { useEffect, useState } from "react";
import { Row, Col, Button, Typography, message, Card } from "antd"; // Import Ant Design components
import AddTask from "../ProjectManagments/Services/AddTask";
import axios from "axios";

const { Title } = Typography;

const Task = () => {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);

  // Fetch all tasks from the API
  const fetchTasks = async () => {
    try {
      const response = await axios.get("/api/v1/tasks/alltask"); // Update with your API endpoint
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setError("Could not fetch tasks. Please try again later.");
      message.error("Could not fetch tasks. Please try again later."); // Display error message
    }
  };

  // Delete a task by ID
  const deleteTask = async (id) => {
    try {
      await axios.delete(`/api/v1/tasks/deleteTask/${id}`); // Update with your API endpoint
      fetchTasks(); // After deleting, fetch the tasks again to update the list
      message.success("Task deleted successfully."); // Success message
    } catch (error) {
      console.error("Error deleting task:", error);
      setError("Could not delete task. Please try again later.");
      message.error("Could not delete task. Please try again later."); // Display error message
    }
  };

  useEffect(() => {
    fetchTasks(); // Fetch tasks when the component mounts
  }, []);

  return (
    <>
      <AddTask onTaskAdded={fetchTasks}/>
      {error && <p>{error}</p>}
      <Title level={2}>Task List</Title>
      <Row gutter={16}>
        {tasks.map((task) => (
          <Col span={8} key={task._id}>
            <Card
              title={task.title}
              extra={
                <Button type="primary" danger onClick={() => deleteTask(task._id)}>
                  Delete
                </Button>
              }
              style={{ marginBottom: 16 }}
            >
              <p><strong>Project:</strong> {task.projectTitle || "None"}</p>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
};

export default Task;
