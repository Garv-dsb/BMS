import Card from "../../Components/Card";
import Button from "../../Components/Button";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

const Profile = () => {

  // stored user data in local storage
  // const user = JSON.parse(localStorage.getItem("UserData") || "{}");

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

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {user?.name}'s Profile
          </h1>
          <p className="text-gray-400">View Profile</p>
        </div>
      </div>

      {/* Profile Details */}
      <Card className="w-[50%] mx-auto border border-gray-200 dark:border-white/10">
        <div className="">
          {isLoading ? (
            <div className="flex items-center justify-center h-48">
              <p className="text-gray-400">Loading user data...</p>
            </div>
          ) : (
            <div className="p-6 space-y-4">
              {/* User image  */}
              <div className="flex justify-center items-center gap-4">
                <img
                  src={
                    user?.image ||
                    "https://cdn-icons-png.flaticon.com/512/219/219970.png"
                  }
                  alt="User Avatar"
                  className="w-16 h-16 rounded-full object-cover"
                />
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-300">Name</h2>
                <p className="text-gray-600 dark:text-gray-400">{user?.name}</p>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-300">Email</h2>
                <p className="text-gray-600 dark:text-gray-400">{user?.email}</p>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-300">Role</h2>
                <p className="text-gray-600 dark:text-gray-400">{user?.role}</p>
              </div>

              <div className="text-center gap-3 w-full">
                <Link to="/profile/edit">
                  <Button text="Edit Profile" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Profile;
