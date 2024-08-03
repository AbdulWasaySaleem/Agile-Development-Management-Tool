import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../components/Context/UserContext";
import { HiBell } from "react-icons/hi"; // Notification icon
import { FaUser, FaChevronDown } from "react-icons/fa"; // User profile and dropdown icons
import { IoSearch, IoClose } from "react-icons/io5"; // Search and clear icons


const Header = () => {
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleLogout = () => {
    setAuth({
      ...auth,
      user: null,
      token: "",
      role: "",
    });
    localStorage.removeItem("auth");
    alert("Logout successfully");
    navigate("/login");
    setIsDropdownOpen(false);
  };

  return (
    <header className="bg-gray-800 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-2xl font-bold"></div>

        <div className="relative flex items-center space-x-4">
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 rounded-full bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
            {searchTerm ? (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <IoClose className="text-xl" />
              </button>
            ) : (
              <IoSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            )}
          </div>

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
                  <FaChevronDown className={`text-white text-lg transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
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
