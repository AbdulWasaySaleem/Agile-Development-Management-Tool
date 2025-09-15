import axios from "axios";
import { useAuthStore } from "../store/authStore";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

//interceptor to add token to headers
axiosInstance.interceptors.request.use((config) => {
  // get the latest token from zustand store
  const token = useAuthStore.getState().token;
  console.log("Token from store:", token);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default axiosInstance;