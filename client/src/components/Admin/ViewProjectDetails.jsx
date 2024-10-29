import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Spin,
  Alert,
  Card,
  Typography,
  List,
  Divider,
  Button,
  Dropdown,
  Menu,
  Select,
  Avatar,
  Row,
  Col,
} from "antd";
import { DownOutlined } from "@ant-design/icons";
import ProjectManagement from "./ProjectManagement";

const { Title, Text } = Typography;
const { Option } = Select;

const ViewProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [error, setError] = useState(null);
  const [members, setMembers] = useState([]);
  const [selectedMemberId, setSelectedMemberId] = useState(null);
  const [selectedMethodology, setSelectedMethodology] = useState(null);
  const methodologies = ["Waterfall", "Agile", "Kanban"]; // Add more methodologies as needed

  const fetchProjectDetails = async () => {
    try {
      const response = await axios.get(`/api/v1/project/project/${id}`);
      console.log(response.data.project.methodology);
      if (response.data.success) {
        setProject(response.data.project);
        setSelectedMethodology(response.data.project.methodology); // Set initial methodology
      } else {
        setError("Failed to fetch project details.");
      }
    } catch (err) {
      console.error("Error fetching project details:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchMembers = async () => {
    setLoadingMembers(true);
    try {
      const response = await axios.get("/api/v1/auth/all-users");
      if (response.data.success) {
        setMembers(response.data.users);
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

  const handleStatusChange = async (status) => {
    try {
      await axios.patch(`/api/v1/project/project-status/${id}`, { status });
      setProject((prev) => ({ ...prev, status }));
    } catch (err) {
      console.error("Error updating project status:", err);
      setError(err.message);
    }
  };

  const handleAddMember = async () => {
    if (!selectedMemberId) return;

    try {
      const response = await axios.patch(
        `/api/v1/project/add-new-member/${id}`,
        { userId: selectedMemberId }
      );
      if (response.data.success) {
        const newMember = members.find(
          (member) => member._id === selectedMemberId
        );
        setProject((prev) => ({
          ...prev,
          members: [
            ...prev.members,
            {
              _id: newMember._id,
              name: newMember.name,
              profilePicture: newMember.profilePicture,
              skills: newMember.skills,
            },
          ],
        }));
        setSelectedMemberId(null); // Reset the selected member
      } else {
        setError("Failed to add member.");
      }
    } catch (err) {
      console.error("Error adding member:", err);
      setError(err.message);
    }
  };

  const handleMethodologyChange = async (methodology) => {
    console.log("no")
  };

  useEffect(() => {
    fetchProjectDetails();
    fetchMembers();
  }, [id]);

  if (loading || loadingMembers) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "20px" }}>
        <Spin tip="Loading project details..." />
      </div>
    );
  }

  if (error) {
    return <Alert message="Error" description={error} type="error" showIcon />;
  }

  const statusMenu = (
    <Menu>
      <Menu.Item onClick={() => handleStatusChange("not started")}>Not Started</Menu.Item>
      <Menu.Item onClick={() => handleStatusChange("in progress")}>In Progress</Menu.Item>
      <Menu.Item onClick={() => handleStatusChange("completed")}>Completed</Menu.Item>
    </Menu>
  );

  return (
    <>
      <div style={{ padding: "20px", maxWidth: "900px", margin: "auto" }}>
        <Card
          bordered
          style={{
            backgroundColor: "#f9f9f9",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          }}
        >
          <Row justify="space-between" align="middle">
            <Title level={2}>Title: {project.title}</Title>
            <Dropdown overlay={statusMenu} trigger={["click"]}>
              <Button style={{ marginLeft: "16px" }}>
                {project.status} <DownOutlined />
              </Button>
            </Dropdown>
          </Row>

          <Divider />

          <Text strong>Description:</Text>
          <p>{project.description}</p>

          <Row gutter={16}>
            <Col span={12}>
              <Text strong>Start Date:</Text>
              <p>{new Date(project.startDate).toLocaleDateString()}</p>
            </Col>
            <Col span={12}>
              <Text strong>End Date:</Text>
              <p>{new Date(project.endDate).toLocaleDateString()}</p>
            </Col>
          </Row>

          <Divider />

          <Text strong>Methodology:</Text>
          <Select
            placeholder="Select methodology"
            style={{ width: "300px", marginBottom: "16px" }}
            onChange={handleMethodologyChange}
            value={selectedMethodology}
          >
            {methodologies.map((method) => (
              <Option key={method} value={method}>
                {method}
              </Option>
            ))}
          </Select>

          <Divider />

          <Text strong>Members:</Text>
          <List
            bordered
            itemLayout="horizontal"
            dataSource={project.members}
            renderItem={(member) => (
              <List.Item>
                <List.Item.Meta
                  avatar={
                    <Avatar src={member.profilePicture?.url} alt={member.name} />
                  }
                  title={<Text strong>{member.name}</Text>}
                  description={
                    <Text type="secondary">
                      Skills: {member.skills?.join(", ") || "N/A"}
                    </Text>
                  }
                />
              </List.Item>
            )}
          />

          <Divider />

          <Row gutter={16} align="middle">
            <Col>
              <Select
                placeholder="Select a member to add"
                style={{ width: "300px" }}
                onChange={(value) => setSelectedMemberId(value)}
                value={selectedMemberId}
              >
                {members.map((member) => (
                  <Option key={member._id} value={member._id}>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <Text>{member.name}</Text>
                      <Text type="secondary" style={{ fontSize: "12px" }}>
                        Skills: {member.skills.join(", ")}
                      </Text>
                    </div>
                  </Option>
                ))}
              </Select>
            </Col>
            <Col>
              <Button
                type="primary"
                style={{
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                }}
                onClick={handleAddMember}
              >
                Add Member
              </Button>
            </Col>
          </Row>
        </Card>
      </div>
      <ProjectManagement project={project} />
    </>
  );
};

export default ViewProjectDetails;
