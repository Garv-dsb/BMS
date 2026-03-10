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
    <div className="mx-auto my-auto h-screen my-auto p-4 md:p-3 lg:p-2 flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1533478684236-61e1192879e8?q=80&w=869&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')]  bg-cover bg-center">
      <div className="w-full md:w-[60%] lg:w-1/2 bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl shadow-md">
        {/* Heading  */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-gray-400">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

          <Button text="Sign In" loading={loginMutation.isPending} />
        </form>

        {/* <div className="mt-6 text-center">
          <p className="text-gray-400 mb-4">Or continue with</p>
          <GoogleAuth />
        </div> */}

        <div className="mt-6 text-center">
          <p className="text-gray-400">
            Don't have an account?{" "}
            <Link to="/register" className="text-[#8c52ef] hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
