import {
  Output,
  any,
  coerce,
  date,
  minLength,
  minValue,
  number,
  object,
  regex,
  string,
} from "valibot";

export const NewTransactionSchema = object({
  description: string("Format invalide", [
    minLength(1, "Saisir une description"),
    regex(/[a-zA-Z0-9]/, "Seuls les caractères alphanumériques sont acceptés"),
  ]),
  amount: coerce(
    number("Format invalide", [minValue(0, "Saisir une valeur positive")]),
    (str) => parseFloat(str as string),
  ),
  receipt: any(),
  date: coerce(date("Saisir une date"), (str) => new Date(str as string)),
});

export type NewTransactionSchema = Output<typeof NewTransactionSchema>;
