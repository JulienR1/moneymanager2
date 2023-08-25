import { Component, JSX, splitProps } from "solid-js";

export type IconProps = {
  class?: string;
  name: string;
  onClick?: (e: MouseEvent) => void;
};

const Parent: Component<
  Pick<IconProps, "onClick"> & { children: JSX.Element }
> = (props) => {
  return props.onClick ? (
    <button onclick={props.onClick} type="button">
      {props.children}
    </button>
  ) : (
    props.children
  );
};

const Icon: Component<IconProps> = (props) => {
  const [buttonProps, iconProps] = splitProps(props, ["onClick"]);

  return (
    <Parent {...buttonProps}>
      <span
        class={`material-symbols-outlined h-fit text-lg ${
          iconProps.class ?? ""
        }`}
      >
        {iconProps.name}
      </span>
    </Parent>
  );
};

export default Icon;
