import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../components/Context/UserContext";
import { Layout, Menu, Avatar, Button } from "antd";
import logo from "../assets/logo.jpg";
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
      const { data } = await axios.post("/api/v1/auth/logout");
      toast.info(data.message);

      if (data.success) {
        setAuth({ user: null, token: "", role: "" });
        localStorage.removeItem("auth");
        navigate("/login");
      }
    } catch (error) {
      console.error("Error on logout", error.message);
    }
  };

  const renderLinks = () => {
    const links = {
      admin: [
        { key: "home", icon: <FaHome />, path: "/" },
        { key: "projects", icon: <FaProjectDiagram />, path: "/adminProjects" },
        { key: "employees", icon: <FaUsers />, path: "/employees" },
        { key: "pending-request", icon: <IoMdPaper />, path: "/pendingrequest" },
        { key: "messages", icon: <AiOutlineMail />, path: "/messages" },
        { key: "tasks", icon: <MdAssignment />, path: "/tasks" },
        { key: "reports", icon: <FaChartBar />, path: "/reports" },
        { key: "profile", icon: <FaUser />, path: "/profilepage" },
        { key: "settings", icon: <FaCog />, path: "/settings" },
      ],
      hr: [
        { key: "home", icon: <FaHome />, path: "/" },
        { key: "employees", icon: <FaUsers />, path: "/employees" },
        { key: "projects", icon: <FaProjectDiagram />, path: "/projects" },
        { key: "messages", icon: <AiOutlineMail />, path: "/messages" },
        { key: "reports", icon: <FaChartBar />, path: "/reports" },
        { key: "register", icon: <FaUserPlus />, path: "/register" },
        { key: "profile", icon: <FaUser />, path: "/profilepage" },
      ],
      senior_developer: [
        { key: "home", icon: <FaHome />, path: "/" },
        { key: "projects", icon: <FaProjectDiagram />, path: "/projects" },
        { key: "tasks", icon: <MdAssignment />, path: "/tasks" },
        { key: "messages", icon: <AiOutlineMail />, path: "/messages" },
        { key: "reports", icon: <FaChartBar />, path: "/reports" },
        { key: "profile", icon: <FaUser />, path: "/profilepage" },
      ],
      junior_developer: [
        { key: "home", icon: <FaHome />, path: "/" },
        { key: "tasks", icon: <MdAssignment />, path: "/tasks" },
        { key: "profile", icon: <FaUser />, path: "/profilepage" },
      ],
    };

    return links[role]?.map(({ key, icon, path }) => (
      <Menu.Item key={key} icon={icon}>
        <Link to={path}>{key.replace(/-/g, ' ').toUpperCase()}</Link>
      </Menu.Item>
    )) || <div>No Access</div>;
  };

  return (
    <Sider width={250} className="site-layout-background">
    <div style={{ padding: '16px', textAlign: 'center' }}>
      <div style={{ 
        width: '80%', 
        height: '60px', 
        overflow: 'hidden', 
        position: 'relative', 
        margin: '0 auto' 
      }}>
        <img 
          src={logo} 
          alt="Logo" 
          style={{ 
            width: '100%', 
            height: 'auto', 
            position: 'absolute', 
            top: '-70%',  // Adjust this value to crop vertically 
          }} 
        />
      </div>
      <p style={{ margin: '8px 0', fontSize: '16px', fontWeight: 'bold', color: '#fff' }}>
        Agile Development
      </p>
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
