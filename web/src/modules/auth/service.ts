import {
  decodeToken,
  getAccessToken,
  removeAccessToken,
  storeAccessToken,
} from "@modules/fetch/token";
import request from "@modules/fetch/utils";
import { createSignal } from "solid-js";
import {
  AccessTokenSchema,
  LogInSchema,
  RegisterSchema,
  UserSchema,
} from "./schemas";

const REFRESH_PERIOD_IN_MS = 4.5 * 60 * 1000;
let refreshTimeout: NodeJS.Timeout | null;

const [authenticatedUserId, setAuthenticatedUserId] = createSignal(
  getUserIdFromToken(),
);

export { authenticatedUserId };

export async function login(credentials: LogInSchema) {
  const payload = {
    username: credentials.email,
    password: credentials.password,
  };

  const data = await request("/auth/login", {
    body: payload,
  }).post(AccessTokenSchema);

  if (!data.success) {
    logout();
    return;
  }

  storeAccessToken(data.output.accessToken);
  initializeTokenRefresh();
  refreshAuthenticatedUser();
}

export function register(accountInfo: RegisterSchema) {
  console.log("todo: register", accountInfo);
  alert("Pas encore implémenté, contacter le développeur");
}

export function logout() {
  if (refreshTimeout) {
    clearInterval(refreshTimeout);
  }
  removeAccessToken();
  refreshAuthenticatedUser();
}

function refreshAuthenticatedUser() {
  const userId = getUserIdFromToken();
  setAuthenticatedUserId(userId);
}

export function getUserIdFromToken() {
  const accessToken = getAccessToken();
  if (!accessToken) {
    return null;
  }

  const decodedToken = decodeToken(accessToken);
  if (!decodedToken.success) {
    return null;
  }

  return decodedToken.output.sub;
}

export async function fetchAuthenticatedUser(
  userId: number,
): Promise<UserSchema | null> {
  if (userId === null) {
    return null;
  }

  const user = await request(`/users/${userId}`).get(UserSchema);
  if (!user.success) {
    return null;
  }

  return user.output;
}

export function initializeTokenRefresh() {
  if (refreshTimeout) {
    clearInterval(refreshTimeout);
  }
  refreshTimeout = setInterval(refreshAccessToken, REFRESH_PERIOD_IN_MS);
}

async function refreshAccessToken() {
  const data = await request("/auth/refresh").post(AccessTokenSchema);
  if (data.success) {
    storeAccessToken(data.output.accessToken);
  } else if (refreshTimeout) {
    logout();
  }
}
