import z from "zod";

export const Color = z
  .string({ invalid_type_error: "Format invalide" })
  .regex(
    /#?([0-9a-fA-F]{2}){3}/,
    "Saisir une couleur dans le format hexadécimal",
  );

export const CategorySchema = z.object({
  label: z
    .string({ invalid_type_error: "Format invalide" })
    .min(1, "Saisir un nom"),
  color: Color,
  icon: z
    .string({ invalid_type_error: "Format invalide" })
    .min(1, "Saisir un icône"),
});

export const NewCategorySchema = z.object({
  id: z.number(),
});

export type Color = z.infer<typeof Color>;
export type CategorySchema = z.infer<typeof CategorySchema>;
