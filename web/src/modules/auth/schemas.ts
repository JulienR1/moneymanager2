import {
  Output,
  custom,
  email,
  equal,
  minLength,
  nullable,
  number,
  object,
  regex,
  string,
  toTrimmed,
} from "valibot";

export const LogInSchema = object({
  email: string("Format invalide", [
    toTrimmed(),
    email("Veuillez saisir une adresse courriel"),
  ]),
  password: string("Format invalide", [
    toTrimmed(),
    minLength(1, "Veuillez saisir un mot de passe"),
  ]),
});

export const makeRegisterSchema = (currentPassword: string) =>
  object({
    firstname: string("Format invalide", [
      toTrimmed(),
      minLength(1, "Veuillez saisir votre prénom"),
    ]),
    lastname: string("Format invalide", [
      toTrimmed(),
      minLength(1, "Veuillez saisir votre nom de famille"),
    ]),
    email: string("Format invalide", [
      toTrimmed(),
      email("Veuillez saisir une adresse courriel"),
    ]),
    password: string("Format invalide", [
      toTrimmed(),
      minLength(8, "Nombre de caractères insuffisant"),
      custom((v) => v !== v.toLowerCase(), "Nécessite une lettre majuscule"),
      custom((v) => v !== v.toUpperCase(), "Nécessite une lettre minuscule"),
      regex(/\d/, "Nécessite un chiffre"),
      regex(/[!@#\$%\^&\*\(\)]+/, "Nécessite un caractère spécial"),
    ]),
    passwordConfirmation: string("Format invalide", [
      equal(currentPassword, "Les mots de passe doivent correspondre"),
    ]),
  });

export const AccessTokenSchema = object({ accessToken: string() });

export const UserSchema = object({
  id: number(),
  firstname: string(),
  lastname: string(),
  username: string(),
  pictureUrl: nullable(string()),
});

export type LogInSchema = Output<typeof LogInSchema>;
export type RegisterSchema = Output<ReturnType<typeof makeRegisterSchema>>;
export type UserSchema = Output<typeof UserSchema>;
