import { Link } from "react-router-dom";
import Card from "../../Components/Card";
import { BookPlus, Edit2, Eye, Trash2 } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import Pagination from "../../Components/Pagination";

const Books = () => {
  const queryClient = useQueryClient();
  const [deleteMenu, setDeleteMenu] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [totalItems, setTotalItems] = useState(0);

  // Fetch Booka data using React Query
  const { data: books = [], isLoading } = useQuery({
    queryKey: ["books"],
    queryFn: async () => {
      return fetch("/api/books", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          setTotalItems(data?.meta?.total);
          return data || [];
        })
        .catch((err) => {
          console.error("Error fetching users:", err);
          return [];
        });
    },
  });

  // Handle Delete Mututation
  const handleDeleteMututation = useMutation({
    mutationFn: async (id: string) => {
      return fetch(`/api/books/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          return data;
        })
        .catch((err) => {
          console.error("Error deleting book:", err);
          return null;
        });
    },
    onSuccess: () => {
      toast.success("Book deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
    onError: () => {
      toast.error("An error occurred while deleting the book.");
    },
  });

  // Delete mututate
  const handleDelete = (id: string) => {
    handleDeleteMututation.mutate(id);
  };

  // Search mutation to handle searching users by email
  const searchMutuation = useMutation({
    mutationFn: async (searchTerm: string) => {
      const url = `/api/books?&searchField=title&searchValue=${searchTerm.toLowerCase()}`;
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
      setTotalItems(data?.meta?.total);
      queryClient.setQueryData(["books"], data);
    },
    onError: (error) => {
      console.error("Error searching users:", error);
      toast.error("An error occurred while searching users.");
    },
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    searchMutuation.mutate(searchTerm);
  };

  // Reset to page 1 when users data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [books.length]);

  // Pagination logic
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedbooks =
    books?.data?.slice(startIndex, startIndex + itemsPerPage) || [];

  return (
    <div className="overflow-x-hidden">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Books Management
            </h1>
            <p className="text-gray-400">Manage the Books</p>
          </div>

          {/* Create Button  */}
          <Link to="/books/add">
            <button className="flex gap-2 px-4 bg-gray-100 dark:bg-[#2D2D2D] py-2 text-gray-800 dark:text-white rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-center hover:cursor-pointer">
              Add <BookPlus size={20} />
            </button>
          </Link>
        </div>

        {/*  Search and Filter  */}
        <div className="flex flex-col w-full md:w-1/2 lg:w-1/3 gap-2">
          <input
            type="text"
            placeholder="Search by book title..."
            className="w-full sm:w-auto px-4 py-2 bg-white dark:bg-black border border-gray-300 dark:border-white/10 rounded-md text-sm text-gray-900 dark:text-gray-600 dark:text-gray-300 focus:outline-none transition-colors placeholder-gray-400 dark:placeholder-gray-500"
            onChange={handleSearch}
          />
        </div>

        {/* Books Table */}
        <Card className="border border-gray-200 dark:border-white/10">
          {isLoading ? (
            <div className="p-8 text-center">
              <p className="text-gray-400">Loading...</p>
            </div>
          ) : paginatedbooks.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-400">No books found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-black/10 dark:border-white/10">
                    <th className="text-left p-3 sm:p-4 text-gray-600 dark:text-gray-300 font-semibold text-sm">
                      Image
                    </th>
                    <th className="text-left p-3 sm:p-4 text-gray-600 dark:text-gray-300 font-semibold text-sm">
                      Title
                    </th>
                    <th className="text-left p-3 sm:p-4 text-gray-600 dark:text-gray-300 font-semibold text-sm hidden sm:table-cell">
                      Description
                    </th>
                    <th className="text-left p-3 sm:p-4 text-gray-600 dark:text-gray-300 font-semibold text-sm hidden md:table-cell">
                      Author
                    </th>
                    <th className="text-left p-3 sm:p-4 text-gray-600 dark:text-gray-300 font-semibold text-sm hidden xl:table-cell">
                      Quantity
                    </th>
                    <th className="text-left p-3 sm:p-4 text-gray-600 dark:text-gray-300 font-semibold text-sm hidden xl:table-cell">
                      Availability
                    </th>
                    <th className="text-center p-3 sm:p-4 text-gray-600 dark:text-gray-300 font-semibold text-sm hidden xl:table-cell">
                      Added Date
                    </th>
                    <th className="text-center p-3 sm:p-4 text-gray-600 dark:text-gray-300 font-semibold text-sm">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedbooks?.map((book: any, idx: number) => {
                    return (
                      <tr
                        key={idx}
                        className="border-b border-black/6 dark:border-white/6 hover:bg-white/5 transition-colors"
                      >
                        <td className="p-3 sm:p-4 text-gray-900 dark:text-white font-medium">
                          <img
                            src={book?.imageUrl || null}
                            className="w-10 h-10 rounded-full border border-[#8c52ef]/40 object-cover"
                          />
                        </td>
                        <td className="p-3 sm:p-4 text-gray-900 dark:text-white font-medium">
                          {book?.title?.slice(0, 20)}...
                        </td>
                        <td className="p-3 sm:p-4 text-gray-600 dark:text-gray-300 dark:text-gray-300 hidden sm:table-cell">
                          {book?.description?.slice(0, 10)}...
                        </td>
                        <td className="p-3 sm:p-4 text-gray-600 dark:text-gray-300 hidden md:table-cell">
                          {book?.author}
                        </td>
                        <td className="p-3 sm:p-4 text-gray-600 dark:text-gray-300 hidden xl:table-cell">
                          {book?.quantity}
                        </td>
                        <td
                          className={`p-3 sm:p-4 text-gray-600 dark:text-gray-300 hidden xl:table-cell ${book?.availability === 0 ? "text-red-500 font-bold" : ""}`}
                        >
                          {book?.availability}
                        </td>
                        <td className="p-3 sm:p-4 text-gray-600 dark:text-gray-300 hidden xl:table-cell">
                          {book?.createdAt?.slice(0, 10)}
                        </td>
                        <td className="p-3 sm:p-4 text-center">
                          <div className="flex justify-center gap-1 sm:gap-2 flex-wrap">
                            {/* View Individual  */}
                            <button
                              className="transition-colors p-2 hover:bg-white/5 rounded-md"
                              title="View"
                            >
                              <Link to={`/books/${book?.id}`}>
                                <Eye size={18} />
                              </Link>
                            </button>

                            {/* Edit Individual  */}
                            <Link to={`/books/edit/${book?.id}`}>
                              <button
                                className="transition-colors p-2 hover:bg-white/5 rounded-md hover:cursor-pointer"
                                title="Edit"
                              >
                                <Edit2 size={18} />
                              </button>
                            </Link>

                            {/* Delete Individual  */}
                            <button
                              className="text-red-500 hover:text-red-400 transition-colors p-2 hover:bg-white/5 rounded-md hover:cursor-pointer"
                              title="Delete"
                              onClick={() => setDeleteMenu(book?.id)}
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
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
        {/* Delete Confirmation Modal */}
        <div
          className={`fixed inset-0 bg-black/50 dark:bg-black/50 flex items-center justify-center z-20 backdrop-blur-xs transition-opacity  ${
            deleteMenu
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
        >
          <div className="bg-white dark:bg-[#1A1A1A] p-6 rounded-md w-60 md:w-full lg:w-full max-w-sm shadow-xl dark:shadow-md border border-gray-200 dark:border-transparent ">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Confirm Deletion
            </h2>
            <p className="text-gray-400 mb-6">
              Are you sure you want to delete this Book? This action cannot be
              undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors hover:cursor-pointer"
                onClick={() => setDeleteMenu(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-400 transition-colors hover:cursor-pointer"
                onClick={() => {
                  if (deleteMenu) {
                    handleDelete(deleteMenu.toString());
                    setDeleteMenu(null);
                  }
                }}
              >
                {handleDeleteMututation.isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Books;
