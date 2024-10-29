import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../components/Context/UserContext";
import { Layout, Menu, Avatar, Button } from "antd";
import {
  FaTachometerAlt,
  FaProjectDiagram,
  FaUsers,
  FaCog,
  FaChartBar,
  FaUserPlus,
  FaUser,
  FaHome,
  FaSignOutAlt,
} from "react-icons/fa";
import { MdAssignment } from "react-icons/md";
import { IoMdPaper } from "react-icons/io";
import { AiOutlineMail } from "react-icons/ai"; // Import the Mail icon for Messages Inbox
import axios from "axios";
import { toast } from "react-toastify";

const { Sider } = Layout;

const Sidebar = () => {
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();
  const role = auth.user?.role || "";

  const handleLogout = async () => {
    try {
      const logout = await axios.post("/api/v1/auth/logout");
      const data = logout.data;
      if (data.success === false) {
        console.log(data.message);
      }
      toast.info(data.message);

      setAuth({
        ...auth,
        user: null,
        token: "",
        role: "",
      });
      localStorage.removeItem("auth");
      navigate("/login");
    } catch (error) {
      console.log("error on logout", error.message);
    }
  };

  const renderLinks = () => {
    switch (role) {
      case "admin":
        return (
          <>
            <Menu.Item key="home" icon={<FaHome />}>
              <Link to="/">Home</Link>
            </Menu.Item>
            <Menu.Item key="projects" icon={<FaProjectDiagram />}>
              <Link to="/adminProjects">Projects</Link>
            </Menu.Item>
            <Menu.Item key="employees" icon={<FaUsers />}>
              <Link to="/employees">Employees</Link>
            </Menu.Item>
            <Menu.Item key="pending-request" icon={<IoMdPaper />}>
              <Link to="/pendingrequest">Pending Requests</Link>
            </Menu.Item>
            <Menu.Item key="messages" icon={<AiOutlineMail />}>
              <Link to="/messages">Messages Inbox</Link>
            </Menu.Item>
            <Menu.Item key="tasks" icon={<MdAssignment />}>
              <Link to="/tasks">Tasks</Link>
            </Menu.Item>
            <Menu.Item key="reports" icon={<FaChartBar />}>
              <Link to="/reports">Reports</Link>
            </Menu.Item>
            <Menu.Item key="profile" icon={<FaUser />}>
              <Link to="/profilepage">View Profile</Link>
            </Menu.Item>
            <Menu.Item key="settings" icon={<FaCog />}>
              <Link to="/settings">Settings</Link>
            </Menu.Item>
          </>
        );
      case "hr":
        return (
          <>
            <Menu.Item key="home" icon={<FaHome />}>
              <Link to="/">Home</Link>
            </Menu.Item>
            <Menu.Item key="employees" icon={<FaUsers />}>
              <Link to="/employees">Employees</Link>
            </Menu.Item>
            <Menu.Item key="projects" icon={<FaProjectDiagram />}>
              <Link to="/projects">Projects</Link>
            </Menu.Item>
            <Menu.Item key="messages" icon={<AiOutlineMail />}>
              <Link to="/messages">Messages Inbox</Link>
            </Menu.Item>
            <Menu.Item key="reports" icon={<FaChartBar />}>
              <Link to="/reports">Reports</Link>
            </Menu.Item>
            <Menu.Item key="register" icon={<FaUserPlus />}>
              <Link to="/register">Register</Link>
            </Menu.Item>
            <Menu.Item key="profile" icon={<FaUser />}>
              <Link to="/profilepage">View Profile</Link>
            </Menu.Item>
          </>
        );
      case "senior_developer":
        return (
          <>
            <Menu.Item key="home" icon={<FaHome />}>
              <Link to="/">Home</Link>
            </Menu.Item>
            <Menu.Item key="projects" icon={<FaProjectDiagram />}>
              <Link to="/projects">Projects</Link>
            </Menu.Item>
            <Menu.Item key="tasks" icon={<MdAssignment />}>
              <Link to="/tasks">Tasks</Link>
            </Menu.Item>
            <Menu.Item key="messages" icon={<AiOutlineMail />}>
              <Link to="/messages">Messages Inbox</Link>
            </Menu.Item>
            <Menu.Item key="reports" icon={<FaChartBar />}>
              <Link to="/reports">Reports</Link>
            </Menu.Item>
            <Menu.Item key="profile" icon={<FaUser />}>
              <Link to="/profilepage">View Profile</Link>
            </Menu.Item>
          </>
        );
      case "junior_developer":
        return (
          <>
            <Menu.Item key="home" icon={<FaHome />}>
              <Link to="/">Home</Link>
            </Menu.Item>
            <Menu.Item key="tasks" icon={<MdAssignment />}>
              <Link to="/tasks">Tasks</Link>
            </Menu.Item>
            <Menu.Item key="profile" icon={<FaUser />}>
              <Link to="/profilepage">View Profile</Link>
            </Menu.Item>
          </>
        );
      default:
        return <div>No Access</div>;
    }
  };

  return (
    <Sider width={250} className="site-layout-background">
      <div style={{ padding: '16px', textAlign: 'center' }}>
        <img src={"/logo.png"} alt="Logo" style={{ width: '100%' }} />
      </div>
      <Menu theme="dark" mode="inline">
        {renderLinks()}
      </Menu>
      <Button type="primary" danger style={{ margin: '16px' }} onClick={handleLogout}>
        <FaSignOutAlt /> Logout
      </Button>
    </Sider>
  );
};

export default Sidebar;
