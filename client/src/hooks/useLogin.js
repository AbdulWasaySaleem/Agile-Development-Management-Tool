import { useState } from "react";
import axios from "axios";
import { useAuth } from "../components/Context/UserContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const useLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("/api/v1/auth/login", { email, password });
      if (response.data.success) {
        toast.success("Login successful");
        setAuth({
          user: response.data.user,
          token: response.data.token,
        });
        localStorage.setItem("auth", JSON.stringify(response.data));
        setLoading(false);
        navigate("/");
      }
    } catch (error) {
      setLoading(false);
      toast.error("Login failed. Please try again.");
      console.error("Error on login:", error.message);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    handleSubmit,
  };
};

export default useLogin;
