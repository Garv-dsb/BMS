import { useQuery } from "@tanstack/react-query";
import Card from "../../Components/Card";
import { useParams } from "react-router-dom";

const ViewBook = () => {
  const { id } = useParams();

  // Find the user with the matching ID
  const { data: book = [], isLoading } = useQuery({
    queryKey: ["book", id],
    queryFn: async () => {
      return fetch(`/api/books/${id}`, {
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

  return (
    <div>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Book Information
            </h1>
            <p className="text-gray-400">Check the Book Details</p>
          </div>
        </div>

        {/* Books Table */}
        <Card className="border border-gray-200 dark:border-white/10">
          {isLoading ? (
            <div className="p-8 text-center">
              <p className="text-gray-400">Loading...</p>
            </div>
          ) : book.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-400">No User found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto space-y-4 p-2">
              <div className="w-full flex flex-col md:flex-row lg:flex-row gap-3">
                {/* Image  */}
                <div className="md:w-1/3 lg:w-1/3">
                  <Card className="border border-gray-200 dark:border-white/10 hover:cursor-pointer">
                    <img src={book?.imageUrl} className="mx-auto" />
                  </Card>
                </div>

                {/* Text Data  */}
                <div className="flex flex-col gap-2 md:w-2/3 lg:w-2/3">
                  {/* Title  */}
                  <Card className="border border-gray-200 dark:border-white/10">
                    <p>Title</p>
                    <p className="opacity-50">{book?.title}</p>
                  </Card>

                  {/* Author  */}
                  <Card className="border border-gray-200 dark:border-white/10">
                    <p>Author</p>
                    <p className="opacity-50">{book?.author}</p>
                  </Card>

                  {/* Description  */}
                  <Card className="border border-gray-200 dark:border-white/10">
                    <p>Description</p>
                    <p className="opacity-50">{book?.description}</p>
                  </Card>

                  <div className="w-full  flex flex-col md:flex-row lg:flex-row gap-2">
                    {/* Quantity  */}
                    <Card className="w-full md:w-1/2 lg:w-1/2 border border-gray-200 dark:border-white/10">
                      <p>Quantity</p>
                      <p className="opacity-50">{book?.quantity}</p>
                    </Card>

                    {/* Availability  */}
                    <Card className="w-full md:w-1/2 lg:w-1/2 border border-gray-200 dark:border-white/10">
                      <p>Availability</p>
                      <p
                        className={` ${book?.availability === 0 ? "text-red-500 font-bold" : "opacity-50"}`}
                      >
                        {book?.availability}
                      </p>
                    </Card>

                    {/* Added Date  */}
                    <Card className="w-full md:w-1/2 lg:w-1/2 border border-gray-200 dark:border-white/10">
                      <p>Added Date</p>
                      <p className="opacity-50">
                        {book?.createdAt?.slice(0, 10)}
                      </p>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ViewBook;
