import jwtDecode from "jwt-decode";
import z from "zod";

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

const TokenSchema = z.object({
  sub: z.string().transform((str) => parseInt(str)),
  iat: z.number(),
  exp: z.number(),
});

export function decodeToken(token: string) {
  const decoded = jwtDecode(token);
  return TokenSchema.safeParse(decoded);
}
