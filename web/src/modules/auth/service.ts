import {
  decodeToken,
  getAccessToken,
  removeAccessToken,
  storeAccessToken,
} from "@modules/fetch/token";
import request from "@modules/fetch/utils";
import { cookToast } from "@modules/toasts/toast-factory";
import { Navigator } from "@solidjs/router";
import { createSignal } from "solid-js";
import {
  AccessTokenSchema,
  LogInSchema,
  NewUserSchema,
  RegisterSchema,
  UserSchema,
} from "./schemas";

const REFRESH_PERIOD_IN_MS = 4.5 * 60 * 1000;
let refreshTimeout: NodeJS.Timeout | null;

const [authenticatedUserId, setAuthenticatedUserId] = createSignal(
  getUserIdFromToken(),
);

export { authenticatedUserId };

export async function login(credentials: LogInSchema, navigate: Navigator) {
  const payload = {
    username: credentials.email,
    password: credentials.password,
  };

  const result = await request("/auth/login", {
    body: payload,
  }).post(AccessTokenSchema);

  if (!result.success) {
    cookToast("Connexion impossible", {
      description: "Les paramètres saisis sont invalides.",
    }).burnt();
    logout();
    return;
  }

  storeAccessToken(result.data.accessToken);
  initializeTokenRefresh();
  refreshAuthenticatedUser();

  cookToast("Connexion réussie").golden();
  navigate("/");
}

export async function register(
  accountInfo: RegisterSchema,
  navigate: Navigator,
) {
  const payload = {
    firstname: accountInfo.firstname,
    lastname: accountInfo.lastname,
    username: accountInfo.email,
    password: accountInfo.password,
  };

  const data = await request("/register", { body: payload }).post(
    NewUserSchema,
  );

  if (!data.success) {
    cookToast("Échec de l'enregistrement", {
      description: "Impossible de créer le nouvel utilisateur",
      duration: 6000,
    }).burnt();
    return;
  }

  cookToast("Compte créé", {
    description: "Contacter un administrateur pour l'activer",
    duration: 8000,
  }).golden();
  navigate("/");
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
    cookToast("Échec de reconnexion", {
      description: "Veuillez vous reconnecter",
    }).dry();
    return null;
  }

  return decodedToken.data.sub;
}

export async function fetchAuthenticatedUser(
  userId: number,
): Promise<UserSchema | null> {
  if (userId < 0) {
    return null;
  }

  const user = await request(`/users/${userId}`).get(UserSchema);
  if (!user.success) {
    return null;
  }

  return user.data;
}

export function initializeTokenRefresh() {
  if (refreshTimeout) {
    clearInterval(refreshTimeout);
  }
  refreshTimeout = setInterval(refreshAccessToken, REFRESH_PERIOD_IN_MS);
}

async function refreshAccessToken() {
  const result = await request("/auth/refresh").post(AccessTokenSchema);
  if (result.success) {
    storeAccessToken(result.data.accessToken);
  } else if (refreshTimeout) {
    cookToast("Vous avez été déconnecté", {
      description: "Votre connexion est expirée",
      duration: 10_000,
    }).burnt();
    logout();
  }
}
