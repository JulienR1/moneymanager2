import { CategorySchema } from "@modules/categories";
import { TeammateSchema } from "@modules/dashboards/panels";
import { z } from "zod";

export const makeFileSchema = (params: {
  allowedTypes: [string, ...string[]];
  maxSize: number;
}) =>
  z
    .instanceof(File, { message: "Format invalide" })
    .refine((file) => file.name.length > 0, {
      message: "Le fichier doit comporter un nom",
    })
    .refine((file) => file.size <= params.maxSize, {
      message: "Le fichier saisi est trop volumineux",
    })
    .refine((file) => params.allowedTypes.includes(file.type), {
      message: "Ce type de fichier n'est pas pris en charge",
    })
    .or(
      z
        .instanceof(File)
        .transform((file) => (file.size > 0 ? file : null))
        .refine((file) => file === null, { message: "Format invalide" }),
    );

export const ReceiptFile = makeFileSchema({
  allowedTypes: ["application/pdf", "image/png", "image/jpeg", "image/webp"],
  maxSize: 10_000_000,
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
  receipt: ReceiptFile,
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

export const TransactionSchema = z.object({
  id: z.number(),
  label: z.string(),
  amount: z.number(),
  user: TeammateSchema,
  category: CategorySchema,
  receipt: z.nullable(
    z.object({
      url: z.string(),
      mime: z.string(),
    }),
  ),
  timestamp: z.string().transform((str) => new Date(str)),
});

export type NewTransactionSchema = z.infer<typeof NewTransactionSchema>;
export type NewTransactionResultSchema = z.infer<
  typeof NewTransactionResultSchema
>;
export type TransactionSchema = z.infer<typeof TransactionSchema>;
