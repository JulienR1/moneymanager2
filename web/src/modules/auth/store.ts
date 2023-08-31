import request from "@modules/fetch/utils";
import { createSignal } from "solid-js";
import { UserSchema } from "./schemas";

type AuthStore =
  | { authenticated: false }
  | ({
      authenticated: true;
    } & (
      | { loading: true; user: { id: number } }
      | { loading: false; user: UserSchema }
    ));

const [auth, setAuth] = createSignal<AuthStore>({ authenticated: false });

export async function setAuthenticatedUser(userId: number): Promise<boolean> {
  setAuth({ authenticated: true, loading: true, user: { id: userId } });

  const data = await request(`/users/${userId}`).get(UserSchema);
  if (!data.success) {
    return false;
  }

  if (auth().authenticated) {
    setAuth({ authenticated: true, loading: false, user: data.output });
  }
  return true;
}

export function removeAuthenticatedUser() {
  setAuth({ authenticated: false });
}

export { auth };
