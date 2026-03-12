import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "../../Components/InputField";
import Button from "../../Components/Button";
import { useState } from "react";
import Card from "../../Components/Card";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { addBookSchema } from "../../schema/addBookSchema";

// types for book add form
interface AddBookFormData {
  title: string;
  description?: string;
  author: string;
  quantity: unknown;
  imageUrl?: string;
}

const BookAdd = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // USe hook form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddBookFormData>({
    resolver: zodResolver(addBookSchema),
  });

  // Handle form submission
  const onSubmit = async (data: AddBookFormData) => {
    setIsLoading(true);
    await fetch(`/api/books`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        title: data.title,
        description: data.description,
        author: data.author,
        quantity: parseInt(String(data.quantity), 10),
        imageUrl: data.imageUrl,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setIsLoading(false);
        if (data?.id) {
          toast.success("Book added successfully!", {
            style: { background: "#333", color: "#fff" },
          });
        }
        navigate("/books");
      })
      .catch((err) => {
        setIsLoading(false);
        console.error("Error During Added Book", err.data);
        toast.error("An error occurred while adding the book.", {
          style: { background: "#333", color: "#fff" },
        });
      });

    reset();
  };

  return (
    <div className="mx-auto my-auto h-screen my-auto p-4 md:p-3 lg:p-2 ">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Add Book
          </h1>
          <p className="text-gray-400">Add a new book to the system</p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-center bg-cover bg-center">
        <Card className="!mb-7 w-full md:w-1/2 lg:w-[50%] p-6 shadow-lg">
          {/* Form  */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <InputField
              label="Title"
              name="title"
              type="text"
              placeholder="Enter the Book Title"
              register={register}
              errors={errors.title}
              className="text-sm py-2"
            />

            <InputField
              label="Description"
              name="description"
              type="text"
              placeholder="Enter the Book Description"
              register={register}
              errors={errors.description}
              className="text-sm py-2"
            />

            <InputField
              label="Author"
              name="author"
              type="text"
              placeholder="Enter the Author Name"
              register={register}
              errors={errors.author}
              className="text-sm py-2"
            />

            <InputField
              label="Quantity"
              name="quantity"
              type="number"
              placeholder="Enter the Quantity in Stock"
              register={register}
              errors={errors.quantity}
              className="text-sm py-2"
            />

            <InputField
              label="Image URL"
              name="imageUrl"
              type="string"
              placeholder="Enter the Image URL"
              register={register}
              errors={errors.imageUrl}
              className="text-sm py-2"
            />

            <div className="flex justify-end gap-2">
              <div className="w-full">
                <Button text="Add Book" loading={isLoading} />
              </div>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default BookAdd;
