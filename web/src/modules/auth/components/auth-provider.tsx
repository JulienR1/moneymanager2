import {
  Accessor,
  Component,
  createContext,
  createEffect,
  createResource,
  JSX,
  onMount,
  Resource,
  useContext,
} from "solid-js";
import { UserSchema } from "../schemas";
import {
  authenticatedUserId,
  fetchAuthenticatedUser,
  initializeTokenRefresh,
  logout,
} from "../service";

type AuthContext = {
  connected: Accessor<boolean>;
  user: Resource<UserSchema | null>;
};

const AuthContext = createContext<AuthContext>({
  connected: () => false,
  user: (() => undefined) as Resource<UserSchema>,
});

export const useAuth = () => useContext(AuthContext);

const AuthProvider: Component<{ children: JSX.Element }> = (props) => {
  onMount(initializeTokenRefresh);

  const [authenticatedUser] = createResource(
    () => authenticatedUserId() ?? -1,
    fetchAuthenticatedUser,
  );

  createEffect(() => {
    if (authenticatedUser() === null) {
      logout();
    }
  });

  const connected = () => authenticatedUserId() !== null;

  return (
    <AuthContext.Provider value={{ connected, user: authenticatedUser }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
