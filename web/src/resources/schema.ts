import z from "zod";

export const CategorySchema = z.object({
  id: z.number(),
  label: z.string(),
  color: z.string(),
  icon: z.string(),
});

export type Category = z.infer<typeof CategorySchema>;

export const Dashboard = z.object({
  id: z.number(),
  key: z.string(),
  label: z.string(),
  creationDate: z.string().transform((str) => new Date(str)),
  categories: z.array(CategorySchema),
});

export type Dashboard = z.infer<typeof Dashboard>;
