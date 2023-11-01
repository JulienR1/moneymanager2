import { Component, JSX, splitProps } from "solid-js";

type XLs = 2 | 3 | 4 | 5 | 6 | 7 | 8;
type FontSize = "xs" | "sm" | "base" | "lg" | "xl" | `${XLs}xl`;

export type IconProps = {
  class?: string;
  style?: JSX.CSSProperties | string;
  size?: FontSize;
  mdSize?: FontSize;
  name: string;
  onClick?: (e: MouseEvent) => void;
};

const Parent: Component<
  Pick<IconProps, "onClick"> & { children: JSX.Element }
> = (props) => {
  return props.onClick ? (
    <button onclick={props.onClick} type="button" class="flex items-center">
      {props.children}
    </button>
  ) : (
    props.children
  );
};

export const Icon: Component<IconProps> = (props) => {
  const [buttonProps, iconProps] = splitProps(props, ["onClick"]);

  return (
    <Parent {...buttonProps}>
      <span
        class={`material-symbols-outlined h-fit text-inherit text-${
          props.size ?? "xl"
        } ${props.mdSize ? "md:text-" + props.mdSize ?? "xl" : ""} ${
          iconProps.class ?? ""
        }`}
        style={props.style}
      >
        {iconProps.name}
      </span>
    </Parent>
  );
};
