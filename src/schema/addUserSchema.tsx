import { z } from "zod";

// reuse password regex from registerSchema if desired or redefine
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;

export const addUserSchema = z
  .object({
    name: z.string().min(4, "Name must be at least 4 characters"),
    email: z
      .email("Invalid email address")
      .nonempty("Email is required")
      .lowercase("Must be lowercase"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .regex(passwordRegex, "1 uppercase, 1 lowercase, 1 number"),
    confirmPassword: z
      .string()
      .min(6, "Confirm Password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
