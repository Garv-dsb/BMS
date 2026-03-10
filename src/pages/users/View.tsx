import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import Card from "../../Components/Card";

const View = () => {
  const { id } = useParams();

  // Find the user with the matching ID
  const { data: user = [], isLoading } = useQuery({
    queryKey: ["user", id],
    queryFn: async () => {
      return fetch(`/api/auth/admin/get-user?id=${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          return data;
        })
        .catch((err) => {
          console.error("Error fetching users:", err);
          return [];
        });
    },
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            User Information
          </h1>
          <p className="text-gray-400">Check the User Details</p>
        </div>
      </div>

      {/* Books Table */}
      <Card className="border border-white/10">
        {isLoading ? (
          <div className="p-8 text-center">
            <p className="text-gray-400">Loading...</p>
          </div>
        ) : user.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-400">No User found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto space-y-4 p-2">
            {/* Image  */}
            <div className="w-32 h-32 rounded-full overflow-hidden">
              <img
                src={
                  user?.image ||
                  "https://cdn-icons-png.flaticon.com/512/219/219970.png"
                }
              />
            </div>

            {/* Text Data  */}
            <h3 className="text-lg font-medium text-white">
              <strong>Name:</strong> {user.name} <br />
              <strong>Email:</strong> {user.email} <br />
              <strong>Role:</strong> {user.role} <br />
              <div className="space-x-2">
                Banned Status:
              <span
                className={`${user.banned ? "bg-red-300/10 text-red-300 rounded-sm" : "rounded-sm bg-[#ABE7B2]/30 text-[#ABE7B2]"}`}
              >
                 {user.banned ? "Banned" : "Active"}{" "}
              </span>
              </div>
            </h3>
          </div>
        )}
      </Card>
    </div>
  );
};

export default View;
