import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Invalid email address").nonempty("Email is required").lowercase("Must be lowercase"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .nonempty("Password is required"),
});
