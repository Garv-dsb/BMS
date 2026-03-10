import { z } from "zod";

export const editUserAdminSchema = z.object({
  name: z.string().min(4, "Name must be at least 4 characters"),
  email: z.email("Invalid email address"),
  image: z.string().optional(),
});
