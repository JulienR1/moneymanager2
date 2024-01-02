import { Icon, IconProps } from "@ui/icon";
import { Component, JSX, ParentProps, Show, children, createUniqueId } from "solid-js";
import { FieldError } from "./field-error";
import { useForm } from "./form";

export type InputProps = Omit<JSX.InputHTMLAttributes<HTMLInputElement>, "oninput" | "onInput"> & {
  onInput?: JSX.InputEventHandler<HTMLInputElement, InputEvent>;
} & WrapperProps;

export type SelectProps = Omit<JSX.InputEventHandlerUnion<HTMLSelectElement, InputEvent>, "oninput" | "onInput"> & {
  onInput?: JSX.InputEventHandler<HTMLSelectElement, InputEvent>;
  placeholder?: string;
} & WrapperProps;

type WrapperProps = ParentProps<{
  id: string;
  label: string;
  name: string;
  leftIcon?: IconProps;
  rightIcon?: IconProps;
}>;

const Wrapper: Component<WrapperProps> = (props) => {
  return (
    <div class="py-2">
      <label for={props.id} class="flex items-center rounded-lg bg-white shadow shadow-gray-400 focus-within:shadow-lg">
        <Show when={props.leftIcon}>
          <Icon {...props.leftIcon!} class={"ml-2 " + props.leftIcon?.class ?? ""} size="lg" mdSize="xl" />
        </Show>

        <div class="w-full">
          <p class="translate-y-1 px-2 text-xs font-semibold text-gray-500">{props.label}</p>
          {props.children}
        </div>

        <Show when={props.rightIcon}>
          <Icon {...props.rightIcon!} class={"mr-2 " + props.rightIcon?.class ?? ""} />
        </Show>
      </label>

      <FieldError name={props.name} />
    </div>
  );
};

export const Input: Component<InputProps> = (props) => {
  const { validateForm } = useForm();
  const id = props.id + createUniqueId();

  const handleInput: JSX.InputEventHandler<HTMLInputElement, InputEvent> = (e) => {
    validateForm();
    props.onInput?.(e);
  };

  return (
    <Wrapper {...props} id={id}>
      <input
        {...props}
        id={id}
        onInput={handleInput}
        class="w-full rounded-lg p-1 pt-0 text-xs font-semibold text-black focus-visible:outline-none md:p-2 md:text-sm"
      />
    </Wrapper>
  );
};

export const Select: Component<SelectProps> = (props) => {
  const { validateForm } = useForm();
  const id = props.id + createUniqueId();
  const c = children(() => props.children);

  const handleInput: JSX.InputEventHandler<HTMLSelectElement, InputEvent> = (e) => {
    validateForm();
    props.onInput?.(e);
  };

  return (
    <Wrapper {...props} id={id}>
      <select
        {...props}
        id={id}
        onInput={handleInput}
        class="w-full rounded-lg p-1 pt-0 text-xs font-semibold text-black focus-visible:outline-none md:p-2 md:text-sm"
      >
        <Show when={props.placeholder && props.placeholder.length > 0}>
          <option>{props.placeholder}</option>
        </Show>
        {c()}
      </select>
    </Wrapper>
  );
};
