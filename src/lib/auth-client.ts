import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: "https://book-management-delta-five.vercel.app",
});
