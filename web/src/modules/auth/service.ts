import { LogInSchema, RegisterSchema } from "./schemas";

export function login(credentials: LogInSchema) {
  console.log("todo: login", credentials);
}

export function register(accountInfo: RegisterSchema) {
  console.log("todo: register", accountInfo);
  alert("Pas encore implémenté, contacter le développeur");
}

export function logout() {
  console.log("todo: logout");
}
