import { Output, array, number, object, string, transform } from "valibot";

export const Category = object({
  label: string(),
  color: string(),
  icon: string(),
});

export type Category = Output<typeof Category>;

export const Dashboard = object({
  id: number(),
  key: string(),
  label: string(),
  creationDate: transform(string(), (str) => new Date(str)),
  categories: array(Category),
});

export type Dashboard = Output<typeof Dashboard>;
