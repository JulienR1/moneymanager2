/* @refresh reload */
import { Router } from "@solidjs/router";
import { render } from "solid-js/web";
import { EnvSchema } from "./env";

import { AuthProvider } from "@modules/auth";
import { DashboardProvider } from "@modules/dashboards";
import { ModalProvider } from "@modules/modals";
import { ToastProvider } from "@modules/toasts/toast-provider";

import App from "./App";

EnvSchema.parse(import.meta.env);

const root = document.getElementById("root");
render(
  () => (
    <Router>
      <ModalProvider>
        <AuthProvider>
          <DashboardProvider>
            <App />
          </DashboardProvider>
          <ToastProvider />
        </AuthProvider>
      </ModalProvider>
    </Router>
  ),
  root!,
);
