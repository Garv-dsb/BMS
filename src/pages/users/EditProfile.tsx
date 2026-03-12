import Card from "../../Components/Card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { editUserProfileSchema } from "../../schema/editUserProfileSchema";
import InputField from "../../Components/InputField";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

// types of edit profile form

interface EditProfileFormData {
  name: string;
  image?: string;
}

const EditProfile = () => {
  const queryClient = useQueryClient();

  const navigate = useNavigate();

  // Fetch Users data using React Query
  const { data: user = [], isLoading } = useQuery({
    queryKey: ["user", "list-users"],
    queryFn: async () => {
      return await fetch("/api/auth/get-session", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          return data.user;
        })
        .catch((err) => {
          console.error("Error fetching users:", err);
          return [];
        });
    },
  });

  console.log("user from edit", user);

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
      const url = "/api/auth/update-user";
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
          image: data.image || null,
        }),
      });
      return response.json();
    },

    onSuccess: (data) => {
      if (data.status === true) {
        queryClient.invalidateQueries({ queryKey: ["user"] });
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
      name: watch("name") || user?.name || "",
      image: watch("image") || user?.image || "",
    });
  };

  return (
    <div className="overflow-x-hidden">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Profile Management
            </h1>
            <p className="text-gray-400">Edit Your profile</p>
          </div>
        </div>

        {/* Form */}
        <Card className="w-[50%] mx-auto border border-gray-200 dark:border-white/10">
          <div className="p-6 space-y-4">
            {/* form inputs  */}
            {isLoading ? (
              <div className="flex items-center justify-center h-48">
                <p className="text-gray-400">Loading user data...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="">
                <div className="space-y-4">
                  <InputField
                    label="Image"
                    type="text"
                    placeholder="Enter Image Url"
                    register={register}
                    name="image"
                    errors={errors.image}
                    className="text-sm py-2"
                    defaultValue={user?.image}
                  />
                </div>

                <div className="space-y-4">
                  <InputField
                    label="Name"
                    type="text"
                    placeholder="Enter Your name"
                    register={register}
                    name="name"
                    errors={errors.name}
                    className="text-sm py-2"
                    defaultValue={user?.name}
                  />
                </div>

                <div className="gap-3 w-full">
                  <div className="">
                    <button
                      type="submit"
                      className={`flex items-center justify-center text-center bg-[#8c52ef]/30 transition-all duration-200 text-white px-4 py-[5px] rounded-md shadow-md hover:shadow-[#9c52ef]/20 w-[100%]  ${handleProfileMututate.isPending ? "cursor-not-allowed bg-[#8c52ef]/10 opacity-50" : "hover:cursor-pointer"}`}
                    >
                      {handleProfileMututate.isPending ? "Saving..." : "Save"}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default EditProfile;
