import { z } from "zod";

export const addBookSchema = z.object({
  title: z.string().min(4, "Title is required"),
  description: z.string().optional(),
  author: z.string().min(4, "Author is required"),
  quantity: z.coerce
    .number()
    .min(
      1,
      "Quantity must be a non-negative number , greater than or equal to 1",
    ),
  imageUrl: z.string().optional(),
});
