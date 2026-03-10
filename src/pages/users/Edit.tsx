import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import InputField from "../../Components/InputField";
import Card from "../../Components/Card";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { editUserAdminSchema } from "../../schema/editUserAdminSchema";
import toast from "react-hot-toast";

// types of edit profile form
interface EditProfileFormData {
  name: string;
  email: string;
  image?: string;
}

const Edit = () => {
  const navigate = useNavigate();
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

  // fetch the individual user details by admin api
  const { id } = useParams();
  const { data: user = [], isLoading } = useQuery({
    queryKey: ["user", id],
    queryFn: async () => {
      return await fetch(
        `https://book-management-delta-five.vercel.app/auth/admin/get-user?id=${id}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        },
      )
        .then((res) => res.json())
        .then((data) => {
          console.log("Fetched user data:", data);
          return data;
        })
        .catch((err) => {
          console.error("Error fetching users:", err);
          return [];
        });
    },
  });

  // handle back button
  const hadnleBack = () => {
    navigate("/users");
  };

  // use Hook form for form handling
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<EditProfileFormData>({
    resolver: zodResolver(editUserAdminSchema),
    defaultValues: {
      name: user?.name,
      email: user?.email,
      image: user?.image,
    },
  });

  // Handle Mutuation for edit
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
          userId: id,
          data: {
            name: data.name,
            email: data.email,
            image: imageUrl || null,
          },
        }),
      });
      return response.json();
    },

    onSuccess: (data) => {
      if (data?.message) {
        toast.error(data.message, {
          style: {
            background: "#333",
            color: "#fff",
          },
        });
      }
    },
  });

  const onSubmit = () => {
    handleProfileMututate.mutate({
      name: watch("name"),
      email: watch("email"),
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
              Edit User Details
            </h1>
            <p className="text-gray-400">Edit the user information</p>
          </div>
        </div>
        {/* Form goes here  */}

        <Card className="w-[60%] mx-auto  border border-white/10">
          {isLoading ? (
            <div className="flex items-center justify-center h-48">
              <p className="text-gray-400">Loading user data...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex justify-center items-center flex-col gap-4">
                <img
                  src={user?.image || imageUrl}
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

              <div className="space-y-4 w-full mx-auto mt-6 flex gap-4 ">
                <div className="w-1/2">
                  <InputField
                    label="Name"
                    name="name"
                    type="text"
                    placeholder="Enter user name"
                    register={register}
                    errors={errors.name}
                    defaultValue={user?.name}
                  />
                </div>

                <div className="w-1/2">
                  <InputField
                    label="Email"
                    name="email"
                    type="email"
                    placeholder="Enter user email"
                    register={register}
                    errors={errors.email}
                    defaultValue={user?.email}
                  />
                </div>
              </div>

              <div className="flex gap-2 w-full text-sm  mt-4 mx-auto">
                <button
                  type="submit"
                  className={`transition-colors p-2 bg-[#8c52ef]/30 text-white rounded-md hover:bg-[#8c52ef]/50 w-full hover:cursor-pointer ${
                    handleProfileMututate?.isPending
                      ? "cursor-not-allowed opacity-40"
                      : ""
                  }`}
                  disabled={handleProfileMututate?.isPending}
                  title="Save"
                >
                  {handleProfileMututate?.isPending
                    ? "Saving..."
                    : "Save Changes"}
                </button>

                <div
                  onClick={hadnleBack}
                  className="transition-colors flex justify-center items-center font-semibold bg-[#8c52ef]/30 text-white rounded-md hover:bg-[#8c52ef]/50 w-full hover:cursor-pointer "
                >
                  Go Back
                </div>
              </div>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Edit;
