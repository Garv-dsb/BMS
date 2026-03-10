import React from "react";
import Card from "../Components/Card";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { MoveUpRight } from "lucide-react";

interface DashboardProps {
  role: string | null;
}

const Dashboard = () => {
  // get the userData
  const storedData = localStorage.getItem("UserData");
  const userData = JSON.parse(storedData || "null");

  // get thetotal users and total Data from the API

  // Fetch Users data using React Query
  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      return fetch(
        "https://book-management-delta-five.vercel.app/auth/admin/list-users?filterField=role&filterValue=user",
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        },
      )
        .then((res) => res.json())
        .then((data) => {
          return data.users;
        })
        .catch((err) => {
          console.error("Error fetching users:", err);
          return [];
        });
    },
  });

  // get the total banned users count
  const bannedUsersCount = users.filter((user: any) => user.banned).length;

  return (
    <div className="">
      <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
      <p className="text-gray-400">Welcome to the Dashboard</p>

      <div className="flex flex-wrap gap-5 mt-3">
        {/*  Disaplay the Current States  */}
        {userData.role === "admin" ? (
          <div className=" p-4 w-full flex flex-wrap gap-4">
            {/* // Total Users currently in the system  */}

            <Card className="border border-white/10 p-6 w-full md:w-1/2 lg:w-1/4">
              <h2 className="text-xl font-semibold text-white mb-4">
                Total Users
              </h2>
              <div className="flex items-center">
                <p className="text-3xl font-bold text-[#AAC4F5]">
                  {users?.length}
                </p>

                {/* Go to Users Management */}
                <Link to="/users" className="ml-auto">
                  <Card className="bg-[#AAC4F5]/20 rounded-md">
                    <MoveUpRight size={16} />
                  </Card>
                </Link>
              </div>
            </Card>
            {/* // Total Banned Users currently in the system */}

            <Card className="border border-white/10 p-6 w-full md:w-1/2 lg:w-1/4">
              <h2 className="text-xl font-semibold text-white mb-4">
                Total Banned Users
              </h2>
              <div className="flex items-center">
                <p className="text-3xl font-bold text-[#AAC4F5]">
                  {bannedUsersCount}
                </p>

                {/* Go to Users Management */}
                <Link to="/users" className="ml-auto">
                  <Card className="bg-[#AAC4F5]/20 rounded-md">
                    <MoveUpRight size={16} />
                  </Card>
                </Link>
              </div>
            </Card>
          </div>
        ) : (
          <h1>Implementing Soon...</h1>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
