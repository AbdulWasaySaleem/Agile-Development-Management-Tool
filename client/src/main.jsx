import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { UserProvider } from "./components/Context/UserContext.jsx";
import { SocketContextProvider } from "./components/Context/SocketContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <UserProvider>
    <SocketContextProvider>
      <App />
    </SocketContextProvider>
  </UserProvider>
);
