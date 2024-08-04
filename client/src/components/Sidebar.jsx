import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../components/Context/UserContext";
import {
  FaTachometerAlt,
  FaProjectDiagram,
  FaUsers,
  FaCog,
  FaChartBar,
  FaUserPlus,
  FaUser,
  FaHome,
} from "react-icons/fa";
import { MdAssignment, MdPerson } from "react-icons/md";
import { IoMdPaper } from "react-icons/io";
import { AiOutlineMail } from "react-icons/ai"; // Import the Mail icon for Messages Inbox

const Sidebar = () => {
  const [auth] = useAuth();
  const role = (auth.user?.role || "").toLowerCase();

  const renderLinks = () => {
    switch (role) {
      case "admin":
        return (
          <>
            <Link to="/" className="sidebar-link">
              <FaHome className="text-lg mr-4" />
              <span>Home</span>
            </Link>
            <Link to="/dashboard" className="sidebar-link">
              <FaTachometerAlt className="text-lg mr-4" />
              <span>Dashboard</span>
            </Link>
            <Link to="/adminProjects" className="sidebar-link">
              <FaProjectDiagram className="text-lg mr-4" />
              <span>Projects</span>
            </Link>
            <Link to="/employees" className="sidebar-link">
              <FaUsers className="text-lg mr-4" />
              <span>Employees</span>
            </Link>
            <Link to="/pendingrequest" className="sidebar-link">
              <IoMdPaper className="text-lg mr-4" />
              <span>Pending Requests</span>
            </Link>
            <Link to="/messages" className="sidebar-link">
              <AiOutlineMail className="text-lg mr-4" />
              <span>Messages Inbox</span>
            </Link>
            <Link to="/reports" className="sidebar-link">
              <FaChartBar className="text-lg mr-4" />
              <span>Reports</span>
            </Link>
            <div className="sidebar">
              <Link to="/profilepage" className="sidebar-link">
                <FaUser className="text-lg mr-4" />
                <span>View Profile</span>
              </Link>
            </div>
            <Link to="/settings" className="sidebar-link">
              <FaCog className="text-lg mr-4" />
              <span>Settings</span>
            </Link>
          </>
        );
      case "hr":
        return (
          <>
            <Link to="/" className="sidebar-link">
              <FaHome className="text-lg mr-4" />
              <span>Home</span>
            </Link>
            <Link to="/employees" className="sidebar-link">
              <FaUsers className="text-lg mr-4" />
              <span>Employees</span>
            </Link>
            <Link to="/projects" className="sidebar-link">
              <FaProjectDiagram className="text-lg mr-4" />
              <span>Projects</span>
            </Link>
            <Link to="/messages" className="sidebar-link">
              <AiOutlineMail className="text-lg mr-4" />
              <span>Messages Inbox</span>
            </Link>
            <Link to="/reports" className="sidebar-link">
              <FaChartBar className="text-lg mr-4" />
              <span>Reports</span>
            </Link>
            <Link to="/register" className="sidebar-link">
              <FaUserPlus className="text-lg mr-4" />
              <span>Register</span>
            </Link>
            <div className="sidebar">
              <Link to="/profilepage" className="sidebar-link">
                <FaUser className="text-lg mr-4" />
                <span>View Profile</span>
              </Link>
            </div>
          </>
        );
      case "senior_developer":
        return (
          <>
            <Link to="/" className="sidebar-link">
              <FaHome className="text-lg mr-4" />
              <span>Home</span>
            </Link>
            <Link to="/projects" className="sidebar-link">
              <FaProjectDiagram className="text-lg mr-4" />
              <span>Projects</span>
            </Link>
            <Link to="/tasks" className="sidebar-link">
              <MdAssignment className="text-lg mr-4" />
              <span>Tasks</span>
            </Link>
            <Link to="/reports" className="sidebar-link">
              <FaChartBar className="text-lg mr-4" />
              <span>Reports</span>
            </Link>
            <div className="sidebar">
              <Link to="/profilepage" className="sidebar-link">
                <FaUser className="text-lg mr-4" />
                <span>View Profile</span>
              </Link>
            </div>
          </>
        );
      case "junior_developer":
        return (
          <>
            <Link to="/" className="sidebar-link">
              <FaHome className="text-lg mr-4" />
              <span>Home</span>
            </Link>
            <Link to="/tasks" className="sidebar-link">
              <MdAssignment className="text-lg mr-4" />
              <span>Tasks</span>
            </Link>
            <div className="sidebar">
              <Link to="/profilepage" className="sidebar-link">
                <FaUser className="text-lg mr-4" />
                <span>View Profile</span>
              </Link>
            </div>
          </>
        );
      default:
        return <div className="text-center text-gray-400 mt-4">No Access</div>;
    }
  };

  return (
    <div className="w-64 h-full bg-gray-900 text-white fixed top-0 left-0 flex flex-col shadow-md">
      <div className="flex items-center justify-center p-4 border-b border-gray-700">
        <img src={"/logo.png"} alt="Logo" className="w-24" />
      </div>
      <nav className="flex-1 p-4 space-y-2 overflow-auto">{renderLinks()}</nav>
    </div>
  );
};

export default Sidebar;
