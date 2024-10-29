import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Card,
  Button,
  Input,
  Typography,
  Modal,
  DatePicker,
  message,
  Select,
  Spin,
  Popconfirm,
} from "antd";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import dayjs from "dayjs";
import { useParams } from "react-router-dom";
import axios from "axios";
import { DeleteOutlined } from "@ant-design/icons";
import AddTask from "./Services/AddTask";

const { Title } = Typography;
const { Option } = Select;

const Scrum = () => {
  const { id } = useParams();
  const [tasks, setTasks] = useState({ todo: [], inProgress: [], done: [] });
  const [loading, setLoading] = useState(false);
  const [sprintModalVisible, setSprintModalVisible] = useState(false);
  const [taskModalVisible, setTaskModalVisible] = useState(false);
  const [newSprint, setNewSprint] = useState({
    name: "",
    startDate: null,
    endDate: null,
  });
  const [sprints, setSprints] = useState([]);
  const [selectedSprint, setSelectedSprint] = useState(null);
  const [availableTasks, setAvailableTasks] = useState([]);
  const [selectedTaskIds, setSelectedTaskIds] = useState([]);

  useEffect(() => {
    const fetchSprints = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/v1/sprint/all-sprints/${id}`
        );
        if (response.data.success) {
          setSprints(response.data.data);
        } else {
          message.error("Failed to fetch sprints.");
        }
      } catch (error) {
        message.error("Error fetching sprints.");
        console.error("Fetch sprints error:", error);
      }
    };

    fetchSprints();
  }, [id]);

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/v1/tasks/getTask/${id}`);
        setAvailableTasks(response.data.getTasks); // Assuming tasks are in response.data.getTasks
      } catch (error) {
        message.error(error.message || "Failed to fetch tasks");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [id]);

  // Fetch tasks related to the selected sprint
  const fetchTasksForSprint = async (sprintId) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `/api/v1/tasks/get-task-sprint/${sprintId}`
      );
      if (response.data.success) {
        const tasksForSprint = response.data.tasks;
        const updatedTasks = {
          todo: tasksForSprint.filter(
            (task) =>
              task.status.toLowerCase() === "todo" ||
              task.status.toLowerCase() === "to do"
          ),
          inProgress: tasksForSprint.filter(
            (task) => task.status.toLowerCase() === "inprogress"
          ),
          done: tasksForSprint.filter(
            (task) => task.status.toLowerCase() === "done"
          ),
        };
        setTasks(updatedTasks);
      } else {
        message.error("Failed to fetch tasks for this sprint.");
      }
    } catch (error) {
      message.error("Error fetching tasks for this sprint.");
      console.error("Fetch tasks for sprint error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSprint = (sprintId) => {
    setSelectedSprint(sprintId);
    fetchTasksForSprint(sprintId);
  };

  const handleAddSprint = async () => {
    if (!newSprint.name || !newSprint.startDate || !newSprint.endDate) {
      message.error("Please fill in all fields.");
      return;
    }

    const sprintData = {
      name: newSprint.name,
      startDate: newSprint.startDate.toISOString(),
      endDate: newSprint.endDate.toISOString(),
    };

    try {
      const response = await axios.post(
        `/api/v1/sprint/add-sprint/${id}`,
        sprintData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        message.success(response.data.message);
        setSprintModalVisible(false); // Close modal on success
        setNewSprint({ name: "", startDate: null, endDate: null });
      } else {
        message.error(response.data.message || "Failed to add sprint.");
      }
    } catch (error) {
      message.error("Something went wrong while adding the sprint.");
      console.error("Sprint addition error:", error);
    }
  };

  const assignTasksToSprint = async () => {
    if (!selectedTaskIds.length || !selectedSprint) {
      message.error("Please select tasks and a sprint.");
      return;
    }

    try {
      const response = await axios.patch(`/api/v1/tasks/assign-sprint`, {
        sprintId: selectedSprint,
        taskIds: selectedTaskIds,
      });

      if (response.data.success) {
        message.success("Tasks assigned to sprint successfully.");
        setTaskModalVisible(false); // Close modal on success
        setSelectedTaskIds([]);
      } else {
        message.error(response.data.message || "Failed to assign tasks.");
      }
    } catch (error) {
      message.error("Error assigning tasks.");
      console.error("Assign task error:", error);
    }
  };

  const onDragEnd = async(result) => {
    const { source, destination } = result;

    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    const sourceColumn = tasks[source.droppableId];
    const [movedTask] = sourceColumn.splice(source.index, 1);
    const destinationColumn = tasks[destination.droppableId];
    destinationColumn.splice(destination.index, 0, movedTask);

      // Update status only if task moved to a different column
      if (source.droppableId !== destination.droppableId) {
         try {
           // Send patch request with normalized status
           const response = await axios.patch(`/api/v1/tasks/patchTask/${movedTask._id}/move`, {
             status: destination.droppableId,
           });
           if (response.data.success) {
             message.success("Task status updated successfully");
           }
         } catch (error) {
           message.error("Failed to update task status");
           return;
         }
       }


    setTasks({
      ...tasks,
      [source.droppableId]: sourceColumn,
      [destination.droppableId]: destinationColumn,
    });
  };

  const handleDeleteSprint = async (sprintId) => {
    try {
      const response = await axios.delete(
        `/api/v1/sprint/delete-sprint/${sprintId}`
      );
      if (response.data.success) {
        message.success(response.data.message);
        setSprints(sprints.filter((sprint) => sprint._id !== sprintId));
      } else {
        message.error(response.data.message || "Failed to delete sprint.");
      }
    } catch (error) {
      message.error("Error deleting sprint.");
      console.error("Delete sprint error:", error);
    }
  };

  return (
    <div>
      <AddTask  />
      <Title level={3}>Scrum Board</Title>
      <Button
        onClick={() => setSprintModalVisible(true)}
        type="dashed"
        style={{ marginBottom: 16, marginLeft: 8 }}
      >
        Add Sprint
      </Button>
      <Button
        onClick={() => setTaskModalVisible(true)}
        type="default"
        style={{ marginBottom: 16, marginLeft: 8 }}
      >
        Assign Tasks
      </Button>
      <div style={{ marginBottom: 16 }}>
        {sprints.map((sprint) => (
          <div
            key={sprint._id}
            style={{
              display: "inline-flex",
              alignItems: "center",
              marginRight: 8,
              marginBottom: 8,
            }}
          >
            <Button onClick={() => handleSelectSprint(sprint._id)}>
              {sprint.name} ({dayjs(sprint.startDate).format("MM/DD/YYYY")} -{" "}
              {dayjs(sprint.endDate).format("MM/DD/YYYY")})
            </Button>
            <Popconfirm
              title="Are you sure you want to delete this sprint?"
              onConfirm={() => handleDeleteSprint(sprint._id)}
              okText="Yes"
              cancelText="No"
            >
              <DeleteOutlined
                style={{
                  color: "red",
                  marginLeft: 4,
                  fontSize: "16px",
                  cursor: "pointer",
                }}
              />
            </Popconfirm>
          </div>
        ))}
      </div>
      {loading ? (
        <Spin />
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <Row gutter={16}>
            {["todo", "inProgress", "done"].map((status) => (
              <Col span={8} key={status}>
                <Droppable droppableId={status}>
                  {(provided) => (
                    <Card
                      title={status.charAt(0).toUpperCase() + status.slice(1)}
                      style={{ minHeight: "400px" }}
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      {tasks[status]?.map((task, index) => (
                        <Draggable
                          key={task._id}
                          draggableId={task._id}
                          index={index}
                        >
                          {(provided) => (
                            <Card
                              title={task.title}
                              style={{ marginBottom: 8 }}
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <p>{task.description}</p>
                            </Card>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </Card>
                  )}
                </Droppable>
              </Col>
            ))}
          </Row>
        </DragDropContext>
      )}
      {/* Add Sprint Modal */}
      <Modal
        title="Add New Sprint"
        visible={sprintModalVisible}
        onCancel={() => setSprintModalVisible(false)}
        onOk={handleAddSprint}
      >
        <Input
          placeholder="Sprint Name"
          value={newSprint.name}
          onChange={(e) => setNewSprint({ ...newSprint, name: e.target.value })}
        />
        <DatePicker
          placeholder="Start Date"
          style={{ width: "100%", marginTop: 16 }}
          onChange={(date) => setNewSprint({ ...newSprint, startDate: date })}
        />
        <DatePicker
          placeholder="End Date"
          style={{ width: "100%", marginTop: 16 }}
          onChange={(date) => setNewSprint({ ...newSprint, endDate: date })}
        />
      </Modal>
      {/* Assign Tasks to Sprint Modal */}
      <Modal
        title="Assign Tasks to Sprint"
        visible={taskModalVisible}
        onCancel={() => setTaskModalVisible(false)}
        onOk={assignTasksToSprint}
      >
        <Select
          placeholder="Select Sprint"
          style={{ width: "100%", marginBottom: 16 }}
          onChange={(value) => setSelectedSprint(value)}
        >
          {sprints.map((sprint) => (
            <Option key={sprint._id} value={sprint._id}>
              {sprint.name}
            </Option>
          ))}
        </Select>
        <Select
          mode="multiple"
          placeholder="Select Available Tasks"
          style={{ width: "100%", marginBottom: 16 }}
          onChange={(values) => setSelectedTaskIds(values)}
        >
          {availableTasks.map((task) => (
            <Option key={task._id} value={task._id}>
              {task.title}
            </Option>
          ))}
        </Select>
      </Modal>
    </div>
  );
};

export default Scrum;
