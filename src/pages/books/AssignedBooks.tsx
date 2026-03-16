import { Link } from "react-router-dom";
import Card from "../../Components/Card";
import { BookPlus, Ellipsis, X } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Pagination from "../../Components/Pagination";
import Loading from "../../Components/Loading";

const AssignedBooks = () => {
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const [mutatingUserId, setMutatingUserId] = useState<number | null>(null);
  const queryClient = useQueryClient();
  const [isReturned, setIsReturned] = useState(false);
  const [isAssigned, setIsAssigned] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  const [totalItems, setTotalItems] = useState(0);

  // Fetch Booka data using React Query
  const { data: assignedBooks = [], isLoading } = useQuery({
    queryKey: ["assignedBooks", "assigned"],
    queryFn: async () => {
      return fetch("/api/books/assigned", {
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
          return []; // if there is an error , return the nothing to avoid breaking the UI
        });
    },
  });

  // Handle unassign book
  const handleUnassign = useMutation({
    mutationFn: async ({
      bookId,
      userId,
    }: {
      bookId: number;
      userId: number;
    }) => {
      setMutatingUserId(bookId);
      try {
        await fetch(`/api/books/unassign`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            bookId: bookId,
            userId: userId,
          }),
        });
        setOpenMenu(null);
      } catch (err) {
        console.error("Error unassigning book:", err);
      } finally {
        setMutatingUserId(null);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["assignedBooks", "assigned"],
      });
    },
  });

  const searchMutuation = useMutation({
    mutationFn: async (searchTerm: string) => {
      const returnUrl = isReturned
        ? `/api/books/assigned?searchField=title&searchValue=${searchTerm}&filterField=status&filterValue=returned`
        : `/api/books/assigned?&searchField=title&searchValue=${searchTerm.toLowerCase()}`;

      const assignedUrl = isAssigned
        ? `/api/books/assigned?searchField=title&searchValue=${searchTerm}&filterField=status&filterValue=active`
        : `/api/books/assigned?&searchField=title&searchValue=${searchTerm.toLowerCase()}`;

      const response = await fetch(isReturned ? returnUrl : assignedUrl, {
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
      queryClient.setQueryData(["assignedBooks", "assigned"], data);
      console.log("Search results:", data);
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

  // If the isReturned state changes fetch the data again with the mutation function to show the data according to the status of the book
  const handleReturnedFilter = useMutation({
    mutationFn: async (isReturned: boolean) => {
      const url = `/api/books/assigned?&searchField=status&searchValue=${isReturned ? "returned" : ""}`;
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
      queryClient.setQueryData(["assignedBooks", "assigned"], data);
      console.log("Filter results:", data);
    },
    onError: (error) => {
      console.error("Error filtering users:", error);
      toast.error("An error occurred while filtering users.");
    },
  });

  // AssignedFilter
  const handleReturnFilter = useMutation({
    mutationFn: async (isAssigned: boolean) => {
      const url = `/api/books/assigned?&searchField=status&searchValue=${isAssigned ? "active" : ""}`;
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
      queryClient.setQueryData(["assignedBooks", "assigned"], data);
      console.log("Filter results:", data);
    },
    onError: (error) => {
      console.error("Error filtering users:", error);
      toast.error("An error occurred while filtering users.");
    },
  });

  const handleReturnedFilterToggle = (isReturned: boolean) => {
    isAssigned ? null : handleReturnedFilter.mutate(isReturned);
  };

  const handleAssignedFilterToggle = (isAssigned: boolean) => {
    isReturned ? null : handleReturnFilter.mutate(isAssigned);
  };

  // Reset to page 1 when users data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [assignedBooks.length]);

  // Pagination logic
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAssignedBooks =
    assignedBooks?.data?.slice(startIndex, startIndex + itemsPerPage) || [];

  return (
    <div className="overflow-x-hidden">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Assigned Books Management
            </h1>
            <p className="text-gray-400">Manage the assigned Books</p>
          </div>

          {/* Create Button  */}
          <Link to="/assignbook/add">
            <button className="flex gap-2 px-4 bg-gray-100 dark:bg-[#2D2D2D] py-2 text-gray-800 dark:text-white rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-center hover:cursor-pointer">
              Assign <BookPlus size={20} />
            </button>
          </Link>
        </div>

        {/*  Search and Filter  */}
        <div className="flex flex-col md:flex-row lg:flex-row w-full md:w-[61%] lg:w-[60%] gap-2">
          <input
            type="text"
            placeholder="Search by book title..."
            className="w-full md:w-1/2 lg:w-1/2 sm:w-auto px-4 py-2 bg-white dark:bg-black border border-gray-300 dark:border-white/10 rounded-md text-sm text-gray-900 dark:text-gray-600 dark:text-gray-300 focus:outline-none transition-colors placeholder-gray-400 dark:placeholder-gray-500"
            onChange={handleSearch}
          />
          <div className="flex gap-2 w-full md:w-1/2 lg:w-1/2">
            {/* Returned Filter */}
            <div className="flex items-center w-full md:w-fit lg:w-fit">
              {isReturned ? (
                <button
                  className={`w-full sm:w-auto px-4 py-2 bg-white dark:bg-black border border-gray-300 dark:border-white/10 rounded-md text-sm focus:outline-none transition-colors duration-300 ease-in-out ${isReturned ? "bg-green-300 dark:bg-green-300 opacity-50 text-gray-900 dark:text-black " : "hover:bg-gray-100 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white hover:cursor-pointer text-gray-600 dark:text-white "} ${isAssigned ? "opacity-50 cursor-not-allowed" : "hover:cursor-pointer"}`}
                  onClick={() => {
                    isAssigned ? null : setIsReturned(false);
                    handleReturnedFilterToggle(false);
                  }}
                >
                  Returned <X size={17} className="inline" />
                </button>
              ) : (
                <button
                  className={`w-full sm:w-auto px-4 py-2 bg-white dark:bg-black border border-gray-300 dark:border-white/10 rounded-md text-sm text-gray-600 dark:text-white dark:text-gray-300 focus:outline-none transition-colors duration-300 ease-in-out hover:bg-gray-100 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white  ${isAssigned ? "opacity-50 cursor-not-allowed" : "hover:cursor-pointer"}`}
                  onClick={() => {
                    isAssigned ? null : setIsReturned(true);
                    handleReturnedFilterToggle(true);
                  }}
                >
                  Returned
                </button>
              )}
            </div>
            {/* Assigned Filter */}
            <div className="flex items-center w-full md:w-fit lg:w-fit">
              {isAssigned ? (
                <button
                  className={`w-full sm:w-auto px-4 py-2 bg-white dark:bg-black border border-gray-300 dark:border-white/10 rounded-md text-sm focus:outline-none transition-colors duration-300 ease-in-out ${isAssigned ? "bg-green-100 dark:bg-green-300 opacity-50 text-gray-900 dark:text-black " : "hover:bg-gray-100 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white hover:cursor-pointer text-gray-600 dark:text-gray-600 dark:text-gray-300"} ${isReturned ? "opacity-50 cursor-not-allowed" : "hover:cursor-pointer"}`}
                  disabled={isReturned}
                  onClick={() => {
                    setIsAssigned(false);
                    handleAssignedFilterToggle(false);
                  }}
                >
                  Assigned <X size={17} className="inline" />
                </button>
              ) : (
                <button
                  className={`w-full sm:w-auto px-4 py-2 bg-white dark:bg-black border border-gray-300 dark:border-white/10 rounded-md text-sm text-gray-600 text-gray-600 dark:text-white  focus:outline-none transition-colors duration-300 ease-in-out hover:bg-gray-100 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white  ${isReturned ? "opacity-50 cursor-not-allowed" : "hover:cursor-pointer"}`}
                  disabled={isReturned}
                  onClick={() => {
                    setIsAssigned(true);
                    handleAssignedFilterToggle(true);
                  }}
                >
                  Assigned
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Books Table */}
        <div className="">
          {isLoading ? (
            <div className="flex justify-center items-center overflow-y-hidden">
              <Loading />
            </div>
          ) : paginatedAssignedBooks.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-400">No assigned books found.</p>
            </div>
          ) : (
            <Card className="overflow-x-auto border border-gray-200 dark:border-white/10">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-black/10  dark:border-white/10">
                    <th className="text-left p-3 sm:p-4 text-gray-600 dark:text-gray-300 font-semibold text-sm hidden md:table-cell">
                      Image
                    </th>
                    <th className="text-left p-3 sm:p-4 text-gray-600 dark:text-gray-300 font-semibold text-sm">
                      Id
                    </th>
                    <th className="text-left p-3 sm:p-4 text-gray-600 dark:text-gray-300 font-semibold text-sm">
                      Title
                    </th>
                    <th className="text-left p-3 sm:p-4 text-gray-600 dark:text-gray-300 font-semibold text-sm ">
                      Assigned To
                    </th>
                    <th className="text-left p-3 sm:p-4 text-gray-600 dark:text-gray-300 font-semibold text-sm hidden sm:table-cell">
                      Status
                    </th>
                    <th className="text-left p-3 sm:p-4 text-gray-600 dark:text-gray-300 font-semibold text-sm hidden sm:table-cell">
                      Assigned Date
                    </th>
                    <th className="text-left p-3 sm:p-4 text-gray-600 dark:text-gray-300 font-semibold text-sm hidden sm:table-cell">
                      Return Date
                    </th>
                    <th className="text-center p-3 sm:p-4 text-gray-600 dark:text-gray-300 font-semibold text-sm">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedAssignedBooks?.map((book: any, idx: number) => {
                    return (
                      <tr
                        key={idx}
                        className="border-b border-black/6 dark:border-white/6 hover:bg-white/5 transition-colors"
                      >
                        <td className="p-3 sm:p-4 text-gray-900 dark:text-white font-medium hidden md:table-cell">
                          <img
                            src={book?.book?.imageUrl || null}
                            alt="Book"
                            className="w-10 h-10 rounded-full border border-[#8c52ef]/40 object-cover"
                          />
                        </td>
                        {/* User Book id  */}
                        <td className="p-3 sm:p-4 text-gray-900 dark:text-white font-medium">
                          {book?.book?.id}
                        </td>
                        {/* Assigned Book Title  */}
                        <td className="p-3 sm:p-4 text-gray-900 dark:text-white font-medium">
                          {book?.book?.title?.slice(0, 20)}...
                        </td>
                        {/* User email  */}
                        <td className="p-3 sm:p-4 text-gray-900 dark:white dark:text-gray-300 ">
                          {book?.user?.email}
                        </td>

                        {/* Status of the book is returned or not  */}
                        <td
                          className={`p-3 sm:p-4 text-gray-600 dark:text-gray-300 hidden sm:table-cell ${book?.status === "returned" ? "text-green-400 dark:text-green-500" : "text-yellow-400 dark:text-yellow-400"}`}
                        >
                          {book?.status === "returned"
                            ? "Returned"
                            : "Assigned"}
                        </td>
                        {/* User Assigned Date  */}
                        <td className="p-3 sm:p-4 text-gray-600 dark:text-gray-300 hidden md:table-cell">
                          {book?.assignedAt?.slice(0, 10)}
                        </td>

                        {/* User Assigned Date  */}
                        <td className="p-3 sm:p-4 text-gray-600 dark:text-gray-300 hidden md:table-cell">
                          {book?.returnedAt?.slice(0, 10) || "-"}
                        </td>

                        {/* Actions  */}
                        <td className="p-3 sm:p-4 text-center">
                          <div className="flex justify-center gap-1 sm:gap-2 flex-wrap">
                            {/* Unassigned Action show if book is Assigned else not  */}
                            <div className="relative">
                              <button
                                className={`transition-colors p-2 h rounded-md  ${book?.status === "returned" ? "opacity-50 cursor-not-allowed" : "hover:bg-white/5 hover:cursor-pointer"}`}
                                title="Actions"
                                onClick={() =>
                                  setOpenMenu(
                                    openMenu === book?.id ? null : book?.id,
                                  )
                                }
                              >
                                <Ellipsis size={18} />
                              </button>

                              {book?.status !== "returned" &&
                                openMenu === book?.id && (
                                  <div className="absolute right-0 top-[-30px] w-48 bg-white dark:bg-black border border-gray-200 dark:border-white/10 rounded-md shadow-lg z-10">
                                    <button
                                      className={`w-full hover:cursor-pointer text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-600 dark:text-gray-300 transition-colors rounded-md flex items-center gap-2 ${
                                        mutatingUserId === book?.book?.id
                                          ? "opacity-50 cursor-not-allowed"
                                          : "hover:bg-gray-100 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white"
                                      }`}
                                      onClick={() =>
                                        handleUnassign.mutate({
                                          bookId: book?.book?.id,
                                          userId: book?.user?.id,
                                        })
                                      }
                                      disabled={
                                        mutatingUserId === book?.book?.id
                                      }
                                    >
                                      {mutatingUserId === book?.book?.id
                                        ? "Processing..."
                                        : "Unassign Book"}
                                    </button>
                                  </div>
                                )}

                              {/* Dropdown Menu */}
                            </div>
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
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssignedBooks;
