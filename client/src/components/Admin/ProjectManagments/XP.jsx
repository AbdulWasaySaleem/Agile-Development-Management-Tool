import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { message, Modal, Form, Input, Select, Button, Checkbox, Card,Typography } from "antd";
const { Title, Text } = Typography;
import axios from "axios";
import AddTask from "../ProjectManagments/Services/AddTask";

const { Option } = Select;
const phases = ["Planning", "Design", "Coding", "Testing", "Release"];
const priorities = ["High", "Medium", "Low"];

const XP = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [availableTasks, setAvailableTasks] = useState([]);
  const [xpPhases, setXpPhases] = useState([]);
  const [selectedPhase, setSelectedPhase] = useState(phases[0]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [form] = Form.useForm();

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/v1/tasks/getTask/${id}`);
      setAvailableTasks(response.data.getTasks || []);
    } catch (error) {
      message.error("Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  const fetchtasksPhase = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/v1/xproute/xp-phase/${id}`);
      console.log("response fetchtasksPhase", response.data);
      setXpPhases(response.data.xpPhases || []);
    } catch (error) {
      message.error("Failed to fetch XP phases");
    } finally {
      setLoading(false);
    }
  };

  const showModal = (taskId) => {
    setSelectedTaskId(taskId);
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    const values = await form.validateFields();
    const { currentPhase, priority, description, designNotes } = values;

    try {
      const response = await axios.post("/api/v1/xproute/xp", {
        projectId: id,
        taskId: selectedTaskId,
        currentPhase,
        priority,
        description,
        designNotes,
      });
      const responses = await axios.patch(
        `/api/v1/tasks/patchTask/${selectedTaskId}/move`,
        {
          status: "In Progress", // or whatever status you want to set
        }
      );
      console.log(responses);

      if (response.data.message || responses.data) {
        message.success("XP Phase added successfully");
        setIsModalVisible(false);
      }
      fetchTasks();
      form.resetFields();
      fetchtasksPhase();
    } catch (error) {
      message.error("Failed to create XP Phase");
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleTaskAdded = (newTask) => {
    setAvailableTasks((prevTasks) => [...prevTasks, newTask]);
  };

  const updatePhase = async (xpPhaseId, newPhase) => {
    try {
      const response = await axios.patch(
        `/api/v1/xproute/update-phase/${xpPhaseId}`,
        {
          currentPhase: newPhase,
        }
      );
      if (response.data.message) {
        message.success("XP Phase updated successfully");
        fetchtasksPhase();
      }
    } catch (error) {
      message.error("Failed to update XP Phase");
    }
  };

  const updateCodingFields = async (xpPhaseId, updates) => {
    try {
      const response = await axios.patch(
        `/api/v1/xproute/update-code-fields/${xpPhaseId}`,
        updates
      );
      if (response.data.message) {
        message.success("Additional fields updated successfully");
        fetchtasksPhase();
      }
    } catch (error) {
      message.error("Failed to update additional fields");
    }
  };

  const updateTestingFields = async (xpPhaseId, updates) => {
    try {
      console.log("updates", updates, xpPhaseId);
      const response = await axios.patch(
        `/api/v1/xproute/update-test-fileds/${xpPhaseId}`,
        updates
      );
      if (response.data.message) {
        message.success("Testing fields updated successfully");
        fetchtasksPhase();
      }
    } catch (error) {
      message.error("Failed to update testing fields");
    }
  };

  const updateReleaseFields = async (xpPhaseId, updates) => {
    try {
      console.log("updates", updates, xpPhaseId);
      const response = await axios.patch(
        `/api/v1/xproute/update-release-fileds/${xpPhaseId}`,
        updates
      );
      if (response.data.message) {
        message.success("Release fields updated successfully");
        fetchtasksPhase();
      }
    } catch (error) {
      message.error("Failed to update release fields");
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchtasksPhase();
  }, [id]);

  console.log("availableTasks", availableTasks);
  return (
    

<div>
  <AddTask onTaskAdded={handleTaskAdded} />

  <div style={{ marginBottom: '20px' }}>
  <Text>All Tasks:</Text>
    {availableTasks.map(
      (task) =>
        task.status === "To Do" && (
          <Card
            key={task._id}
            style={{ marginBottom: '10px' }}
            bordered={true}
          >
            <Title level={4}>
              <strong>Title:</strong> {task.title}
            </Title>
            <Text>
              <strong>Description:</strong> {task.description}
            </Text>
            <div style={{ marginTop: '10px' }}>
              <Button type="primary" onClick={() => showModal(task._id)}>
                Add to XP
              </Button>
            </div>
          </Card>
        )
    )}
  </div>

  {/* Phase Selector */}
  <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
    {phases.map((phase) => (
      <Button
        key={phase}
        onClick={() => setSelectedPhase(phase)}
        style={{
          padding: "10px 20px",
          backgroundColor: selectedPhase === phase ? "#1890ff" : "#f0f0f0",
          color: selectedPhase === phase ? "#fff" : "#000",
          border: "1px solid #ccc",
          cursor: "pointer",
        }}
      >
        {phase}
      </Button>
    ))}
  </div>

  {/* Display XP Phases for Selected Phase */}
  <div>
    <Title level={3}>{selectedPhase} Phases</Title>
    {xpPhases
      .filter((xpPhase) => xpPhase.currentPhase === selectedPhase)
      .map((xpPhase) => (
        <Card
          key={xpPhase._id}
          style={{ marginBottom: '10px' }}
          bordered={true}
        >
          <Title level={4}>
            <strong>Task Description:</strong> {xpPhase.planning?.taskDescription}
            
          </Title>
          <Text>
            <strong>Priority:</strong> {xpPhase.planning?.priority}
          </Text>
          <p></p>
          <Text>
            <strong>Status:</strong> {xpPhase.status}
          </Text>
          <p></p>
          {/* Additional fields for Coding phase */}
          {selectedPhase === "Coding" && (
            <div>
              <Title level={5}>Code Readiness</Title>
              <Checkbox
                checked={xpPhase.coding?.codeReady}
                onChange={(e) =>
                  updateCodingFields(xpPhase._id, {
                    codeReady: e.target.checked,
                  })
                }
              >
                Code Ready
              </Checkbox>
              <Checkbox
                checked={xpPhase.coding?.readyForReview}
                onChange={(e) =>
                  updateCodingFields(xpPhase._id, {
                    readyForReview: e.target.checked,
                  })
                }
              >
                Ready for Review
              </Checkbox>
              <Checkbox
                checked={xpPhase.coding?.pairProgramming}
                onChange={(e) =>
                  updateCodingFields(xpPhase._id, {
                    pairProgramming: e.target.checked,
                  })
                }
              >
                Pair Programming
              </Checkbox>
            </div>
          )}

          {/* Additional fields for Testing phase */}
          {selectedPhase === "Testing" && (
            <div>
              <Title level={5}>Testing Details</Title>
              <Button
                type={xpPhase.testing?.testsPassed ? "primary" : "default"}
                onClick={() =>
                  updateTestingFields(xpPhase._id, {
                    testsPassed: !xpPhase.testing?.testsPassed,
                  })
                }
              >
                {xpPhase.testing?.testsPassed
                  ? "Tests Passed"
                  : "Tests Not Passed"}
              </Button>
            </div>
          )}

          {/* Additional fields for Release phase */}
          {selectedPhase === "Release" && (
            <div>
              <Title level={5}>Release Details</Title>
              <Button
                type={xpPhase.release?.released ? "primary" : "default"}
                onClick={() =>
                  updateReleaseFields(xpPhase._id, { released: true })
                }
                style={{ marginRight: "10px" }}
              >
                Release
              </Button>
              <Button
                type={!xpPhase.release?.released ? "primary" : "default"}
                onClick={() =>
                  updateReleaseFields(xpPhase._id, { released: false })
                }
              >
                Do Not Release
              </Button>
            </div>
          )}

          {/* Add a button to change the phase */}
          <Select
            defaultValue={xpPhase.currentPhase}
            onChange={(newPhase) => updatePhase(xpPhase._id, newPhase)}
            style={{ width: 120, marginTop: '10px' }}
          >
            {phases.map((phase) => (
              <Option key={phase} value={phase}>
                {phase}
              </Option>
            ))}
          </Select>
        </Card>
      ))}
  </div>

  {/* Modal for Adding XP */}
  <Modal
    title="Add XP Phase"
    visible={isModalVisible}
    onOk={handleOk}
    onCancel={handleCancel}
    footer={[
      <Button key="back" onClick={handleCancel}>
        Cancel
      </Button>,
      <Button key="submit" type="primary" onClick={handleOk}>
        Submit
      </Button>,
    ]}
  >
    <Form form={form} layout="vertical">
      <Form.Item
        name="currentPhase"
        label="Current Phase"
        rules={[{ required: true, message: "Please select the phase!" }]}
      >
        <Select placeholder="Select a phase">
          {phases.map((phase) => (
            <Option key={phase} value={phase}>
              {phase}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        name="priority"
        label="Priority"
        rules={[{ required: true, message: "Please select a priority!" }]}
      >
        <Select placeholder="Select a priority">
          {priorities.map((priority) => (
            <Option key={priority} value={priority}>
              {priority}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        name="description"
        label="Description"
        rules={[{ required: true, message: "Please enter a description!" }]}
      >
        <Input.TextArea />
      </Form.Item>
      <Form.Item name="designNotes" label="Design Notes">
        <Input.TextArea />
      </Form.Item>
    </Form>
  </Modal>
</div>

  );
};

export default XP;
