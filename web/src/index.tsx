/* @refresh reload */
import { Router } from "@solidjs/router";
import { render } from "solid-js/web";
import { parse } from "valibot";
import { EnvSchema } from "./env";

import AuthProvider from "@modules/auth/components/auth-provider";
import ToastProvider from "@modules/toasts/toast-provider";
import App from "./App";

parse(EnvSchema, import.meta.env);

const root = document.getElementById("root");
render(
  () => (
    <Router>
      <AuthProvider>
        <App />
        <ToastProvider />
      </AuthProvider>
    </Router>
  ),
  root!,
);
