// import React, { useState } from "react";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { X, Plus, Trash2, Edit2 } from "lucide-react";
// import Card from "../../Components/Card";
// import InputField from "../../Components/InputField";
// import Button from "../../Components/Button";
// import apiBaseUrl from "../../service/apiBaseUrl";
// import { bookSchema, type BookFormData } from "../../schema/bookSchema";
// import toast from "react-hot-toast";

// interface Book extends BookFormData {
//   id?: string;
// }

// const Books = () => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingBook, setEditingBook] = useState<Book | null>(null);
//   const queryClient = useQueryClient();

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     reset,
//     setValue,
//   } = useForm<BookFormData>({
//     resolver: zodResolver(bookSchema),
//   });

//   // Fetch books
//   const {
//     data: books = [],
//     isLoading,
//     error,
//   } = useQuery({
//     queryKey: ["books"],
//     queryFn: async () => {
//       const response = await apiBaseUrl.get("/books");
//       return response.data;
//     },
//   });

//   // Add book mutation
//   const addBookMutation = useMutation({
//     mutationFn: async (data: BookFormData) => {
//       const response = await apiBaseUrl.post("/books", {
//         ...data,
//         available: data.quantity,
//       });
//       return response.data;
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["books"] });
//       toast.success("Book added successfully!");
//       handleCloseModal();
//     },
//     onError: () => {
//       toast.error("Failed to add book. Please try again.");
//     },
//   });

//   // Update book mutation
//   const updateBookMutation = useMutation({
//     mutationFn: async (data: BookFormData & { id: string }) => {
//       const response = await apiBaseUrl.put(`/books/${data.id}`, {
//         ...data,
//       });
//       return response.data;
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["books"] });
//       toast.success("Book updated successfully!");
//       handleCloseModal();
//     },
//     onError: () => {
//       toast.error("Failed to update book. Please try again.");
//     },
//   });

//   // Delete book mutation
//   const deleteBookMutation = useMutation({
//     mutationFn: async (bookId: string) => {
//       await apiBaseUrl.delete(`/books/${bookId}`);
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["books"] });
//       toast.success("Book deleted successfully!");
//     },
//     onError: () => {
//       toast.error("Failed to delete book. Please try again.");
//     },
//   });

//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//     setEditingBook(null);
//     reset();
//   };

//   const handleEditBook = (book: Book) => {
//     setEditingBook(book);
//     setValue("title", book.title);
//     setValue("author", book.author);
//     setValue("category", book.category);
//     setValue("quantity", book.quantity);
//     setValue("available", book.available);
//     setIsModalOpen(true);
//   };

//   const handleAddBookClick = () => {
//     setEditingBook(null);
//     reset();
//     setIsModalOpen(true);
//   };

//   const onSubmit = async (data: BookFormData) => {
//     if (editingBook?.id) {
//       await updateBookMutation.mutateAsync({ ...data, id: editingBook.id });
//     } else {
//       await addBookMutation.mutateAsync(data);
//     }
//   };

//   const handleDeleteBook = (bookId: string) => {
//     if (window.confirm("Are you sure you want to delete this book?")) {
//       deleteBookMutation.mutate(bookId);
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <p className="text-gray-400">Loading books...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-3xl font-bold text-white mb-2">
//             Books Management
//           </h1>
//           <p className="text-gray-400">Manage your library books inventory</p>
//         </div>
//         <button
//           onClick={handleAddBookClick}
//           className="bg-[#8c52ef] hover:bg-[#9c52ef] transition-all duration-200 text-white px-4 py-2 rounded-md flex items-center gap-2 shadow-md hover:shadow-[#8c52ef]/60"
//         >
//           <Plus size={20} />
//           Add Book
//         </button>
//       </div>

