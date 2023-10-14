/* @refresh reload */
import { Router } from "@solidjs/router";
import { render } from "solid-js/web";
import { EnvSchema } from "./env";

import AuthProvider from "@modules/auth/components/auth-provider";
import DashboardProvider from "@modules/dashboards/dashboard-provider";
import ModalProvider from "@modules/modals/modal-provider";
import ToastProvider from "@modules/toasts/toast-provider";
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
