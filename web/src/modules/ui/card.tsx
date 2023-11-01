import { Component, JSX, Show } from "solid-js";
import { Icon, IconProps } from "./icon";

export type CardProps = {
  title?: string;
  leftIcon?: IconProps;
  rightIcon?: IconProps;
  children: JSX.Element;
};

export const Card: Component<CardProps> = (props) => {
  return (
    <div class="relative m-4 rounded-md bg-white shadow-md">
      <Show when={props.title}>
        <div class="flex items-center border-b-2 p-4 pb-2 pt-4 md:pt-6">
          <Show when={props.leftIcon}>
            <Icon {...props.leftIcon!} class="pr-4" />
          </Show>
          <h2 class="flex-grow text-base font-semibold md:text-lg">
            {props.title}
          </h2>
          <Show when={props.rightIcon}>
            <Icon {...props.rightIcon!} class="pl-4" />
          </Show>
        </div>
      </Show>
      <div class="p-4">{props.children}</div>
    </div>
  );
};
