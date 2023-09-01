import {
  Accessor,
  Component,
  createContext,
  createEffect,
  createResource,
  JSX,
  onMount,
  useContext,
} from "solid-js";
import {
  authenticatedUserId,
  fetchAuthenticatedUser,
  initializeTokenRefresh,
  logout,
} from "../service";

type AuthContext = {
  connected: Accessor<boolean>;
};

const AuthContext = createContext<AuthContext>({
  connected: () => false,
});

export const useAuth = () => useContext(AuthContext);

const AuthProvider: Component<{ children: JSX.Element }> = (props) => {
  onMount(initializeTokenRefresh);

  const [authenticatedUser] = createResource(
    authenticatedUserId,
    fetchAuthenticatedUser,
  );

  createEffect(() => {
    if (authenticatedUser() === null) {
      logout();
    }
  });

  const connected = () => authenticatedUserId() !== null;

  return (
    <AuthContext.Provider value={{ connected }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
