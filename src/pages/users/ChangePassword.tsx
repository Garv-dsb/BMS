import { useForm } from "react-hook-form";
import Card from "../../Components/Card";
import { zodResolver } from "@hookform/resolvers/zod";
import { changePasswordSchema } from "../../schema/changePasswordSchema";
import Button from "../../Components/Button";
import InputField from "../../Components/InputField";
import toast from "react-hot-toast";
import { useState } from "react";

interface ChangePasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ChangePassword = () => {
  const [loading, setLoading] = useState(false);
  // use hook form with zod resolver
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  // Password Submit Handler
  const onSubmit = async (data: ChangePasswordFormData) => {
    setLoading(true);
    await fetch(
      `https://book-management-delta-five.vercel.app/auth/change-password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        credentials: "include",
        body: JSON.stringify({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        }),
      },
    )
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        if (data?.user) {
          toast.success("Password changed successfully!");
        } else {
          toast.error(data?.message);
        }
      })
      .catch((err) => {
        setLoading(false);
        console.error("Error changing password:", err.data);
        toast.error("An error occurred while changing password.");
      });

    reset();
  };

  return (
    <div className="w-full h-full flex items-center justify-center">
      <Card className="w-full md:w-1/2 lg:[40%] p-6 shadow-lg">
        <form className="space-y-2" onSubmit={handleSubmit(onSubmit)}>
          {/* Current Password Input  */}
          <InputField
            label="Current Password"
            name="currentPassword"
            type="password"
            placeholder="Enter your current password"
            register={register}
            errors={errors.currentPassword}
            className="text-sm py-2"
          />

          {/* password Input  */}
          <InputField
            label="New Password"
            name="newPassword"
            type="password"
            placeholder="Enter your New Password"
            register={register}
            errors={errors.newPassword}
            className="text-sm py-2"
          />

          {/* password Input  */}
          <InputField
            label="Confirm New Password"
            name="confirmPassword"
            type="password"
            placeholder="Enter your Confirm New Password"
            register={register}
            errors={errors.confirmPassword}
            className="text-sm py-2"
          />
          <Button text={"Change Password"} loading={loading} />
        </form>
      </Card>
    </div>
  );
};

export default ChangePassword;
