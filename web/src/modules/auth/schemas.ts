import z from "zod";

export const LogInSchema = z.object({
  email: z
    .string({ invalid_type_error: "Format invalide" })
    .trim()
    .email("Veillez saisir une adresse courriel"),
  password: z
    .string({ invalid_type_error: "Format invalide" })
    .trim()
    .min(1, "Veuillez saisir un mot de passe"),
});

export const makeRegisterSchema = (currentPassword: string) =>
  z.object({
    firstname: z
      .string({ invalid_type_error: "Format invalide" })
      .trim()
      .min(1, "Veuillez saisir votre prénom"),
    lastname: z
      .string({ invalid_type_error: "Format invalide" })
      .trim()
      .min(1, "Veuillez saisir votre nom de famille"),
    email: z
      .string({ invalid_type_error: "Format invalide" })
      .trim()
      .email("Veuillez saisir une adresse courriel"),
    password: z
      .string({ invalid_type_error: "Format invalide" })
      .trim()
      .min(8, "Nombre de caractères insuffisant")
      .regex(/\d/, "Nécessite un chiffre")
      .regex(/[!@#\$%\^&\*\(\)]+/, "Nécessite un caractère spécial")
      .and(
        z
          .custom((v) => typeof v === "string" && v !== v.toLowerCase(), {
            message: "Nécessite une lettre majuscule",
          })
          .and(
            z.custom((v) => typeof v === "string" && v !== v.toUpperCase(), {
              message: "Nécessite une lettre minuscule",
            }),
          ),
      ),
    passwordConfirmation: z.literal(currentPassword, {
      invalid_type_error: "Format invalide",
    }),
  });

export const AccessTokenSchema = z.object({ accessToken: z.string() });

export const UserSchema = z.object({
  id: z.number(),
  firstname: z.string(),
  lastname: z.string(),
  username: z.string(),
  pictureUrl: z.nullable(z.string()),
});

export const NewUserSchema = z.object({ id: z.number() });

export type LogInSchema = z.infer<typeof LogInSchema>;
export type RegisterSchema = z.infer<ReturnType<typeof makeRegisterSchema>>;
export type UserSchema = z.infer<typeof UserSchema>;
