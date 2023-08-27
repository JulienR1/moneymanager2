import "./index.css";

import { Route, Routes } from "@solidjs/router";
import { Show, type Component } from "solid-js";

import Layout from "@modules/layout/layout";

import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

const App: Component = () => {
  return (
    <Layout>
      <Navigation isLoggedIn={false} />
    </Layout>
  );
};

const Navigation: Component<{ isLoggedIn: boolean }> = (props) => {
  return (
    <Routes>
      <Route path="/">
        <Show
          when={props.isLoggedIn}
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
