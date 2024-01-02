import "./index.css";

import { useAuth } from "@modules/auth";
import { useDashboard } from "@modules/dashboards";
import { Layout, makeSidebarLinks } from "@modules/layout";
import { DetailedTransaction } from "@modules/transactions";
import { Navigate, Route, Routes, useNavigate } from "@solidjs/router";
import { Accessor, Match, Switch, createEffect, on, type Component } from "solid-js";

import { NoContent } from "@ui";
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
  const links = () => makeSidebarLinks(auth.connected(), d.dashboards(), d.selectedDashboard());

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
              <Route path="/transactions/:transactionId" component={DetailedTransaction} />
              <Route path="/categories/:categoryId" component={() => <NoContent message="TODO" />} />
              <Route path="/profiles/:profileId" component={() => <NoContent message="TODO" />} />
            </Route>
          </Match>
        </Switch>
      </Route>

      <Route path="*" component={NotFound} />
    </Routes>
  );
};

export default App;
