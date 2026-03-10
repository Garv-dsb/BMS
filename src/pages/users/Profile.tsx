import Card from "../../Components/Card";
import Button from "../../Components/Button";
import { Link, useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();

  // stored user data in local storage
  const user = JSON.parse(localStorage.getItem("UserData") || "{}");

  const hadnleBack = () => {
    navigate("/");
  };

  // const {
  //   data: user = [],
  //   isLoading,
  //   isError,
  // } = useQuery({
  //   queryKey: ["user"],
  //   queryFn: async () => {
  //     const response = await apiBaseUrl.get("/auth/get-session");
  //     return response.data.user;
  //   },
  // });

  // if (isLoading) {
  //   return <div>Loading...</div>;
  // }

  // if (isError) {
  //   return <div>Error fetching user data.</div>;
  // }

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {user?.name}'s Profile
          </h1>
          <p className="text-gray-400">View Profile</p>
        </div>
      </div>

      {/* Profile Details */}
      <Card className="w-fit mx-auto border border-white/10">
        <div className="">
          <div className="p-6 space-y-4">
            {/* User image  */}
            <div className="flex items-center gap-4">
              <img
                src={
                  user?.image ||
                  "https://cdn-icons-png.flaticon.com/512/219/219970.png"
                }
                alt="User Avatar"
                className="w-16 h-16 rounded-full"
              />
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-300">Name</h2>
              <p className="text-gray-400">{user?.name}</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-300">Email</h2>
              <p className="text-gray-400">{user?.email}</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-300">Role</h2>
              <p className="text-gray-400">{user?.role}</p>
            </div>

            <div className="flex gap-3 w-full">
              <Link to="/profile/edit">
                <div className="w-20 md:w-32">
                  <Button text="Edit Profile" />
                </div>
              </Link>
              <div className="w-20 md:w-32">
                <Button text="Go back" onClick={hadnleBack} />
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Profile;
