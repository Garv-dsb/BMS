import { useState } from "react";
import Card from "../../Components/Card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { editUserProfileSchema } from "../../schema/editUserProfileSchema";
import InputField from "../../Components/InputField";
import Button from "../../Components/Button";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

// types of edit profile form

interface EditProfileFormData {
  name: string;
  image?: string;
}

const EditProfile = () => {
  // get the userData
  const storedData = localStorage.getItem("UserData");
  const userData = JSON.parse(storedData || "null");
  const navigate = useNavigate();

  // set the image url
  const [imageUrl, setImageUrl] = useState<string>(
    "https://www.citypng.com/public/uploads/preview/download-black-male-user-profile-icon-png-701751695035033bwdeymrpov.png?v=2026020321",
  );

  // evenet handler for file input change
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      const temporaryUrl = URL.createObjectURL(file);
      setImageUrl(temporaryUrl);
    }
  };

  // handle back button
  const hadnleBack = () => {
    navigate("/profile");
  };

  // user form
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<EditProfileFormData>({
    resolver: zodResolver(editUserProfileSchema),
  });

  // mutute the user data and update the local storage
  const handleProfileMututate = useMutation({
    mutationFn: async (data: EditProfileFormData) => {
      const url =
        "https://book-management-delta-five.vercel.app/auth/update-user";
      const token = localStorage.getItem("token");

      // make the API call to delete the user
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({
          name: data.name,
          image: imageUrl === userData?.image ? null : imageUrl,
        }),
      });
      return response.json();
    },

    onSuccess: (data) => {
      if (data.status === true) {
        toast.success("Profile updated successfully", {
          style: {
            background: "#333",
            color: "#fff",
          },
        });
        navigate("/profile");
      }
    },
  });

  const onSubmit = () => {
    handleProfileMututate.mutate({
      name: watch("name") || userData?.name || "",
      image: imageUrl,
    });
  };

  return (
    <div className="overflow-x-hidden">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Profile Management
            </h1>
            <p className="text-gray-400">Edit Your profile</p>
          </div>
        </div>

        {/* Form */}
        <Card className="w-fit mx-auto border border-white/10">
          {/* Upload Image  */}
          <div className="p-6 space-y-4">
            {/* Image preview and upload  */}
            <div className="flex justify-center items-center flex-col gap-4">
              <img
                src={userData?.image || imageUrl}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-white/20"
              />

              <div className="w-50">
                <input
                  className="flex items-center  text-center bg-[#8c52ef]/30 transition-all duration-200 text-white px-4 py-2 rounded-md shadow-md hover:shadow-[#9c52ef]/20 w-[100%] hover:cursor-pointer"
                  type="file"
                  onChange={handleFileChange}
                />
              </div>
            </div>
            {/* form inputs  */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col justify-center items-center"
            >
              <div className="w-fit space-y-4">
                <InputField
                  label="Name"
                  type="text"
                  placeholder="Enter Your name"
                  register={register}
                  name="name"
                  errors={errors.name}
                  className="text-sm py-2"
                  defaultValue={userData?.name || ""}
                />
              </div>

              <div className="flex justify-center items-center gap-3 w-full">
                <div className="w-20 md:w-32">
                  <button
                    type="submit"
                    className="flex items-center justify-center text-center bg-[#8c52ef]/30 transition-all duration-200 text-white px-4 py-[5px] rounded-md shadow-md hover:shadow-[#9c52ef]/20 w-[100%] hover:cursor-pointer"
                  >
                    Save
                  </button>
                </div>
                {/* GO back Button  */}
                <div
                  onClick={hadnleBack}
                  className="w-20 md:w-32 px-4 py-[5px] transition-colors flex justify-center items-center  bg-[#8c52ef]/30 text-white rounded-md hover:bg-[#8c52ef]/50 w-full hover:cursor-pointer "
                >
                  Go Back
                </div>
              </div>
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default EditProfile;
