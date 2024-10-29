import { useEffect, useState } from "react";
import {
  Card,
  Button,
  Row,
  Col,
  Spin,
  Alert,
  Modal,
  Form,
  Input,
  Select,
  message,
} from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const { Option } = Select;

const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const [members, setMembers] = useState([]); // State for members
  const [loadingMembers, setLoadingMembers] = useState(false); // State for loading members

  const navigate = useNavigate();

  // Fetch projects from the API
  const fetchProjects = async () => {
    try {
      const response = await axios.get("/api/v1/project/all-project");
      console.log(response.data.projects);
      if (response.data.success) {
        setProjects(response.data.projects);
      } else {
        setError("Failed to fetch projects.");
      }
    } catch (err) {
      console.error("Error fetching projects:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch members from the API
  const fetchMembers = async () => {
    setLoadingMembers(true);
    try {
      const response = await axios.get("/api/v1/auth/all-users");
      console.log(response.data);
      if (response.data.success) {
        setMembers(response.data.users); // Access the users array correctly
      } else {
        setError("Failed to fetch members.");
      }
    } catch (err) {
      console.error("Error fetching members:", err);
      setError(err.message);
    } finally {
      setLoadingMembers(false);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchMembers(); // Fetch members when the component mounts
  }, []);

  const handleViewDetails = (project) => {
    navigate(`/adminprojects/viewdetail/${project._id}`); // Navigate to the detail page with the project ID
  };

  const handleDeleteProject  = async (projectId) => {
    console.log("Deleting project with ID:", projectId);
    // Add the logic to delete the project
    const response = await axios.delete(`/api/v1/project/delete-project/${projectId}`);
    if(response.data.success) {
      message.success("Project deleted successfully.");
      setProjects((prevProjects) => prevProjects.filter(project => project._id !== projectId));
    } else {
      setError("Failed to delete project.");
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleAddProject = async (values) => {
    try {
      const response = await axios.post("/api/v1/project/post-project", values);
      if (response.data.success) {
        setProjects((prevProjects) => [...prevProjects, response.data.project]);
        handleCancel();
      } else {
        setError("Failed to add project.");
      }
    } catch (err) {
      console.error("Error adding project:", err);
      setError(err.message);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Ongoing Projects</h1>
      {loading ? (
        <Spin tip="Loading projects..." />
      ) : error ? (
        <Alert message="Error" description={error} type="error" showIcon />
      ) : (
        <>
          <Row gutter={16}>
            {projects.map((project) => (
              <Col span={8} key={project._id}>
                <Card
                  title={project.title}
                  bordered={true}
                  style={{ marginBottom: 16 }}
                >
                  <p>Description: {project.description}</p>
                  <p>
                    <strong>Status:</strong> {project.status}
                  </p>
                  <p>
                    <strong>Methodology:</strong> {project.methodology} {/* Display methodology */}
                  </p>
                  <p>
                    <strong>Deadline:</strong> {new Date(project.endDate).toLocaleDateString()}
                  </p>
                  <Button
                    type="primary"
                    onClick={() => handleViewDetails(project)} // Call the updated function
                  >
                    View Details
                  </Button>
                  {/* Add the Delete button here */}
                  <Button
                    type="danger"
                    style={{ marginLeft: 8 }}
                    onClick={() => handleDeleteProject(project._id)}
                  >
                    Delete
                  </Button>
                </Card>
              </Col>
            ))}
          </Row>
          <Button type="dashed" style={{ marginTop: 16 }} onClick={showModal}>
            Add New Project
          </Button>

          <Modal
            title="Add New Project"
            visible={isModalVisible}
            onCancel={handleCancel}
            footer={null}
          >
            <Form form={form} onFinish={handleAddProject}>
              <Form.Item
                name="title"
                label="Project Title"
                rules={[{ required: true, message: "Please input the project title!" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="description"
                label="Description"
                rules={[{ required: true, message: "Please input the project description!" }]}
              >
                <Input.TextArea />
              </Form.Item>
              <Form.Item
                name="startDate"
                label="Start Date"
                rules={[{ required: true, message: "Please select the project start date!" }]}
              >
                <Input type="date" />
              </Form.Item>
              <Form.Item
                name="endDate"
                label="Deadline"
                rules={[{ required: true, message: "Please select the project deadline!" }]}
              >
                <Input type="date" />
              </Form.Item>
              <Form.Item
                name="status"
                label="Status"
                rules={[{ required: true, message: "Please select the project status!" }]}
              >
                <Select placeholder="Select a status">
                  <Option value="not started">Not Started</Option>
                  <Option value="in progress">In Progress</Option>
                  <Option value="completed">Completed</Option>
                </Select>
              </Form.Item>
              {/* Add the new methodology field here */}
              <Form.Item
                name="methodology"
                label="Methodology"
                rules={[{ required: true, message: "Please select a methodology!" }]}
              >
                <Select placeholder="Select a methodology">
                  <Option value="Kanban">Kanban</Option>
                  <Option value="Scrum">Scrum</Option>
                  <Option value="XP">XP</Option>
                  <Option value="PRINCE2">PRINCE2</Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="members"
                label="Members"
                rules={[{ required: true, message: "Please select at least one member!" }]}
              >
                <Select mode="multiple" placeholder="Select members" loading={loadingMembers}>
                  {members.map((member) => (
                    <Option key={member._id} value={member._id}>
                      {member.name} {/* Assuming member object has a name field */}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Add Project
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={handleCancel}>
                  Cancel
                </Button>
              </Form.Item>
            </Form>
          </Modal>
        </>
      )}
    </div>
  );
};

export default AdminProjects;
