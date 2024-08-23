import React from "react";
import { Link, useNavigate } from "react-router-dom";
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
  FaSignOutAlt,
} from "react-icons/fa";
import { MdAssignment, MdPerson } from "react-icons/md";
import { IoMdPaper } from "react-icons/io";
import { AiOutlineMail } from "react-icons/ai"; // Import the Mail icon for Messages Inbox
import axios from "axios";
import { toast } from "react-toastify";

const Sidebar = () => {
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();
  const role = auth.user?.role || ""; //.toLowerCase()

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
      setIsDropdownOpen(false);
    } catch (error) {
      console.log("error on logout", error.message);
    }
  };

  const renderLinks = () => {
    switch (role) {
      case "admin":
        return (
          <>
            <div>
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
            </div>
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
      {/* Logout Button */}
      <div className="p-4 border-t border-gray-700">
        <Link className="sidebar-link">
          <FaSignOutAlt className="text-lg mr-4" />
          <button onClick={handleLogout}>Logout</button>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
