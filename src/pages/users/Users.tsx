import React, { use, useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Card from "../../Components/Card";
import Pagination from "../../Components/Pagination";
import { Edit2, Ellipsis, Eye, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  banned: boolean;
  image?: string;
}

const Users = () => {
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const queryClient = useQueryClient();
  // track which user is currently in-flight for ban/unban
  const [mutatingUserId, setMutatingUserId] = useState<number | null>(null);
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [totalItems, setTotalItems] = useState(0);

  // Fetch Users data using React Query
  const {
    data: users = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["users", "list-users"],
    queryFn: async () => {
      return fetch(
        "/api/auth/admin/list-users?filterField=role&filterValue=user",
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        },
      )
        .then((res) => res.json())
        .then((data) => {
          setTotalItems(data.total); // set total items for pagination
          return data.users;
        })
        .catch((err) => {
          console.error("Error fetching users:", err);
          return []; // if there is an error , return the nothing to avoid breaking the UI
        });
    },
  });

  // Pagination logic
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = users.slice(startIndex, startIndex + itemsPerPage);

  // Reset to page 1 when users data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [users.length]);

  // use a mutation to handle both ban and unban with loading state
  const banUnbanMututation = useMutation({
    mutationFn: async ({
      userId,
      banned,
    }: {
      userId: number;
      banned: boolean;
    }) => {
      const url = banned
        ? "/api/auth/admin/unban-user"
        : "/api/auth/admin/ban-user";

      // make the API call to ban or unban the user
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ userId }),
      });

      return response.json();
    },
    // set the mutating user ID when the mutation starts
    onMutate: ({ userId }) => {
      setMutatingUserId(userId);
    },
    // on success, invalidate the users query to refetch the updated list and show a toast
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["users", "list-users"] });
      // show a toast depending on the action
      toast.success(
        variables.banned
          ? "User unbanned successfully"
          : "User banned successfully",
        {
          style: {
            background: "#333",
            color: "#fff",
          },
        },
      );
    },
    // on error, log the error and reset the mutating user ID and open menu
    onError: (error) => {
      console.error("Error toggling ban status:", error);
    },
    // on settled (either success or error), reset the mutating user ID and open menu
    onSettled: () => {
      setMutatingUserId(null);
      setOpenMenu(null);
    },
  });

  // use a mututation for the handle user Delete or remove
  const userDelete = useMutation({
    mutationFn: async (userId: number) => {
      const url = "/api/auth/admin/remove-user";
      const token = localStorage.getItem("token");

      // make the API call to delete the user
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({ userId }),
      });
      return response.json();
    },
    // success handler to invalidate the users query and show a toast
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users", "list-users"] });
      toast.success("User deleted successfully", {
        style: {
          background: "#333",
          color: "#fff",
        },
      });
    },
  });

  // Search mutation to handle searching users by email
  const searchMutuation = useMutation({
    mutationFn: async (searchTerm: string) => {
      const url = `/api/auth/admin/list-users?filterField=role&filterValue=user&searchField=email&searchValue=${searchTerm.toLowerCase()}`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      return response.json();
    },
    onSuccess: (data) => {
      setTotalItems(data.total);
      queryClient.setQueryData(["users", "list-users"], data.users);
    },
    onError: (error) => {
      console.error("Error searching users:", error);
      toast.error("An error occurred while searching users.");
    },
  });

  const handleToggleBan = (userId: number, banned: boolean) => {
    banUnbanMututation.mutate({ userId, banned });
  };

  const handleDeleteUser = (userId: number) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      userDelete.mutate(userId);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    searchMutuation.mutate(searchTerm);
  };

  return (
    <div className="overflow-x-hidden">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Users Management
            </h1>
            <p className="text-gray-400">Manage the Users</p>
          </div>

          {/* Create Button  */}
          <Link to="/user/add">
            <button className="flex gap-2 px-4 py-2 bg-white text-black rounded-md hover:cursor-pointer transition-colors">
              Create <Plus size={24} />
            </button>
          </Link>
        </div>

        {/*  Search and Filter  */}
        <div className="flex flex-col w-full md:w-1/2 lg:w-1/3 gap-2">
          <input
            type="text"
            placeholder="Search by email"
            className="w-full sm:w-auto px-4 py-2 bg-black border border-white/10 rounded-md text-sm text-gray-300 focus:outline-none transition-colors"
            onChange={handleSearch}
          />
        </div>

        {/* Books Table */}
        <Card className="border border-white/10">
          {isLoading ? (
            <div className="p-8 text-center">
              <p className="text-gray-400">Loading...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-400">No Users Found...</p>
            </div>
          ) : (
            <div className="overflow-x-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left p-3 sm:p-4 text-gray-300 font-semibold text-sm">
                      Image
                    </th>
                    <th className="text-left p-3 sm:p-4 text-gray-300 font-semibold text-sm">
                      Name
                    </th>
                    <th className="text-left p-3 sm:p-4 text-gray-300 font-semibold text-sm hidden sm:table-cell">
                      Email
                    </th>
                    <th className="text-left p-3 sm:p-4 text-gray-300 font-semibold text-sm hidden md:table-cell">
                      Role
                    </th>
                    <th className="text-left p-3 sm:p-4 text-gray-300 font-semibold text-sm hidden lg:table-cell">
                      Issued Books
                    </th>
                    <th className="text-left p-3 sm:p-4 text-gray-300 font-semibold text-sm hidden xl:table-cell">
                      Banned Status
                    </th>
                    <th className="text-center p-3 sm:p-4 text-gray-300 font-semibold text-sm">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedUsers.map((user: User, index: any) => (
                    <tr
                      key={index}
                      className="border-b border-white/6 hover:bg-white/5 transition-colors"
                    >
                      <td className="p-3 sm:p-4 text-white font-medium">
                        <img
                          src={
                            user?.image ||
                            "https://cdn-icons-png.flaticon.com/512/219/219970.png"
                          }
                          alt="avatar"
                          className="w-10 h-10 rounded-full border border-[#8c52ef]/40 object-cover"
                        />
                      </td>
                      <td className="p-3 sm:p-4 text-white font-medium">
                        {user.name}
                      </td>
                      <td className="p-3 sm:p-4 text-gray-300 hidden sm:table-cell">
                        {user.email}
                      </td>
                      <td className="p-3 sm:p-4 text-gray-300 hidden md:table-cell">
                        {user.role}
                      </td>
                      <td className="p-3 sm:p-4 text-gray-300 hidden lg:table-cell"></td>
                      <td className="p-3 sm:p-4 text-gray-300 hidden xl:table-cell">
                        <span
                          className={`${user.banned ? "bg-red-300/10 text-red-300 " : "bg-[#ABE7B2]/30 text-[#ABE7B2]"}  px-3 py-1 rounded-md text-xs font-medium`}
                        >
                          {user.banned ? "Banned" : "Active"}
                        </span>
                      </td>
                      <td className="p-3 sm:p-4 text-center">
                        <div className="flex justify-center gap-1 sm:gap-2 flex-wrap">
                          {/* View Individual  */}
                          <button
                            className="transition-colors p-2 hover:bg-white/5 rounded-md"
                            title="View"
                          >
                            <Link to={`/user/${user?.id}`}>
                              <Eye size={18} />
                            </Link>
                          </button>

                          {/* Edit Individual  */}
                          <Link to={`/user/edit/${user?.id}`}>
                            <button
                              className="transition-colors p-2 hover:bg-white/5 rounded-md hover:cursor-pointer"
                              title="Edit"
                            >
                              <Edit2 size={18} />
                            </button>
                          </Link>

                          {/* Action Individual  */}
                          <div className="relative">
                            <button
                              className="transition-colors p-2 hover:bg-white/5 rounded-md hover:cursor-pointer"
                              title="Actions"
                              onClick={() =>
                                setOpenMenu(
                                  openMenu === user.id ? null : user.id,
                                )
                              }
                            >
                              <Ellipsis size={18} />
                            </button>

                            {/* Dropdown Menu */}
                            {openMenu === user.id && (
                              <div className="absolute right-0 mt-2 w-48 bg-black border border-white/10 rounded-md shadow-lg z-10">
                                <button
                                  className={`w-full hover:cursor-pointer text-left px-4 py-2 text-sm text-gray-300 transition-colors rounded-md flex items-center gap-2 ${
                                    mutatingUserId === user.id
                                      ? "opacity-50 cursor-not-allowed"
                                      : "hover:bg-white/10 hover:text-white"
                                  }`}
                                  onClick={() =>
                                    handleToggleBan(user.id, user.banned)
                                  }
                                  disabled={mutatingUserId === user.id}
                                >
                                  {mutatingUserId === user.id
                                    ? "Processing..."
                                    : user.banned
                                      ? "Unban User"
                                      : "Ban User"}
                                </button>
                              </div>
                            )}
                          </div>

                          {/* Delete Individual  */}
                          <button
                            className="text-red-500 hover:text-red-400 transition-colors p-2 hover:bg-white/5 rounded-md hover:cursor-pointer"
                            title="Delete"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Users;
