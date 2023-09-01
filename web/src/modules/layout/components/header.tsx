import { Component } from "solid-js";

import { useAuth } from "@modules/auth/components/auth-provider";
import { logout } from "@modules/auth/service";
import Icon from "@modules/form/components/icon";

import Profile from "./profile";

type HeaderProps = {
  onEnableSidebar?: () => void;
};

const Header: Component<HeaderProps> = (props) => {
  const auth = useAuth();

  return (
    <header class="flex items-center p-2 px-3 shadow-md md:px-6">
      <div class="flex items-center md:hidden">
        <Icon name="menu" onClick={props.onEnableSidebar} size="2xl" />
        <div class="mx-3 block h-[25px] w-[1px] bg-gray-300 md:mx-6" />
      </div>

      <nav class="flex w-full items-center">
        <button onclick={logout}>log out</button>
        <div class="ml-auto block w-fit">
          <Profile user={auth.user} />
        </div>
      </nav>
    </header>
  );
};

export default Header;
