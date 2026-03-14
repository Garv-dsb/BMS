import { Link, useNavigate } from "react-router-dom";
import InputField from "../Components/InputField";
import Button from "../Components/Button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../schema/loginSchema";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

// Form Types
interface LoginFormData {
  email: string;
  password: string;
}

export default function Login() {
  const navigate = useNavigate();

  // use hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      const response = await fetch("/api/auth/sign-in/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const result = await response.json();
      return result;
    },
    onSuccess: (data) => {
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("UserData", JSON.stringify(data.user));
        toast.success("Login successful!", {
          style: {
            background: "#333",
            color: "#fff",
          },
        });
        navigate("/");
      }
      if (data.message) {
        toast.error(data?.message, {
          style: {
            background: "#333",
            color: "#fff",
          },
        });
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Login failed", {
        style: {
          background: "#333",
          color: "#fff",
        },
      });
    },
  });

  // Submit Handler
  const onSubmit = async (formData: LoginFormData) => {
    await loginMutation.mutateAsync(formData);
  };

  return (
    <div className="w-full h-full p-2">
      <div className="flex w-full h-full mx-auto dark:bg-white/5 backdrop-blur-md  overflow-hidden">
        {/* Image  */}
        <div className="hidden md:flex lg:flex md:w-[50%] lg:w-[50%] relative rounded-tl-xl rounded-bl-xl">
          {/* Image  */}
          <img
            src="https://images.unsplash.com/photo-1748289973871-9e699da2494c?q=80&w=435&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Book Image"
            className="bg-cover bg-center h-full w-full z-[-1] opacity-95 rounded-tl-xl rounded-bl-xl inset-0 absolute"
          />

          {/* Black overlay */}
          <div className="absolute inset-0 bg-black rounded-tl-xl rounded-bl-xl opacity-30"></div>

          {/* Management system  */}
          <div className="w-full h-full flex flex-col absolute z-1 p-25 flex justify-center items-center">
            <h3 className="text-4xl text-white font-[Tangerine]">
              Book Management System
            </h3>
            <p className="text-gray-100 text-sm  text-center font-[poppins]">
              "I have always imagined that Paradise will be a kind of a
              Library."
            </p>
          </div>
        </div>

        {/* Login Part  */}
        <div className="flex justify-center items-center h-full p-6 lg:p-30 bg-white/90 w-full md:w-[50%] lg:w-[50%]  md:rounded-tr-xl md:rounded-br-xl lg:rounded-tr-xl lg:rounded-br-xl relative dark:bg-black/30">
          {/* Heading  */}
          <div className="w-full ">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold text-[#BA97F5] mb-2">
                Welcome
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Sign in to your account
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-2 z-5">
              <div>
                <InputField
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  register={register}
                  errors={errors.email}
                  className="text-sm py-2"
                />

                <InputField
                  label="Password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  register={register}
                  errors={errors.password}
                  className="text-sm py-2"
                />
              </div>

              <Button text="Sign In" loading={loginMutation.isPending} />
            </form>

            <div className="mt-2 text-center text-sm">
              <p className="text-gray-700 dark:text-gray-400">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-[#8c52ef] hover:underline font-medium"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
