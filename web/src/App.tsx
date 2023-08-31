import "./index.css";

import { Route, Routes } from "@solidjs/router";
import { Accessor, Show, type Component } from "solid-js";

import { auth } from "@modules/auth/store";
import Layout from "@modules/layout/layout";

import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

const App: Component = () => {
  const connected = () => auth().authenticated;

  return (
    <Layout connected={connected}>
      <Navigation connected={connected} />
    </Layout>
  );
};

const Navigation: Component<{ connected: Accessor<boolean> }> = (props) => {
  return (
    <Routes>
      <Route path="/">
        <Show
          when={props.connected()}
          fallback={<Route path="/" component={Home}></Route>}
        >
          <Route path="/" component={Dashboard}></Route>
        </Show>
      </Route>
      <Route path={["register", "login"]} component={Auth} />
      <Route path="*" component={NotFound} />
    </Routes>
  );
};

export default App;
