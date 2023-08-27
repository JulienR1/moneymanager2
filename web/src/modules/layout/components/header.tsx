import Icon from "@modules/form/components/icon";
import { Component } from "solid-js";

type HeaderProps = {
  onEnableSidebar?: () => void;
};

const Header: Component<HeaderProps> = (props) => {
  return (
    <header class="flex items-center p-2 px-3 shadow-md md:px-6">
      <div class="flex items-center md:hidden">
        <Icon name="menu" onClick={props.onEnableSidebar} size="2xl" />
        <div class="mx-3 block h-[25px] w-[1px] bg-gray-300 md:mx-6" />
      </div>

      <nav>header</nav>
    </header>
  );
};

export default Header;
