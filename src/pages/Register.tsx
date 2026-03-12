import { Link, useNavigate } from "react-router-dom";
import InputField from "../Components/InputField";
import Button from "../Components/Button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema } from "../schema/registerSchema";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

// Types for the signup Data
interface SignupFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function Register() {
  // use Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  // navigate to login page after successful signup
  const navigate = useNavigate();

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: async ({
      name,
      email,
      password,
    }: {
      name: string;
      email: string;
      password: string;
    }) => {
      // const response = await apiBaseUrl.post("/auth/sign-up/email", {
      //   name,
      //   email,
      //   password,
      // });
      // return response.data;
      const response = await fetch("/api/auth/sign-up/email", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
      return result;
    },
    onSuccess: (data) => {
      if (data.user) {
        toast.success("Signup successful! Please login to continue.", {
          style: {
            background: "#333",
            color: "#fff",
          },
        });
        navigate("/login");
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
      toast.error(error.response?.data?.message || "Signup failed", {
        style: {
          background: "#333",
          color: "#fff",
        },
      });
    },
  });

  // Submit Handler
  const onSubmit = async (data: SignupFormData) => {
    await registerMutation.mutateAsync({
      name: data.name,
      email: data.email,
      password: data.password,
    });
  };

  return (
    <div className="mx-auto my-auto h-screen p-4 md:p-3 lg:p-2 flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1533478684236-61e1192879e8?q=80&w=869&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover bg-center">
      <div className="w-full md:w-[60%] lg:w-1/2 bg-white/90 dark:bg-white/5 backdrop-blur-md border border-gray-200 dark:border-white/10 p-6 rounded-2xl shadow-xl dark:shadow-md transition-colors duration-200">
        {/* Title  */}
        <div className="text-center border-b border-gray-200 dark:border-white/10 mb-6 pb-4">
          <h2 className="font-[500] text-gray-900 dark:text-white">Book Management System</h2>
        </div>

        {/* Heading  */}
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
          Create User Account
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4 text-xs">
          Join us by creating a new account
        </p>

        {/* Form  */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4  ">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="md:w-1/2 lg:w-1/2">
              <InputField
                label="Full Name"
                name="name"
                type="text"
                placeholder="John Doe"
                register={register}
                errors={errors.name}
                className="text-sm py-2"
              />

              <InputField
                label="Email"
                name="email"
                type="email"
                placeholder="you@example.com"
                register={register}
                errors={errors.email}
                className="text-sm py-2"
              />
            </div>

            <div className="md:w-1/2 lg:w-1/2">
              <InputField
                label="Password"
                name="password"
                type="password"
                placeholder="Enter password"
                register={register}
                errors={errors.password}
                className="text-sm py-2"
              />

              <InputField
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                placeholder="Re-enter password"
                register={register}
                errors={errors.confirmPassword}
                className="text-sm py-2"
              />
            </div>
          </div>
          <Button text="Create Account" loading={registerMutation.isPending} />
        </form>

        {/* Want to Login  */}
        <div className="text-sm text-gray-700 dark:text-gray-400 mt-4 text-center">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-[#8c52ef] hover:underline font-medium"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
