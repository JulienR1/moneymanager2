import { Component, JSX, Show } from "solid-js";
import Icon, { IconProps } from "./icon";

export type ButtonProps = JSX.ButtonHTMLAttributes<HTMLButtonElement> & {
  icon?: IconProps;
};

const Button: Component<ButtonProps> = (props) => {
  return (
    <button
      type="submit"
      {...props}
      class={
        props.class +
        "group flex items-center rounded-2xl bg-gradient-to-tr from-primary to-secondary px-5 py-1 text-sm text-white transition-transform hover:shadow-md"
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

export default Button;
