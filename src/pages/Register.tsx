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
    <div className="w-full h-full p-2 ">
      <div className="flex w-full h-full mx-auto backdrop-blur-md ">
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
             <h3 className="text-2xl lg:text-3xl text-white font-[Poppins]">
              Book Management System
            </h3>
            <p className="text-gray-100 text-sm  text-center font-[poppins]">
              "I have always imagined that Paradise will be a kind of a
              Library."
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-center items-center h-full p-6 md:p-10 md:py-10 lg:p-30  w-full md:w-[50%] lg:w-[50%]  md:rounded-tr-xl md:rounded-br-xl lg:rounded-tr-xl lg:rounded-br-xl relative dark:bg-black/30">
          {/* Heading  */}
          <h2 className="text-xl lg:text-3xl font-bold text-[#BA97F5] mb-2">
            Create User Account
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4 text-xs">
            Join us by creating a new account
          </p>

          {/* Form  */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-2 w-full">
            <div className="flex flex-col ">
              <InputField
                label="Full Name"
                name="name"
                type="text"
                placeholder="John Doe"
                register={register}
                errors={errors.name}
                className="text-sm "
              />

              <InputField
                label="Email"
                name="email"
                type="email"
                placeholder="you@example.com"
                register={register}
                errors={errors.email}
                className="text-sm "
              />

              <InputField
                label="Password"
                name="password"
                type="password"
                placeholder="Enter password"
                register={register}
                errors={errors.password}
                className="text-sm "
              />

              <InputField
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                placeholder="Re-enter password"
                register={register}
                errors={errors.confirmPassword}
                className="text-sm "
              />
            </div>
            <Button
              text="Create Account"
              loading={registerMutation.isPending}
            />
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
    </div>
  );
}
