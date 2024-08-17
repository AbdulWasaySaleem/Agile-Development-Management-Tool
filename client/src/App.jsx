import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HomePage from "./pages/HomePage";
import Registration from "./pages/auth/Registration";
import Login from "./pages/auth/Login";
import Layout from "./components/Layout";
import Pendingusers from "./components/Admin/Pendingusers";
import AdminProjects from "./components/Admin/AdminProjects";
import ProfilePage from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";


import Messages from "./components/Messages/Messages";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          {/* Routes without Layout */}
          <Route path="/login" element={<Login />} />

          {/* Routes with Layout */}

          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/pendingrequest" element={<Pendingusers />} />
            <Route path="/adminProjects" element={<AdminProjects />} />
            <Route path="/register" element={<Registration />} />
            <Route path="/profilepage" element={<ProfilePage />} />
            <Route path="/messages" element={<Messages/>}/>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </div>
  );
}

export default App;
