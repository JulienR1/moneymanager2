import LogInForm from "@modules/auth/components/log-in";
import RegisterForm from "@modules/auth/components/register";
import { logout } from "@modules/auth/service";

import { A, useLocation } from "@solidjs/router";
import { Match, Switch, createEffect, createSignal } from "solid-js";

type AuthOption = "login" | "register";

const title = {
  login: { primary: "Connexion", secondary: "Veuillez vous connecter" },
  register: { primary: "Enregistrement", secondary: "" },
} satisfies Record<AuthOption, unknown>;

const otherOption = {
  login: {
    question: "Pas de compte?",
    solution: "Créer un compte",
    link: "/register",
  },
  register: {
    question: "Déjà un compte?",
    solution: "Se connecter",
    link: "/login",
  },
} satisfies Record<AuthOption, unknown>;

const Auth = () => {
  const location = useLocation();
  const [authMode, setAuthMode] = createSignal<AuthOption>("login");

  createEffect(() => {
    if (location.pathname.includes("login")) {
      setAuthMode("login");
    } else if (location.pathname.includes("register")) {
      setAuthMode("register");
    } else {
      logout();
      return;
    }
  });

  return (
    <div class="mx-auto w-80 p-4">
      <hgroup class="pb-6">
        <h2 class="text-2xl font-bold">{title[authMode()].primary}</h2>
        <h3 class="text-sm font-semibold text-gray-500">
          {title[authMode()].secondary}
        </h3>
      </hgroup>

      <div class="w-full">
        <Switch>
          <Match when={authMode() === "login"}>
            <LogInForm />
          </Match>
          <Match when={authMode() === "register"}>
            <RegisterForm />
          </Match>
        </Switch>
      </div>

      <div class="absolute bottom-4 left-1/2 flex w-full -translate-x-1/2 justify-center text-sm md:relative md:bottom-0 md:mt-4">
        <p class="pr-1 text-gray-500">{otherOption[authMode()].question}</p>
        <A
          href={otherOption[authMode()].link}
          class="font-bold text-primary hover:underline"
        >
          {otherOption[authMode()].solution}
        </A>
      </div>
    </div>
  );
};

export default Auth;
