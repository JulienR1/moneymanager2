import { logout, useAuth } from "@modules/auth";
import { cookToast } from "@modules/toasts";
import { Icon } from "@ui";
import { Component, Show } from "solid-js";
import { Profile } from "./profile";

type HeaderProps = {
  onEnableSidebar?: () => void;
};

export const Header: Component<HeaderProps> = (props) => {
  const auth = useAuth();

  function handleLogout() {
    logout();
    cookToast("Déconnexion complétée").golden();
  }

  return (
    <header class="flex items-center bg-white p-2 px-3 shadow-md md:px-6">
      <div class="flex items-center md:hidden">
        <Icon name="menu" onClick={props.onEnableSidebar} size="2xl" />
        <div class="mx-3 block h-[25px] w-[1px] bg-gray-300 md:mx-6" />
      </div>

      <nav class="flex w-full items-center"></nav>

      <div class="group ml-auto block h-[35px] w-fit">
        <Show when={auth.connected()}>
          <div class="block group-hover:hidden">
            <Profile user={auth.user} />
          </div>
          <div class="hidden h-full group-hover:block">
            <button class="flex h-full items-center" onClick={handleLogout}>
              <Icon name="logout" />
            </button>
          </div>
        </Show>
      </div>
    </header>
  );
};
