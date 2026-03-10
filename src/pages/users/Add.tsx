import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "../../Components/InputField";
import Button from "../../Components/Button";
import { addUserSchema } from "../../schema/addUserSchema";
import { useState } from "react";
import Card from "../../Components/Card";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// types for user add form
interface AddUserFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Add = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // USe hook form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddUserFormData>({
    resolver: zodResolver(addUserSchema),
  });

  // Handle form submission
  const onSubmit = async (data: AddUserFormData) => {
    setIsLoading(true);
    await fetch(`/api/auth/admin/create-user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        email: data.email,
        password: data.password,
        name: data.name,
        role: "user", // by default, new users will have "user" role.
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setIsLoading(false);
        if (data?.user) {
          toast.success("User added successfully!", {
            style: { background: "#333", color: "#fff" },
          });
        }
        navigate("/users");
      })
      .catch((err) => {
        setIsLoading(false);
        console.error("Error changing password:", err.data);
        toast.error("An error occurred while changing password.");
      });

    reset();
  };

  return (
    <div className="mx-auto my-auto h-screen my-auto p-4 md:p-3 lg:p-2 ">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Add User
          </h1>
          <p className="text-gray-400">Add a new user to the system</p>
        </div>
      </div>

      <div className="flex items-center justify-center bg-cover bg-center">
        <Card className="w-full md:w-1/2 lg:w-[50%] p-6 shadow-lg">
          {/* Form  */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
              label="Password"
              name="confirmPassword"
              type="password"
              placeholder="Enter confirm password"
              register={register}
              errors={errors.confirmPassword}
              className="text-sm py-2"
            />

            <div className="flex justify-end gap-2">
              <div className="w-full">
                <Button text="Add User" loading={isLoading} />
              </div>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Add;
