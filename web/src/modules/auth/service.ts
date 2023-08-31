import {
  decodeToken,
  removeAccessToken,
  storeAccessToken,
} from "@modules/fetch/token";
import request from "@modules/fetch/utils";
import { AccessTokenSchema, LogInSchema, RegisterSchema } from "./schemas";
import { removeAuthenticatedUser, setAuthenticatedUser } from "./store";

const REFRESH_PERIOD_IN_MS = 4.5 * 60 * 1000;
let refreshTimeout: NodeJS.Timeout | null;

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

  const decodedToken = decodeToken(data.output.accessToken);
  if (!decodedToken.success) {
    logout();
    return;
  }

  const success = await setAuthenticatedUser(decodedToken.output.sub);
  if (!success) {
    logout();
    return;
  }
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
  removeAuthenticatedUser();
}

function initializeTokenRefresh() {
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
