import z from "zod";

export const EnvSchema = z.object({
  VITE_SERVER_URL: z.string().default("/api"),
});

export const config = EnvSchema.parse(import.meta.env);
