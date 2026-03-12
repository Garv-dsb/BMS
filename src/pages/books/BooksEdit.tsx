import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "../../Components/InputField";
import Button from "../../Components/Button";
import Card from "../../Components/Card";
import { useNavigate, useParams } from "react-router-dom";
import { addBookSchema } from "../../schema/addBookSchema";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

// types for book add form
interface AddBookFormData {
  title: string;
  description?: string;
  author: string;
  quantity: unknown;
  imageUrl?: string;
}

const BooksEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // USe hook form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddBookFormData>({
    resolver: zodResolver(addBookSchema),
  });

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

  // Handle the Book submit mututation
  const handleUpdateBookMutuation = useMutation({
    mutationFn: async (data: AddBookFormData) => {
      return fetch(`/api/books/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      })
        .then((res) => res.json())
        .then((data) => {
          return data;
        })
        .catch((err) => {
          console.error("Error updating book:", err);
          throw err;
        });
    },
    onSuccess: (data) => {
      if (data?.id) {
        toast.success("Book updated successfully!", {
          style: { background: "#333", color: "#fff" },
        });
      }
      navigate("/books");
      if (data?.message) {
        toast.error(data.message, {
          style: { background: "#333", color: "#fff" },
        });
      }
    },
  });

  const onSubmit = async (data: AddBookFormData) => {
    await handleUpdateBookMutuation.mutateAsync(data);
  };

  return (
    <div className="mx-auto my-auto h-screen my-auto p-4 md:p-3 lg:p-2 ">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Edit Book
          </h1>
          <p className="text-gray-400">Edit exsiting book in the system</p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-center bg-cover bg-center">
        <Card className="!mb-7 w-full md:w-1/2 lg:w-[50%] p-6 shadow-lg">
          {/* Form  */}
          {isLoading ? (
            <div className="flex items-center justify-center h-48">
              <p className="text-gray-400">Loading book data...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <InputField
                label="Title"
                name="title"
                type="text"
                placeholder="Enter the Book Title"
                register={register}
                errors={errors.title}
                defaultValue={book?.title}
                className="text-sm py-2"
              />

              <InputField
                label="Description"
                name="description"
                type="text"
                placeholder="Enter the Book Description"
                register={register}
                errors={errors.description}
                defaultValue={book?.description}
                className="text-sm py-2"
              />

              <InputField
                label="Author"
                name="author"
                type="text"
                placeholder="Enter the Author Name"
                register={register}
                errors={errors.author}
                defaultValue={book?.author}
                className="text-sm py-2"
              />

              <InputField
                label="Quantity"
                name="quantity"
                type="number"
                placeholder="Enter the Quantity in Stock"
                register={register}
                errors={errors.quantity}
                defaultValue={book?.quantity}
                className="text-sm py-2"
              />

              <InputField
                label="Image URL"
                name="imageUrl"
                type="string"
                placeholder="Enter the Image URL"
                register={register}
                errors={errors.imageUrl}
                defaultValue={book?.imageUrl}
                className="text-sm py-2"
              />

              <div className="flex justify-end gap-2">
                <div className="w-full">
                  <Button
                    text="Edit Book"
                    loading={handleUpdateBookMutuation.isPending}
                  />
                </div>
              </div>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
};

export default BooksEdit;
