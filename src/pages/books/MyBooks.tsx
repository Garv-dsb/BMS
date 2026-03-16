import { useQuery } from "@tanstack/react-query";
import Card from "../../Components/Card";
import Loading from "../../Components/Loading";

const MyBooks = () => {
  // Fetch Booka data using React Query
  const { data: userBooks = [], isLoading } = useQuery({
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

  return (
    <div className="overflow-x-hidden">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              My Books History
            </h1>
            <p className="text-gray-400">View the Previous Books</p>
          </div>
        </div>

        {/* Books Table */}
        <div className="">
          {isLoading ? (
            <div className="flex justify-center items-center overflow-y-hidden">
              <Loading />
            </div>
          ) : userBooks?.data?.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-400">No Books Found...</p>
            </div>
          ) : (
            <Card className="border border-gray-200 dark:border-white/10 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-black/20 dark:border-white/10">
                    <th className="text-left p-3 sm:p-4 text-gray-600 dark:text-gray-300 font-semibold text-sm">
                      Image
                    </th>
                    <th className="text-left p-3 sm:p-4 text-gray-600 dark:text-gray-300 font-semibold text-sm">
                      Title
                    </th>
                    <th className="text-left p-3 sm:p-4 text-gray-600 dark:text-gray-300 font-semibold text-sm hidden sm:table-cell">
                      Assigned Date
                    </th>
                    <th className="text-left p-3 sm:p-4 text-gray-600 dark:text-gray-300 font-semibold text-sm hidden md:table-cell">
                      Status
                    </th>
                    <th className="text-left p-3 sm:p-4 text-gray-600 dark:text-gray-300 font-semibold text-sm hidden lg:table-cell">
                      Return Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {userBooks?.data?.map((book: any, index: any) => (
                    <tr
                      key={index}
                      className="border-b border-black/6 dark:border-white/6 hover:bg-white/5 transition-colors"
                    >
                      <td className="p-3 sm:p-4 text-gray-900 dark:text-white font-medium">
                        <img
                          src={book?.book?.imageUrl}
                          alt="avatar"
                          className="w-10 h-10 rounded-full border border-[#8c52ef]/40 object-cover"
                        />
                      </td>
                      <td className="p-3 sm:p-4 text-gray-900 dark:text-white font-medium">
                        {book?.book?.title?.slice(0, 20)}...
                      </td>
                      <td className="p-3 sm:p-4 text-gray-600 dark:text-gray-300 hidden sm:table-cell">
                        {book?.assignedAt.slice(0, 10)}
                      </td>
                      <td
                        className={`p-3 sm:p-4  hidden md:table-cell font-bold ${book.status === "active" ? "text-red-500" : "text-green-500"}`}
                      >
                        {book.status === "active" ? "Not Returned" : "Returned"}
                      </td>
                      <td
                        className={`p-3 sm:p-4 text-gray-600 dark:text-gray-300 hidden lg:table-cell `}
                      >
                        {book?.returnedAt?.slice(0, 10) || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyBooks;
