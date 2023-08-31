import { object, string } from "valibot";

export const EnvSchema = object({
  VITE_SERVER_URL: string(),
});
