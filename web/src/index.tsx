/* @refresh reload */
import { Router } from "@solidjs/router";
import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";
import { render } from "solid-js/web";
import { parse } from "valibot";
import { EnvSchema } from "./env";

import App from "./App";

parse(EnvSchema, import.meta.env);
const queryClient = new QueryClient();

const root = document.getElementById("root");
render(
  () => (
    <QueryClientProvider client={queryClient}>
      <Router>
        <App />
      </Router>
    </QueryClientProvider>
  ),
  root!,
);
