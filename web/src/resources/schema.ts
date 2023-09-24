import { Output, array, number, object, string, transform } from "valibot";

export const CategorySchema = object({
  id: number(),
  label: string(),
  color: string(),
  icon: string(),
});

export type Category = Output<typeof CategorySchema>;

export const Dashboard = object({
  id: number(),
  key: string(),
  label: string(),
  creationDate: transform(string(), (str) => new Date(str)),
  categories: array(CategorySchema),
});

export type Dashboard = Output<typeof Dashboard>;
