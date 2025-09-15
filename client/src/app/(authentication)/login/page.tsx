"use client";

import { useLogin } from "@/hooks/useAuth";
import { useForm } from "react-hook-form";
import { Mail, Lock, Loader2, Shield } from "lucide-react";

interface FormValues {
  email: string;
  password: string;
}

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();
  const { mutate: login, isPending } = useLogin();

  const onSubmit = (data: FormValues) => {
    login(data);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-50 to-indigo-200 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white/80 backdrop-blur shadow-xl p-8 border border-gray-100">
        {/* Title */}
        <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">
          Welcome Back
        </h1>
        <p className="text-center text-gray-500 mb-8">
          Sign in with the provided demo account
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                id="email"
                type="email"
                defaultValue="demouser@gmail.com"
                readOnly
                placeholder="your@email.com"
                {...register("email", { required: "Email is required" })}
                className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              />
            </div>
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                id="password"
                type="password"
                defaultValue="demodemo"
                readOnly
                placeholder="••••••••"
                {...register("password", { required: "Password is required" })}
                className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              />
            </div>
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white shadow-md hover:bg-indigo-700 disabled:opacity-70 transition"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>

        {/* Demo disclaimer */}
        <div className="mt-8 rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-gray-700">
          <div className="flex items-start gap-2">
            <Shield className="h-4 w-4 text-yellow-500 mt-0.5" />
            <div>
              <p>
                🔒 This demo is for practice purposes only. You cannot sign up
                for a new account.
              </p>
              <p className="mt-1">
                Please use the provided{" "}
                <span className="font-medium">demo credentials</span> to log in
                and explore the application.
              </p>
              <p className="mt-2">
                If you’d like real interaction, please{" "}
                <a
                  href="https://www.linkedin.com/in/abdul-wasay-4765b82a6/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:underline font-medium"
                >
                  contact me
                </a>{" "}
                for more details.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
