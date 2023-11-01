import { Component, onCleanup, onMount } from "solid-js";

type BackdropProps = {
  visible: boolean;
  onClick?: Function;
  class?: string;
};

export const Backdrop: Component<BackdropProps> = (props) => {
  function handleEscape(event: KeyboardEvent) {
    if (event.key === "Escape" && props.visible) {
      props.onClick?.();
    }
  }

  onMount(() => document.addEventListener("keydown", handleEscape));
  onCleanup(() => document.removeEventListener("keydown", handleEscape));

  return (
    <div
      onClick={() => props.onClick?.()}
      classList={{
        "absolute left-0 top-0 h-full w-full bg-gray-900 transition-all": true,
        "pointer-events-none opacity-0": !props.visible,
        "pointer-events-auto opacity-70": props.visible,
        [props.class ?? ""]: !!props.class,
      }}
    />
  );
};
