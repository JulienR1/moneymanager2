import z from "zod";

export const EnvSchema = z.object({
  VITE_SERVER_URL: z.optional(z.string()),
});
