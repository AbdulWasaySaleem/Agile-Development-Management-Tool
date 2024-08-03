import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from './pages/HomePage';
import Registration from './pages/auth/Registration';
import Login from './pages/auth/Login';
import Layout from './components/Layout';
import Pendingusers from './components/Admin/Pendingusers';
import AdminProjects from './components/Admin/AdminProjects';

function App() {

  return (
   <>
    <BrowserRouter>
    <Routes>
      {/* Routes without Layout */}
      <Route path="/login" element={<Login />} />
      
      {/* Routes with Layout */}
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/pendingrequest" element={<Pendingusers/>}/>
        <Route path="/adminProjects" element={<AdminProjects/>}/>
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
        {/* Add other routes that require the layout */}
      </Route>
      
      {/* Optional: Handle 404 */}
      {/* <Route path="*" element={<NotFound />} /> */}
    </Routes>
    </BrowserRouter>
   </>
  )
}

export default App