//       {/* Books Table */}
//       <Card className="border border-white/10">
//         {books.length === 0 ? (
//           <div className="p-8 text-center">
//             <p className="text-gray-400">
//               No books found. Click "Add Book" to create one.
//             </p>
//           </div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full text-sm">
//               <thead>
//                 <tr className="border-b border-white/10">
//                   <th className="text-left p-4 text-gray-300 font-semibold">
//                     Title
//                   </th>
//                   <th className="text-left p-4 text-gray-300 font-semibold">
//                     Author
//                   </th>
//                   <th className="text-left p-4 text-gray-300 font-semibold">
//                     Category
//                   </th>
//                   <th className="text-left p-4 text-gray-300 font-semibold">
//                     Quantity
//                   </th>
//                   <th className="text-left p-4 text-gray-300 font-semibold">
//                     Available
//                   </th>
//                   <th className="text-center p-4 text-gray-300 font-semibold">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {books.map((book: Book, index: number) => (
//                   <tr
//                     key={book.id || index}
//                     className="border-b border-white/6 hover:bg-white/5 transition-colors"
//                   >
//                     <td className="p-4 text-white">{book.title}</td>
//                     <td className="p-4 text-gray-300">{book.author}</td>
//                     <td className="p-4 text-gray-300">{book.category}</td>
//                     <td className="p-4 text-gray-300">
//                       <span className="bg-[#8c52ef]/20 text-[#8c52ef] px-3 py-1 rounded-md text-xs font-medium">
//                         {book.quantity}
//                       </span>
//                     </td>
//                     <td className="p-4 text-gray-300">
//                       <span
//                         className={`px-3 py-1 rounded-md text-xs font-medium ${
//                           book.available > 0
//                             ? "bg-green-500/20 text-green-400"
//                             : "bg-red-500/20 text-red-400"
//                         }`}
//                       >
//                         {book.available}
//                       </span>
//                     </td>
//                     <td className="p-4 text-center flex justify-center gap-2">
//                       <button
//                         onClick={() => handleEditBook(book)}
//                         className="text-[#8c52ef] hover:text-[#9c52ef] transition-colors p-2 hover:bg-white/5 rounded-md"
//                         title="Edit"
//                       >
//                         <Edit2 size={18} />
//                       </button>
//                       <button
//                         onClick={() => handleDeleteBook(book.id!)}
//                         className="text-red-500 hover:text-red-400 transition-colors p-2 hover:bg-white/5 rounded-md"
//                         title="Delete"
//                       >
//                         <Trash2 size={18} />
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </Card>

//       {/* Add/Edit Modal */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//           <Card className="w-full max-w-md border border-white/10">
//             {/* Modal Header */}
//             <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/10">
//               <h2 className="text-xl font-bold text-white">
//                 {editingBook ? "Edit Book" : "Add New Book"}
//               </h2>
//               <button
//                 onClick={handleCloseModal}
//                 className="text-gray-400 hover:text-white transition-colors"
//               >
//                 <X size={24} />
//               </button>
//             </div>

//             {/* Modal Form */}
//             <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//               <InputField
//                 label="Book Title"
//                 name="title"
//                 type="text"
//                 placeholder="e.g., Clean Code"
//                 register={register}
//                 errors={errors.title}
//                 className="text-sm py-2"
//               />

//               <InputField
//                 label="Author"
//                 name="author"
//                 type="text"
//                 placeholder="e.g., Robert Martin"
//                 register={register}
//                 errors={errors.author}
//                 className="text-sm py-2"
//               />

//               <InputField
//                 label="Category"
//                 name="category"
//                 type="text"
//                 placeholder="e.g., Programming"
//                 register={register}
//                 errors={errors.category}
//                 className="text-sm py-2"
//               />

//               <InputField
//                 label="Quantity"
//                 name="quantity"
//                 type="number"
//                 placeholder="e.g., 10"
//                 register={register}
//                 errors={errors.quantity}
//                 className="text-sm py-2"
//               />

//               <InputField
//                 label="Available"
//                 name="available"
//                 type="number"
//                 placeholder="e.g., 10"
//                 register={register}
//                 errors={errors.available}
//                 className="text-sm py-2"
//               />

//               {/* Form Actions */}
//               <div className="flex gap-3 mt-6">
//                 <button
//                   type="button"
//                   onClick={handleCloseModal}
//                   className="flex-1 px-4 py-2 border border-gray-400 text-gray-300 rounded-md hover:bg-white/5 transition-colors"
//                 >
//                   Cancel
//                 </button>
//                 <div className="flex-1">
//                   <Button
//                     text={editingBook ? "Update Book" : "Add Book"}
//                     loading={
//                       addBookMutation.isPending || updateBookMutation.isPending
//                     }
//                   />
//                 </div>
//               </div>
//             </form>
//           </Card>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Books;

