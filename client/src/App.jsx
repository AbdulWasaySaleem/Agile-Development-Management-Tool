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
import AddNewProject from "./components/Admin/AddNewProject";
import ViewProjectDetails from "./components/Admin/ViewProjectDetails";
import Task from "./components/Admin/Task/Task";
import Allusers from "./components/Admin/Users/Allusers";
import ProjectReport from "./components/AdminReports";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          {/* Routes without Layout */}
          <Route path="/login" element={<Login />} />
          <Route path="/registration" element={<Registration />} />

          {/* Routes with Layout */}

          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/pendingrequest" element={<Pendingusers />} />
            <Route path="/register" element={<Registration />} />
            <Route path="/profilepage" element={<ProfilePage />} />
            <Route path="/messages" element={<Messages/>}/>

            <Route path="/adminProjects" element={<AdminProjects />} />
            <Route path="/adminProjects/add-new" element={AddNewProject}/>
            <Route path="/adminprojects/viewdetail/:id" element={<ViewProjectDetails />} />

            <Route path="/employees" element={<Allusers/>}/>
            <Route path="/reports" element={<ProjectReport/>}/>


            <Route path="/tasks" element={<Task/>}/>

          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </div>
  );
}

export default App;
