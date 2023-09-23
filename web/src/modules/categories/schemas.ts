import { Output, minLength, number, object, regex, string } from "valibot";

export const Color = string("Format invalide", [
  regex(
    /#?([0-9a-fA-F]{2}){3}/,
    "Saisir une couleur dans le format hexadécimal",
  ),
]);

export const CategorySchema = object({
  label: string("Format invalide", [minLength(1, "Saisir un nom")]),
  color: Color,
  icon: string("Format invalide", [minLength(1, "Saisir un icône")]),
});

export const NewCategorySchema = object({
  id: number(),
});

export type Color = Output<typeof Color>;
export type CategorySchema = Output<typeof CategorySchema>;
