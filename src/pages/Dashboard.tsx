import Card from "../Components/Card";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { MoveUpRight } from "lucide-react";

const Dashboard = () => {
  // get the userData
  const storedData = localStorage.getItem("UserData");
  const userData = JSON.parse(storedData || "null");

  // Fetch Booka data using React Query
  const { data: books = [] } = useQuery({
    queryKey: ["books"],
    queryFn: async () => {
      return fetch("/api/books", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          return data;
        })
        .catch((err) => {
          console.error("Error fetching users:", err);
          return []; // if there is an error , return the nothing to avoid breaking the UI
        });
    },
  });

  // Fetch Users data using React Query
  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      return fetch(
        "/api/books/users-with-counts?filterField=role&filterValue=user",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        },
      )
        .then((res) => res.json())
        .then((data) => {
          return data.data;
        })
        .catch((err) => {
          console.error("Error fetching users:", err);
          return [];
        });
    },
  });

  // Fetch Booka data using React Query
  const { data: assignedBooks = [] } = useQuery({
    queryKey: ["assignedBooks", "assigned"],
    queryFn: async () => {
      return fetch("/api/books/assigned", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          return data || [];
        })
        .catch((err) => {
          console.error("Error fetching users:", err);
          return []; // if there is an error , return the nothing to avoid breaking the UI
        });
    },
  });

  // get the total banned users count
  const bannedUsersCount = users.filter((user: any) => user.banned).length;

  // Fetch Booka data using React Query
  const { data: userBooks = [] } = useQuery({
    queryKey: ["userBooks", "assigned"],
    queryFn: async () => {
      return fetch("api/user/books/", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
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

  // Find the user that have total books he taked
  const totalBooksUser = userBooks?.data?.length;

  // user Total Books that are not return
  const totalActiveBooks = userBooks?.data?.filter((book: any) => {
    return book.status === "active";
  }).length;

  // user Total Books that are not return
  const totalReturnBooks = userBooks?.data?.filter((book: any) => {
    return book.status === "returned";
  }).length;

  //find the books status is returned
  const totalReturned = assignedBooks?.data?.filter(
    (book: any) => book.status === "returned",
  ).length;

  return (
    <div className="">
      <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
      <p className="text-gray-400">Welcome to the Dashboard</p>

      <div className="flex flex-wrap gap-5 mt-3">
        {/*  Disaplay the Current States  */}
        {isLoading ? (
          <div className="p-8 text-center">
            <p className="text-gray-400">Loading...</p>
          </div>
        ) : userData.role === "admin" ? (
          <div className="p-4 w-full flex flex-wrap gap-5 md:gap-7 lg:gap-5">
            {/* // Total Users currently in the system  */}
            <Card className="border border-white/10 p-6 w-full md:w-[47%] lg:w-[23%]">
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
            <Card className="border border-white/10 p-6 w-full md:w-[47%] lg:w-[23%]">
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

            {/* Get the Total Available Books in the system  */}
            <Card className="border border-white/10 p-6 w-full md:w-[47%] lg:w-[23%]">
              <h2 className="text-xl font-semibold text-white mb-4">
                Available Books
              </h2>
              <div className="flex items-center">
                <p className="text-3xl font-bold text-[#AAC4F5]">
                  {books?.data?.length}
                </p>
                {/* Go to Books Management */}
                <Link to="/books" className="ml-auto">
                  <Card className="bg-[#AAC4F5]/20 rounded-md">
                    <MoveUpRight size={16} />
                  </Card>
                </Link>
              </div>
            </Card>

            {/* Total Returned Books */}
            <Card className="border border-white/10 p-6 w-full md:w-[47%] lg:w-[23%]">
              <h2 className="text-xl font-semibold text-white mb-4">
                Returned Books
              </h2>
              <div className="flex items-center">
                <p className="text-3xl font-bold text-[#AAC4F5]">
                  {totalReturned}
                </p>
                {/* Go to Books Management */}
                <Link to="/assignbook" className="ml-auto">
                  <Card className="bg-[#AAC4F5]/20 rounded-md">
                    <MoveUpRight size={16} />
                  </Card>
                </Link>
              </div>
            </Card>
          </div>
        ) : (
          <div className="p-4 w-full flex flex-wrap gap-5 md:gap-7 lg:gap-5">
            <Card className="border border-white/10 p-6 w-full md:w-[47%] lg:w-[23%]">
              <h2 className="text-xl font-semibold text-white mb-4">
                My Total Books
              </h2>
              <div className="flex items-center">
                <p className="text-3xl font-bold text-[#AAC4F5]">
                  {totalBooksUser}
                </p>
                {/* Go to Books Management */}
                <Link to="/my-books" className="ml-auto">
                  <Card className="bg-[#AAC4F5]/20 rounded-md">
                    <MoveUpRight size={16} />
                  </Card>
                </Link>
              </div>
            </Card>

            <Card className="border border-white/10 p-6 w-full md:w-[47%] lg:w-[23%]">
              <h2 className="text-xl font-semibold text-white mb-4">
                Active Books
              </h2>
              <div className="flex items-center">
                <p className="text-3xl font-bold text-[#AAC4F5]">
                  {totalActiveBooks}
                </p>
                {/* Go to Books Management */}
                <Link to="/my-books" className="ml-auto">
                  <Card className="bg-[#AAC4F5]/20 rounded-md">
                    <MoveUpRight size={16} />
                  </Card>
                </Link>
              </div>
            </Card>

            <Card className="border border-white/10 p-6 w-full md:w-[47%] lg:w-[23%]">
              <h2 className="text-xl font-semibold text-white mb-4">
                Returned Books
              </h2>
              <div className="flex items-center">
                <p className="text-3xl font-bold text-[#AAC4F5]">
                  {totalReturnBooks}
                </p>
                {/* Go to Books Management */}
                <Link to="/my-books" className="ml-auto">
                  <Card className="bg-[#AAC4F5]/20 rounded-md">
                    <MoveUpRight size={16} />
                  </Card>
                </Link>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
