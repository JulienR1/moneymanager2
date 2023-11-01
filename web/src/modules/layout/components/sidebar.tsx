import LogoImg from "@/assets/logo3.png";

import { A } from "@solidjs/router";
import { Backdrop, Icon, IconProps } from "@ui";
import { Accessor, Component, Index, Show, createSignal } from "solid-js";

export type SidebarLinkProps = {
  href: string;
  label: string;
  icon: IconProps;
  disabled?: boolean;
  end?: boolean;
};

type SidebarProps = {
  visible: boolean;
  onClose: () => void;
  links: Accessor<Array<SidebarLinkProps>>;
  dashboardsLinks: Accessor<Array<SidebarLinkProps>>;
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

export const Sidebar: Component<SidebarProps> = (props) => {
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
              class="group flex items-center justify-between text-white"
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
                  <img class="block aspect-square w-10" src={LogoImg} />
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

            <section class="pt-6">
              <ul>
                <Index each={props.links()}>
                  {(link) => (
                    <li class="my-1">
                      <A
                        {...link()}
                        onClick={props.onClose}
                        activeClass="bg-primary opacity-100"
                        classList={{
                          "opacity-80 hocus:bg-primary hocus:opacity-100":
                            !link().disabled,
                          "opacity-50 cursor-default": !!link().disabled,
                        }}
                      >
                        <div
                          classList={{
                            "flex w-56 md:w-fit rounded bg-inherit p-2 text-white transition-all duration-300":
                              true,
                            "md:min-w-[288px]": !compact(),
                            "md:min-w-[40px]": compact(),
                          }}
                        >
                          <Icon {...link().icon} />
                          <p
                            class="truncate pl-2 transition-all duration-300 first-letter:capitalize"
                            classList={{
                              "max-w-[288px] opacity-100 visible": !compact(),
                              "md:pl-0 max-w-0 max-h-0 opacity-0 invisible":
                                compact(),
                            }}
                          >
                            {link().label}
                          </p>
                        </div>
                      </A>
                    </li>
                  )}
                </Index>
              </ul>
            </section>

            <Show when={props.dashboardsLinks().length > 0}>
              <section class="pt-6">
                <h3 class="pl-2 text-sm font-semibold text-white">
                  <Show when={!compact()} fallback={<hr class="w-1/3" />}>
                    Tableaux de bord
                  </Show>
                </h3>

                <ul>
                  <Index each={props.dashboardsLinks()}>
                    {(link) => (
                      <li class="my-1">
                        <A
                          href={link().href}
                          onClick={props.onClose}
                          activeClass="bg-primary opacity-100"
                          classList={{
                            "opacity-80 hocus:bg-primary hocus:opacity-100":
                              !link().disabled,
                            "opacity-50 cursor-default": !!link().disabled,
                          }}
                        >
                          <div
                            classList={{
                              "flex w-56 md:w-fit rounded bg-inherit p-2 text-white transition-all duration-300":
                                true,
                              "md:min-w-[288px]": !compact(),
                              "md:min-w-[40px]": compact(),
                            }}
                          >
                            <Icon {...link().icon} />
                            <p
                              class="truncate pl-2 transition-all duration-300 first-letter:capitalize"
                              classList={{
                                "max-w-[288px] opacity-100 visible": !compact(),
                                "md:pl-0 max-w-0 max-h-0 opacity-0 invisible":
                                  compact(),
                              }}
                            >
                              {link().label}
                            </p>
                          </div>{" "}
                        </A>
                      </li>
                    )}
                  </Index>
                </ul>
              </section>
            </Show>
          </div>

          <CloseButton onClose={props.onClose} />
        </div>
      </aside>
    </>
  );
};
