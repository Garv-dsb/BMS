import { useForm } from "react-hook-form";
import Card from "../../Components/Card";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

interface assignBooKProps {
  bookName: string;
  assignedTo: string;
  name: string;
  available: string;
}

const AssignBook = () => {
  const navigate = useNavigate();
  // Use hook form
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<assignBooKProps>();

  // fetch the Books data
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
  const { data: users = [] } = useQuery({
    queryKey: ["users", "list-users"],
    queryFn: async () => {
      return fetch(
        "/api/books/users-with-counts?filterField=role&filterValue=user",
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        },
      )
        .then((res) => res.json())
        .then((data) => {
          return data.data;
        })
        .catch((err) => {
          console.error("Error fetching users:", err);
          return []; // if there is an error , return the nothing to avoid breaking the UI
        });
    },
  });

  // filter those user who are not banned
  const filteredUsers = users.filter((user: any) => user.banned !== true);

  // watch the selected book
  const selectedBook = watch("bookName");

  // find the availability of the selected book
  const isAvailable = books?.data?.find(
    (book: any) => book.title === selectedBook,
  )?.availability;

  const handlleAssignBookMututaion = useMutation({
    mutationFn: async (data: assignBooKProps) => {
      const { bookName, assignedTo } = data;

      // find the book id and user id from the selected book and user
      const bookId = books?.data?.find(
        (book: any) => book.title === bookName,
      )?.id;
      const userId = users?.find((user: any) => user.email === assignedTo)?.id;

      return fetch("/api/books/assign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ bookId, userId }),
      })
        .then((res) => res.json())
        .then((data) => {
          return data;
        })
        .catch((err) => {
          console.error("Error assigning book:", err);
          throw err;
        });
    },
    onSuccess: (data) => {
      if (data.status === "active") {
        toast.success("Book assigned successfully", {
          style: {
            background: "#333",
            color: "#fff",
          },
        });
      }
      navigate("/assignbook");
    },
  });

  // Handle Submit
  const onSubmit = (data: assignBooKProps) => {
    handlleAssignBookMututaion.mutate(data);
  };

  return (
    <div className="mx-auto my-auto h-screen my-auto p-4 md:p-3 lg:p-2 ">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Assign Book
          </h1>
          <p className="text-gray-400">Assign a new book to the User</p>
        </div>
      </div>

      <div className="flex items-center justify-center bg-cover bg-center">
        <Card className="w-full md:w-1/2 lg:w-[50%] p-6 shadow-lg">
          {/* Form  */}
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Select the Book Nmae  */}
            <div className="space-y-4">
              <span className="flex flex-col gap-2">
                <label htmlFor="bookName">Book Name</label>
                <select
                  id="bookName"
                  {...register("bookName", {
                    required: "Book Name is required",
                  })}
                  className="w-full bg-[#111] text-gray-200 border  border-gray-600 rounded-2xl px-5 py-3 outline-none transition-all duration-300 placeholder-gray-500 focus:border-[#8c52ef]/80 focus:ring-4 focus:ring-[#8c52ef]/20 overflow-hidden"
                >
                  <option value="">---Select the Book ---</option>
                  {books?.data?.map((book: any, idx: number) => {
                    return (
                      <option
                        key={idx}
                        value={book?.title}
                        className="w-full bg-[#111] text-gray-200 border  border-gray-600 rounded-2xl px-5 py-3 outline-none"
                      >
                        {book?.title?.slice(0, 30)}...
                      </option>
                    );
                  })}
                </select>

                {/* Error Message  */}
                <p
                  className={`text-red-500 font-medium text-xs mt-1 ${errors ? "visible" : "opacity-0"}`}
                >
                  {errors.bookName?.message}
                </p>
              </span>

              {selectedBook && (
                <span className="flex flex-col gap-2">
                  <label htmlFor="available">Available</label>
                  <input
                    value={
                      isAvailable > 0
                        ? `${isAvailable} available`
                        : "Not Available"
                    }
                    className={`w-full bg-[#111] text-gray-200 border  border-gray-600 rounded-2xl px-5 py-3 outline-none transition-all duration-300 placeholder-gray-500 focus:border-[#8c52ef]/80 focus:ring-4 focus:ring-[#8c52ef]/20 overflow-hidden opacity-70 cursor-not-allowed`}
                    disabled
                  />
                  {/* Error Message  */}
                  <p
                    className={`text-red-500 font-medium text-xs mt-1 ${errors ? "visible" : "opacity-0"}`}
                  >
                    {errors.available?.message}
                  </p>
                </span>
              )}

              {/* If the book is selected then show the user select option  */}
              {selectedBook && (
                <span className="flex flex-col gap-2">
                  <label htmlFor="assignedTo">Assigned To</label>
                  <select
                    id="assignedTo"
                    {...register("assignedTo", {
                      required: "Please select a user to assign the book",
                    })}
                    className="w-full bg-[#111] text-gray-200 border  border-gray-600 rounded-2xl px-5 py-3 outline-none transition-all duration-300 placeholder-gray-500 focus:border-[#8c52ef]/80 focus:ring-4 focus:ring-[#8c52ef]/20 overflow-hidden"
                  >
                    <option value="">---Select the user ---</option>
                    {filteredUsers.map((user: any, idx: number) => {
                      return (
                        <option
                          key={idx}
                          value={user?.email}
                          className="w-full bg-[#111] text-gray-200 border  border-gray-600 rounded-2xl px-5 py-3 outline-none"
                        >
                          {user?.email}
                        </option>
                      );
                    })}
                  </select>

                  {/* Error Message  */}
                  <p
                    className={`text-red-500 font-medium text-xs mt-1 ${errors ? "visible" : "opacity-0"}`}
                  >
                    {errors.assignedTo?.message}
                  </p>
                </span>
              )}

              <button
                type="submit"
                className={`flex items-center gap-2 bg-[#8c52ef]/30 transition-all duration-200 text-white px-4 py-2 rounded-md shadow-md hover:shadow-[#9c52ef]/20 w-[100%] ${!selectedBook || isAvailable === 0 ? "opacity-50 cursor-not-allowed" : "hover:cursor-pointer"} ${handlleAssignBookMututaion.isPending ? "cursor-not-allowed" : "hover:bg-[#8c52ef]/50"}`}
                disabled={!selectedBook || isAvailable === 0}
              >
                <span className="text-sm font-medium text-center mx-auto">
                  {handlleAssignBookMututaion.isPending
                    ? "Assigning..."
                    : "Assign Book"}
                </span>
              </button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default AssignBook;
