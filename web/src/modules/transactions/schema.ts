import { z } from "zod";

export const makeFileSchema = (params: {
  allowedTypes: [string, ...string[]];
  maxSize: number;
}) =>
  z.instanceof(File, { message: "Format invalide" }).and(
    z.object({
      lastModified: z.number(),
      lastModifiedDate: z.date(),
      name: z
        .string({ invalid_type_error: "Format invalide" })
        .min(1, { message: "Le fichier doit comporter un nom" }),
      size: z
        .number({ invalid_type_error: "Format invalide" })
        .max(params.maxSize, {
          message: "Le fichier saisi est trop volumineux",
        }),
      type: z.enum(params.allowedTypes, {
        invalid_type_error: "Le type de fichier n'est pas supporté",
      }),
    }),
  );

export const ReceiptFile = makeFileSchema({
  allowedTypes: ["application/pdf", "image/png", "image/jpeg", "image/webp"],
  maxSize: 1_000_000,
});

export const NewTransactionSchema = z.object({
  isIncome: z.optional(z.literal("on").transform((str) => !!str)),
  description: z
    .string({ invalid_type_error: "Format invalide" })
    .min(1, { message: "Saisir une description" })
    .regex(/[a-zA-Z0-9]/, {
      message: "Seuls les caractères alphanumériques sont acceptés",
    }),
  amount: z
    .string({ invalid_type_error: "Format invalide" })
    .transform((str) => parseFloat(str))
    .pipe(
      z
        .number({ invalid_type_error: "Saisir un montant" })
        .min(0, { message: "Saisir une valeur positive" }),
    ),
  receipt: z.union([
    ReceiptFile,
    z.object({
      name: z.literal(""),
      size: z.literal(0),
    }),
  ]),
  date: z
    .string({ invalid_type_error: "Saisir une date" })
    .transform((str) => new Date(str)),
  category: z
    .string({
      required_error: "Saisir une catégorie",
      invalid_type_error: "Format invalide",
    })
    .transform((str) => parseInt(str) || -1)
    .pipe(z.number().min(0, { message: "Sélectionner une catégorie" })),
});

export const NewTransactionResultSchema = z.object({
  id: z.number(),
});

export type NewTransactionSchema = z.infer<typeof NewTransactionSchema>;
export type NewTransactionResultSchema = z.infer<
  typeof NewTransactionResultSchema
>;
