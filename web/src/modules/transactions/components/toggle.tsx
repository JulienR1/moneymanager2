import { Component, JSX, createUniqueId } from "solid-js";

type ToggleProps = Omit<
  JSX.InputHTMLAttributes<HTMLInputElement>,
  "oninput" | "onInput"
> & {
  onToggle: (state: boolean) => void;
  class?: string;
  color?: "red" | "green";
};

const Toggle: Component<ToggleProps> = (props) => {
  const id = createUniqueId();
  const name = `toggle-${id}`;

  const handleChange: JSX.ChangeEventHandlerUnion<HTMLInputElement, Event> = (
    e,
  ) => {
    props.onToggle(e.currentTarget.checked);
  };

  return (
    <div class={"w-fit " + props.class}>
      <label id={name} class="hover:cursor-pointer">
        <input
          id={name}
          type="checkbox"
          class="invisible absolute h-0 w-0 [&+div]:[--x-position:-50%] [&:checked+div]:[--x-position:50%]"
          onchange={handleChange}
        />
        <div
          class="relative flex h-6 w-12 items-center justify-center rounded-xl border-2"
          classList={{
            "border-primary": !props.color,
            "border-red-500": props.color === "red",
            "border-green-500": props.color === "green",
          }}
        >
          <div
            class="block aspect-square h-[90%] translate-x-[var(--x-position)] rounded-full transition-all duration-200"
            classList={{
              "bg-primary": !props.color,
              "bg-red-500": props.color === "red",
              "bg-green-500": props.color === "green",
            }}
          ></div>
        </div>
      </label>
    </div>
  );
};

export default Toggle;
