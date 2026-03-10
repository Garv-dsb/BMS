import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import InputField from "../../Components/InputField";
import Card from "../../Components/Card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { editUserAdminSchema } from "../../schema/editUserAdminSchema";
import toast from "react-hot-toast";

// types of edit profile form
interface EditProfileFormData {
  name: string;
}

const Edit = () => {
  const navigate = useNavigate();
  // fetch the individual user details by admin api
  const { id } = useParams();
  const { data: user = [], isLoading } = useQuery({
    queryKey: ["user", id],
    queryFn: async () => {
      return await fetch(`/api/auth/admin/get-user?id=${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      })
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
    },
  });

  // Handle Mutuation for edit
  const handleProfileMututate = useMutation({
    mutationFn: async (data: EditProfileFormData) => {
      const url = "/api/auth/admin/update-user";

      // make the API call to delete the user
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          userId: id,
          data: {
            name: data.name,
          },
        }),
      });
      return response.json();
    },

    onSuccess: (data) => {
      if (data) {
        toast.success("Updated Successfully !", {
          style: {
            background: "#333",
            color: "#fff",
          },
        });
        navigate("/users");
      }
    },
  });

  const onSubmit = () => {
    handleProfileMututate.mutate({
      name: watch("name"),
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
              <div className="space-y-4 w-full mx-auto mt-6 flex gap-4 ">
                <div className="w-full">
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
              </div>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Edit;
