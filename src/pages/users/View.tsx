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

  // Fetch Booka data using React Query
  const { data: books = [] } = useQuery({
    queryKey: ["books", "assigned"],
    queryFn: async () => {
      return fetch("/api/books/assigned", {
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

  // filter the data of books to get only the books assigned to the user
  const assignedBooks = books?.data?.filter(
    (book: any) => book.userId === user.id,
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            User Information
          </h1>
          <p className="text-gray-400">Check the User Details</p>
        </div>
      </div>

      {/* Books Table */}
      <Card className="border border-gray-200 dark:border-white/10">
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
            {" "}
            <div className="overflow-x-auto space-y-4 p-2">
              <div className="w-full flex flex-col md:flex-row lg:flex-row gap-3">
                {/* Image  */}
                <div className="md:w-1/3 lg:w-1/3">
                  <Card className="flex justify-center items-center border border-gray-200 dark:border-white/10 hover:cursor-pointer">
                    <img
                      src={
                        user?.image ||
                        "https://cdn-icons-png.flaticon.com/512/219/219970.png"
                      }
                      className="w-50 h-50 object-cover"
                    />
                  </Card>
                </div>

                <div className="flex flex-col gap-2 w-full">
                  {/* Text Data  */}
                  <div className="flex flex-col md:flex-row lg:flex-row gap-2 w-full">
                    {/* Name  */}
                    <Card className="w-full md:w-[50%] lg:w-[50%] h-fit border border-gray-200 dark:border-white/10">
                      <p>Name</p>
                      <p className="opacity-50">{user?.name}</p>
                    </Card>

                    {/* Email  */}
                    <Card className="w-full md:w-[50%] lg:w-[50%]t h-fit border border-gray-200 dark:border-white/10">
                      <p>Email</p>
                      <p className="opacity-50">{user?.email}</p>
                    </Card>
                  </div>

                  <div className="flex flex-col md:flex-row lg:flex-row gap-2 w-full">
                    {/* Role  */}
                    <Card className="w-full md:w-[50%] lg:w-[50%] h-fit border border-gray-200 dark:border-white/10">
                      <p>Role</p>
                      <p className="opacity-50">{user?.role}</p>
                    </Card>

                    {/* Banned status  */}
                    <Card
                      className={`w-full md:w-[50%] lg:w-[50%] h-fit border border-gray-200 dark:border-white/10 `}
                    >
                      <p>banned</p>
                      <p
                        className={`font-bold ${user?.banned === true ? "text-red-500" : "text-green-500 "}`}
                      >
                        {user?.banned === true ? "Banned" : "Active"}
                      </p>
                    </Card>
                  </div>

                  {user?.banned === true ? (
                    <Card className="w-full h-fit border border-red-500">
                      <p className="text-red-500">
                        This user is banned and cannot access the system.
                      </p>
                    </Card>
                  ) : assignedBooks.length === 0 ? (
                    <Card className="w-full h-fit border border-white/10">
                      <p className="text-gray-400">
                        No Books assigned to this user.
                      </p>
                    </Card>
                  ) : (
                    assignedBooks.map((book: any) => (
                      <Card
                        key={book.id}
                        className="w-full h-fit border border-gray-200 dark:border-white/10"
                      >
                        <div className="flex flex-col gap-2 w-full">
                          <div className="overflow-x-auto space-y-4 p-2">
                            <div className="w-full flex flex-col md:flex-row lg:flex-row gap-3">
                              {/* Image  */}
                              <div className="md:w-1/3 lg:w-1/3">
                                <Card className="border border-white/10 hover:cursor-pointer">
                                  <img src={book?.book?.imageUrl} />
                                </Card>
                              </div>

                              {/* Text Data  */}
                              <div className="flex flex-col gap-2 md:w-2/3 lg:w-2/3">
                                {/* Title  */}
                                <Card className="border border-white/10">
                                  <p>Title</p>
                                  <p className="opacity-50">
                                    {book?.book?.title}
                                  </p>
                                </Card>

                                {/* Author  */}
                                <Card className="border border-white/10">
                                  <p>Author</p>
                                  <p className="opacity-50">
                                    {book?.book?.author}
                                  </p>
                                </Card>

                                {/* Description  */}
                                <Card className="border border-white/10">
                                  <p>Description</p>
                                  <p className="opacity-50">
                                    {book?.book?.description?.slice(0, 100)}...
                                  </p>
                                </Card>

                                <div className="w-full  flex flex-col md:flex-row lg:flex-row gap-2">
                                  {/* Returned Status  */}
                                  <Card className="w-full md:w-1/2 lg:w-1/2 border border-gray-200 dark:border-white/10">
                                    <p>Returned Status</p>
                                    <p
                                      className={`font-bold ${book?.status === "returned" ? "text-green-500" : "text-red-500"}`}
                                    >
                                      {book?.status === "returned"
                                        ? "Returned"
                                        : "Not Returned"}
                                    </p>
                                  </Card>

                                  {/* Return Date  */}
                                  <Card className="w-full md:w-1/2 lg:w-1/2 border border-gray-200 dark:border-white/10">
                                    <p>Return Date</p>
                                    <p className={``}>
                                      {book?.returnedAt
                                        ? book?.returnedAt?.slice(0, 10)
                                        : "-"}
                                    </p>
                                  </Card>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default View;
