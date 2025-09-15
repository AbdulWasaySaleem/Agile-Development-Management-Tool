"use client";

import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "@/app/store/authStore";
import toast from "react-hot-toast";
import { handleError } from "@/app/lib/handleError";
import { useRouter } from "next/navigation";
import { LoginPayload, LoginResponse } from "@/types/auth";
import { loginApi } from "@/api/authApi";

export const useLogin = () => {
  const { login } = useAuthStore();
  const router = useRouter();

  return useMutation<LoginResponse, Error, LoginPayload>({
    mutationFn: loginApi,
    onSuccess: (data) => {
      login(data.user, data.token);
      toast.success("Login successful 🎉");
      router.push("/home");
    },
    onError: (error) => {
      handleError(error, "Login failed");
    },
  });
};
