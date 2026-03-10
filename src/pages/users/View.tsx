import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import Card from "../../Components/Card";
import Button from "../../Components/Button";

const View = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Find the user with the matching ID
  const { data: user = [], isLoading } = useQuery({
    queryKey: ["user", id],
    queryFn: async () => {
      return fetch(
        `https://book-management-delta-five.vercel.app/auth/admin/get-user?id=${id}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        },
      )
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

  const hadnleBack = () => {
    navigate("/users");
  };

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
              <strong>Status:</strong> {user.banned ? "Banned" : "Active"}
            </h3>

            <div className="w-fit">
              <Button text="Go Back" onClick={hadnleBack} />
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default View;
