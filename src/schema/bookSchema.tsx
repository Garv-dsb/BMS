import { z } from "zod";

export const bookSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  author: z.string().min(3, "Author must be at least 3 characters"),
  category: z.string().min(2, "Category must be at least 2 characters"),
  quantity: z
    .number()
    .min(1, "Quantity must be at least 1")
    .or(z.string().transform((val) => parseInt(val)))
    .refine((val) => !isNaN(val) && val > 0, "Quantity must be a positive number"),
  available: z
    .number()
    .min(0, "Available cannot be negative")
    .or(z.string().transform((val) => parseInt(val)))
    .refine((val) => !isNaN(val) && val >= 0, "Available must be a non-negative number"),
});

export type BookFormData = z.infer<typeof bookSchema>;
