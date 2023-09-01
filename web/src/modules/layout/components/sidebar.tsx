import Icon, { IconProps } from "@modules/form/components/icon";
import Backdrop from "./backdrop";

import { A } from "@solidjs/router";
import { Accessor, Component, Index, Show, createSignal } from "solid-js";

export type SidebarLinkProps = { href: string; label: string; icon: IconProps };

type SidebarProps = {
  visible: boolean;
  onClose: () => void;
  links: SidebarLinkProps[];
};

const CloseButton: Component<Pick<SidebarProps, "onClose">> = (props) => {
  return (
    <div class="absolute right-0 translate-x-full md:hidden">
      <Icon
        name="close"
        class="p-3 text-3xl font-semibold text-white"
        onClick={props.onClose}
      />
    </div>
  );
};

const LinkGroup: Component<{
  title?: string;
  onClick: Function;
  compact: Accessor<boolean>;
  links: SidebarLinkProps[];
}> = (props) => {
  return (
    <section class="pt-6">
      <Show when={props.title}>
        <h3 class="pl-2 text-sm font-light text-white">{props.title}</h3>
      </Show>

      <ul>
        <Index each={props.links}>
          {(link) => (
            <li class="my-1">
              <SidebarLink
                compact={props.compact}
                onClick={props.onClick}
                {...link()}
              />
            </li>
          )}
        </Index>
      </ul>
    </section>
  );
};

const SidebarLink: Component<
  {
    onClick: Function;
    compact: Accessor<boolean>;
  } & SidebarLinkProps
> = (props) => {
  return (
    <A
      href={props.href}
      onClick={() => props.onClick()}
      class="opacity-80 hocus:bg-primary hocus:opacity-100"
      activeClass="bg-primary opacity-100 font-bold"
    >
      <div
        classList={{
          "flex w-56 md:w-fit rounded bg-inherit p-2 text-white transition-all duration-300":
            true,
          "md:min-w-[288px]": !props.compact(),
          "md:min-w-[40px]": props.compact(),
        }}
      >
        <Icon {...props.icon} />
        <p
          classList={{
            "pl-2 transition-all duration-300 truncate": true,
            "max-w-[288px] opacity-100 visible": !props.compact(),
            "md:pl-0 max-w-0 max-h-0 opacity-0 invisible": props.compact(),
          }}
        >
          {props.label}
        </p>
      </div>
    </A>
  );
};

const Sidebar: Component<SidebarProps> = (props) => {
  const [compact, setCompact] = createSignal(false);

  const toggleCompact = () => setCompact((c) => !c);

  return (
    <>
      <Backdrop
        visible={props.visible}
        onClick={props.onClose}
        class="duration-300 md:hidden"
      />

      <aside
        classList={{
          "absolute left-0 top-0 h-[100vh] bg-primary-dark transition-all duration-300":
            true,
          "-translate-x-[130%]": !props.visible,
          "translate-x-0": props.visible,
          "md:translate-x-0 md:relative": true,
          "md:max-w-[320px]": !compact(),
          "md:max-w-[80px]": compact(),
        }}
      >
        <div class="relative flex min-w-[200px]">
          <div class="p-4">
            <div
              class="group flex items-center justify-between"
              classList={{ "md:hover:flex-row-reverse": compact() }}
            >
              <A
                href="/"
                onclick={props.onClose}
                class="block w-fit"
                classList={{
                  "md:visible": !compact(),
                  "md:group-hover:invisible": compact(),
                }}
              >
                <figure>
                  <img
                    class="block aspect-square w-10"
                    src="/src/assets/logo3.png"
                  />
                </figure>
              </A>

              <Icon
                name="start"
                onClick={toggleCompact}
                class={`hidden w-10 text-white md:inline-block ${
                  compact()
                    ? "rotate-0 md:invisible md:group-hover:visible"
                    : "rotate-180"
                }`}
              />
            </div>

            <LinkGroup
              compact={compact}
              links={props.links}
              onClick={props.onClose}
            />
          </div>

          <CloseButton onClose={props.onClose} />
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
