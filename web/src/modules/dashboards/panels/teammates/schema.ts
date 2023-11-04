import { z } from "zod";

export const TeammateSchema = z.object({
  id: z.number(),
  firstname: z.string(),
  lastname: z.string(),
  pictureUrl: z.nullable(z.string()),
});

export type TeammateSchema = z.infer<typeof TeammateSchema>;
