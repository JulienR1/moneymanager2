import { Icon, IconProps } from "@ui/icon";
import { Component, JSX, Show, createUniqueId } from "solid-js";
import { FieldError } from "./field-error";
import { useForm } from "./form";

export type InputProps = Omit<JSX.InputHTMLAttributes<HTMLInputElement>, "oninput" | "onInput"> & {
  id: string;
  label: string;
  leftIcon?: IconProps;
  rightIcon?: IconProps;
  onInput?: JSX.InputEventHandler<HTMLInputElement, InputEvent>;
};

export const Input: Component<InputProps> = (props) => {
  const { validateForm } = useForm();

  const handleInput: JSX.InputEventHandler<HTMLInputElement, InputEvent> = (e) => {
    validateForm();
    props.onInput?.(e);
  };

  const id = props.id + createUniqueId();

  return (
    <div class="py-2">
      <label for={id} class="flex items-center rounded-lg bg-white shadow shadow-gray-400 focus-within:shadow-lg">
        <Show when={props.leftIcon}>
          <Icon {...props.leftIcon!} class={"ml-2 " + props.leftIcon?.class ?? ""} size="lg" mdSize="xl" />
        </Show>

        <div class="w-full">
          <p class="translate-y-1 px-2 text-xs font-semibold text-gray-500">{props.label}</p>
          <input
            {...props}
            id={id}
            onInput={handleInput}
            class="w-full rounded-lg p-1 pt-0 text-xs font-semibold text-black focus-visible:outline-none md:p-2 md:text-sm"
          />
        </div>

        <Show when={props.rightIcon}>
          <Icon {...props.rightIcon!} class={"mr-2 " + props.rightIcon?.class ?? ""} />
        </Show>
      </label>

      <FieldError name={props.name} />
    </div>
  );
};
