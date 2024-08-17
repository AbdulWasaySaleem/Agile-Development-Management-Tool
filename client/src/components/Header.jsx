import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../components/Context/UserContext";
import { HiBell } from "react-icons/hi"; // Notification icon
import { FaUser, FaChevronDown } from "react-icons/fa"; // User profile and dropdown icons
import { toast } from "react-toastify";
import axios from "axios";

const Header = () => {
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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

  return (
    <header className="bg-gray-900 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-2xl font-bold"></div>

        <div className="relative flex items-center space-x-4">
          {auth.user && (
            <>
              <HiBell className="text-white text-2xl cursor-pointer" />

              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 hover:text-gray-400 transition duration-300"
                >
                  <FaUser className="text-white text-2xl" />
                  <span className="hidden md:inline">{auth.user.name}</span>
                  <FaChevronDown
                    className={`text-white text-lg transition-transform duration-300 ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-md shadow-lg">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
