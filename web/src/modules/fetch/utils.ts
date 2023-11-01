import { config } from "@/env";
import z from "zod";
import { getAccessToken } from "./token";

type ShortRequestInit = Omit<RequestInit, "method" | "headers" | "body"> & {
  body: Record<string, unknown>;
};
type Methods = "get" | "put" | "post" | "delete";

export default function request(
  url: string,
  args?: ShortRequestInit,
): Record<
  Methods,
  <S extends z.Schema>(schema: S) => Promise<ReturnType<S["safeParse"]>>
> {
  return {
    get: (schema) => makeRequest(schema, url, "get", args),
    put: (schema) => makeRequest(schema, url, "put", args),
    post: (schema) => makeRequest(schema, url, "post", args),
    delete: (schema) => makeRequest(schema, url, "delete", args),
  };
}

async function makeRequest<S extends z.Schema>(
  schema: S,
  url: string,
  method: Methods,
  args?: ShortRequestInit,
): Promise<ReturnType<S["safeParse"]>> {
  const headers = new Headers();
  headers.append("Content-Type", "application/json");

  const accessToken = getAccessToken();
  if (accessToken) {
    headers.append("Authorization", `Bearer ${accessToken}`);
  }

  try {
    const params: RequestInit = {
      ...args,
      headers,
      method,
      credentials: "include",
      body: null,
    };
    if (method !== "get") {
      params.body = JSON.stringify(args?.body ?? {});
    }

    const response = await fetch(config.VITE_SERVER_URL + url, params);
    const data = await response.json();

    return schema.safeParse(data) as ReturnType<S["safeParse"]>;
  } catch (e) {
    return schema.safeParse(e) as ReturnType<S["safeParse"]>;
  }
}
