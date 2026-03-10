import { z } from "zod";

export const editUserProfileSchema = z.object({
  name: z.string().min(4, "Name must be at least 4 characters long"),
  image: z.string().optional(),
});
