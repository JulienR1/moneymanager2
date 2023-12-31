import { Icon, IconProps } from "@ui";
import { Component, JSX, Show } from "solid-js";

export type ButtonProps = JSX.ButtonHTMLAttributes<HTMLButtonElement> & {
  icon?: IconProps;
};

export const Button: Component<ButtonProps> = (props) => {
  return (
    <button
      type="submit"
      {...props}
      class={
        props.class +
        " group flex items-center rounded-2xl bg-gradient-to-tr from-primary to-secondary px-3 py-1 text-xs text-white transition-transform hover:shadow-md md:px-5 md:text-sm"
      }
    >
      {props.children}

      <Show when={props.icon}>
        <Icon
          {...props.icon!}
          class={
            "pl-2 transition-transform group-hover:translate-x-2 " +
              props.icon?.class ?? ""
          }
        />
      </Show>
    </button>
  );
};
