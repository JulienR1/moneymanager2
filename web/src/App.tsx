import "./index.css";

import { Navigate, Route, Routes } from "@solidjs/router";
import { Accessor, Match, Switch, type Component } from "solid-js";

import { useAuth } from "@modules/auth/components/auth-provider";
import Layout from "@modules/layout/layout";

import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

const App: Component = () => {
  const auth = useAuth();

  return (
    <Layout connected={auth.connected}>
      <Navigation connected={auth.connected} />
    </Layout>
  );
};

const Navigation: Component<{ connected: Accessor<boolean> }> = (props) => {
  return (
    <Routes>
      <Route path="/">
        <Switch>
          <Match when={!props.connected()}>
            <Route path="/" component={Home} />
            <Route path={["register", "login"]} component={Auth} />
          </Match>

          <Match when={props.connected()}>
            <Route path="/" component={Dashboard} />
            <Route path={["register", "login"]}>
              <Navigate href="/" />
            </Route>
          </Match>
        </Switch>
      </Route>

      <Route path="*" component={NotFound} />
    </Routes>
  );
};

export default App;
