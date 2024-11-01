import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  message,
  Spin,
  Card,
  Row,
  Col,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  LockOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import axios from "axios";
import logo from "../../assets/logo.jpg"; // Adjust the path according to your project structure

const { Option } = Select;

const Registration = () => {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post("/api/v1/auth/signup", values);
      if (response.data.success) {
        message.success("Register successfully, waiting for admin's approval.");
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      message.error("Registration failed. Please try again later.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className="bg-gray-50 dark:bg-gray-900"
        style={{
          padding: "40px",
          maxWidth: "800px",
          margin: "auto",
          background: "#f9f9f9",
          borderRadius: "8px",
          boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Card
          title={<div style={{ textAlign: "center" }}>Create an Account</div>}
          bordered={false}
          style={{ borderRadius: "8px" }}
        >
          <Form
            name="registration"
            onFinish={onFinish}
            layout="vertical"
            initialValues={{ gender: "male", skills: [] }}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="name"
                  label="Full Name"
                  rules={[
                    { required: true, message: "Please input your name!" },
                  ]}
                >
                  <Input
                    prefix={<UserOutlined />}
                    placeholder="Enter your full name"
                  />
                </Form.Item>
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    { required: true, message: "Please input your email!" },
                    { type: "email", message: "Please enter a valid email!" },
                  ]}
                >
                  <Input
                    prefix={<MailOutlined />}
                    placeholder="Enter your email"
                  />
                </Form.Item>
                <Form.Item
                  name="password"
                  label="Password"
                  rules={[
                    { required: true, message: "Please input your password!" },
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="Create a password"
                  />
                </Form.Item>
                <Form.Item
                  name="phone"
                  label="Phone"
                  rules={[
                    {
                      required: true,
                      message: "Please input your phone number!",
                    },
                  ]}
                >
                  <Input
                    prefix={<PhoneOutlined />}
                    placeholder="Enter your phone number"
                  />
                </Form.Item>
                <Form.Item name="address" label="Address">
                  <Input.TextArea
                    prefix={<EnvironmentOutlined />}
                    placeholder="Enter your address"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="gender"
                  label="Gender"
                  rules={[
                    { required: true, message: "Please select your gender!" },
                  ]}
                >
                  <Select placeholder="Select your gender">
                    <Option value="male">Male</Option>
                    <Option value="female">Female</Option>
                  </Select>
                </Form.Item>
                <Form.Item name="skills" label="Skills">
                  <Select mode="multiple" placeholder="Select your skills">
                    {[
                      "HTML",
                      "CSS",
                      "JavaScript",
                      "React",
                      "Vue",
                      "Angular",
                      "Node.js",
                      "Python",
                      "Java",
                      "MongoDB",
                    ].map((skill) => (
                      <Option key={skill} value={skill}>
                        {skill}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item name="biography" label="Biography">
                  <Input.TextArea placeholder="Tell us about yourself" />
                </Form.Item>
                <Form.Item name="socials" label="Socials (Optional)">
                  <Input
                    placeholder="Twitter URL"
                    style={{ marginBottom: "8px" }}
                  />
                  <Input
                    placeholder="LinkedIn URL"
                    style={{ marginBottom: "8px" }}
                  />
                  <Input placeholder="GitHub URL" />
                </Form.Item>
                <Form.Item
                  name="locations"
                  label="Preferred Locations (Optional)"
                >
                  <Input placeholder="Enter locations separated by commas" />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                style={{
                  width: "100%",
                  backgroundColor: "#4CAF50",
                  borderColor: "#4CAF50",
                }}
              >
                {loading ? <Spin size="small" /> : "Register"}
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </>
  );
};

export default Registration;
