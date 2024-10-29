import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Card,
  Button,
  Input,
  Typography,
  Modal,
  message,
} from "antd";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import axios from "axios";
import { useParams } from "react-router-dom";
import AddTask from "./Services/AddTask";

const { Title } = Typography;

const Kanban = () => {
  const [tasks, setTasks] = useState({ todo: [], inProgress: [], done: [] });
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    status: "todo",
  });
  const { id } = useParams();

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

  const handleTaskAdded = async (task) => {
    // Add the new task to the 'todo' column (or any other logic you want)
    const updatedTasks = {
      ...tasks,
      todo: [...tasks.todo, task],
    };
    setTasks(updatedTasks);
    setModalVisible(false); // Close the modal
    setNewTask({ title: "", description: "", status: "todo" }); // Reset the newTask state

    // Optionally, you can save the new task to the backend
    try {
      await axios.post(`/api/v1/tasks/addTask/${id}`, task);
      message.success("Task added successfully");
    } catch (error) {
      console.log(error)
    }
  };

  const onDragEnd = async (result) => {
    const { source, destination } = result;
    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const sourceColumn = Array.from(tasks[source.droppableId]);
    const [movedTask] = sourceColumn.splice(source.index, 1);
    const destinationColumn = Array.from(tasks[destination.droppableId]);
    destinationColumn.splice(destination.index, 0, movedTask);

    // Update status only if task moved to a different column
    if (source.droppableId !== destination.droppableId) {
      try {
        const response = await axios.patch(
          `/api/v1/tasks/patchTask/${movedTask._id}/move`,
          {
            status: destination.droppableId,
          }
        );
        if (response.data.success) {
          message.success("Task status updated successfully");
        }
      } catch (error) {
        message.error("Failed to update task status");
        return;
      }
    }

    // Update UI state after API call
    setTasks({
      ...tasks,
      [source.droppableId]: sourceColumn,
      [destination.droppableId]: destinationColumn,
    });
  };

  return (
    <div>
      <AddTask onTaskAdded={handleTaskAdded} />
      <Title level={3}>Kanban Board</Title>
     
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

      <Modal
        title="Add New Task"
        visible={modalVisible}
        onOk={() => {
          handleTaskAdded(newTask);
        }}
        onCancel={() => setModalVisible(false)}
      >
        <Input
          placeholder="Task Title"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          style={{ marginBottom: 16 }}
        />
        <Input.TextArea
          placeholder="Task Description"
          value={newTask.description}
          onChange={(e) =>
            setNewTask({ ...newTask, description: e.target.value })
          }
          style={{ marginBottom: 16 }}
        />
      </Modal>
    </div>
  );
};

export default Kanban;
