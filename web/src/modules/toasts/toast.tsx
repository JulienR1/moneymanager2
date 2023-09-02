import Icon, { IconProps } from "@modules/form/components/icon";
import { Component, Show, createSignal, onCleanup, onMount } from "solid-js";

export type ToastColor = "primary" | "red" | "yellow";

export type ToastProps = {
  id: number;
  title: string;
  description?: string;
  icon?: IconProps;
  color: ToastColor;
  duration: number;
};

const Toast: Component<ToastProps & { onClose: (toastId: number) => void }> = (
  props,
) => {
  const [timeout, storeTimeout] = createSignal<NodeJS.Timeout | null>(null);
  const [shown, setShown] = createSignal(false);

  onMount(() => {
    setTimeout(() => setShown(true), 20);
    storeTimeout(setTimeout(close, props.duration));
  });

  onCleanup(() => clearTimeout(timeout()!));

  function close() {
    clearTimeout(timeout()!);
    setShown(false);
    setTimeout(() => props.onClose(props.id), 400);
  }

  return (
    <div
      class="max-h-0 transition-all duration-[400ms]"
      classList={{ "max-h-[80px] mt-2": shown() }}
    >
      <div
        class="pointer-events-auto ml-auto flex w-fit max-w-[300px] translate-x-[120%] overflow-visible rounded border-l-4 border-solid bg-white px-2 py-2 shadow-lg transition-all duration-[400ms]"
        classList={{
          "border-primary": props.color === "primary",
          "border-red-400": props.color === "red",
          "border-yellow-400": props.color === "yellow",
          "shown [&.shown]:translate-x-0": shown(),
        }}
      >
        <Show when={props.icon}>
          <div
            class="flex items-center justify-center"
            classList={{
              "text-primary": props.color === "primary",
              "text-red-400": props.color === "red",
              "text-yellow-400": props.color === "yellow",
            }}
          >
            <Icon {...props.icon!} />
          </div>
        </Show>
        <div class="flex flex-col justify-center px-2 text-sm">
          <h3 class="font-semibold">{props.title}</h3>
          <p>{props.description}</p>
        </div>
        <div class="max-h-[20px]">
          <button class="-translate-y-1" onClick={close}>
            <Icon name="close" size="sm" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Toast;
