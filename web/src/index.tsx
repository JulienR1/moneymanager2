/* @refresh reload */
import { Router } from "@solidjs/router";
import { render } from "solid-js/web";
import "./env";

import { AuthProvider } from "@modules/auth";
import { DashboardProvider } from "@modules/dashboards";
import { ModalProvider } from "@modules/modals";
import { ToastProvider } from "@modules/toasts/toast-provider";

import App from "./App";

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
