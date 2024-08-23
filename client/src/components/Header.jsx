import React from "react";
import { HiBell } from "react-icons/hi"; // Notification icon
import { FaUser } from "react-icons/fa"; // User profile icon
import { useAuth } from "./Context/UserContext";

const Header = () => {
  const [auth] = useAuth();

  // Check if auth and auth.user exist
  const user = auth?.user;

  return (
    <header className="bg-gray-100 p-2 shadow-md border-b border-gray-300">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-2xl font-bold">
          {/* Logo or Title can go here */}
          My Application
        </div>

        <div className="relative flex items-center space-x-4">
          <HiBell className="text-gray-700 text-xl cursor-pointer" />

          <div className="flex items-center space-x-3 p-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition duration-300">
            {user?.pic ? (
              <img
                src={user.pic}
                alt="User"
                className="w-6 h-6 rounded-full"
              />
            ) : (
              <FaUser className="text-2xl" />
            )}
            <div className="flex flex-col">
              <span className="text-sm font-semibold">{user?.name || 'User'}</span>
              <span className="text-xs text-gray-300">{user?.role || 'Role'}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
