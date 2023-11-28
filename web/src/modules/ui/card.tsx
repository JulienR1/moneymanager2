import { Component, JSX, Match, Ref, Show, Switch } from "solid-js";
import { Icon, IconProps } from "./icon";

export type CardProps = {
  title?: string | JSX.Element;
  leftIcon?: IconProps;
  rightIcon?: IconProps;
  children: JSX.Element;
  ref?: Ref<HTMLDivElement>;
};

export const Card: Component<CardProps> = (props) => {
  return (
    <div class="relative m-4 rounded-md bg-white shadow-md">
      <Show when={props.title}>
        <div class="flex items-center border-b-2 p-4 pb-2 pt-4 md:pt-6">
          <Show when={props.leftIcon}>
            <Icon {...props.leftIcon!} class="pr-4" />
          </Show>

          <Switch>
            <Match when={typeof props.title === "string"}>
              <h2 class="flex-grow text-base font-semibold md:text-lg">
                {props.title}
              </h2>
            </Match>
            <Match when={typeof props.title === "function"}>
              {props.title}
            </Match>
          </Switch>

          <Show when={props.rightIcon}>
            <Icon {...props.rightIcon!} class="pl-4" />
          </Show>
        </div>
      </Show>

      <div class="p-3 md:p-4" ref={props.ref}>
        {props.children}
      </div>
    </div>
  );
};
