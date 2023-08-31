import jwtDecode from "jwt-decode";
import { number, object, safeParse, string, transform } from "valibot";

const ACCESS_TOKEN = "access_token";

export function storeAccessToken(token: string) {
  localStorage.setItem(ACCESS_TOKEN, token);
}

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN);
}

export function removeAccessToken() {
  localStorage.removeItem(ACCESS_TOKEN);
}

const TokenSchema = object({
  sub: transform(string(), (str) => parseInt(str)),
  iat: number(),
  exp: number(),
});

export function decodeToken(token: string) {
  const decoded = jwtDecode(token);
  return safeParse(TokenSchema, decoded);
}
