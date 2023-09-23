import "./index.css";

import { Navigate, Route, Routes, useNavigate } from "@solidjs/router";
import {
  Accessor,
  Match,
  Switch,
  createEffect,
  on,
  type Component,
} from "solid-js";

import { useAuth } from "@modules/auth/components/auth-provider";
import Layout from "@modules/layout/layout";

import { useDashboard } from "@modules/dashboards/dashboard-provider";
import { makeSidebarLinks } from "@modules/layout/links";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import NewTransaction from "./pages/NewTransaction";
import NotFound from "./pages/NotFound";

const App: Component = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  let initialLocation: string | null = window.location.pathname;

  createEffect(
    on(auth.connected, () => {
      if (initialLocation && auth.connected()) {
        navigate(initialLocation);
        initialLocation = null;
      }
    }),
  );

  const d = useDashboard();
  const links = () =>
    makeSidebarLinks(auth.connected(), d.dashboards(), d.selectedDashboard());

  return (
    <Layout links={links}>
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
            <Route path="/" element={<Navigate href={() => "/personal"} />} />
            <Route path="/:dashboardKey" component={Dashboard} />
            <Route path="/:dashboardKey">
              <Route path="/new/*" component={NewTransaction} />
            </Route>
          </Match>
        </Switch>
      </Route>

      <Route path="*" component={NotFound} />
    </Routes>
  );
};

export default App;
