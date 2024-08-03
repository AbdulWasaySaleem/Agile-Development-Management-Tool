import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create Context
const UserContext = createContext();

// Create Provider Component
const UserProvider = ({ children }) => {
  const [auth, setAuth] = useState({ user: null, token: "", role: "" });

  // Set default axios headers
   useEffect(() => {
     axios.defaults.headers.common['Authorization'] = auth.token;
   }, [auth.token]);

  // Load auth data from localStorage
   useEffect(() => {
     const data = localStorage.getItem("auth");
     if (data) {
       const parseData = JSON.parse(data);
       setAuth({
         user: parseData.user,
         token: parseData.token,
       });
     }
   }, []);

  return (
    <UserContext.Provider value={[auth, setAuth ]}>
      {children}
    </UserContext.Provider>
  );
};

// Create custom hook
const useAuth = () => useContext(UserContext);

export { UserProvider, useAuth };
