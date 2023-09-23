import { Color } from "@modules/categories/schemas";
import { Component, createSignal } from "solid-js";
import { safeParse } from "valibot";
import Input, { InputProps } from "./input";

type ColorInputProps = InputProps;

const ColorInput: Component<ColorInputProps> = (props) => {
  const [color, setColor] = createSignal<Color>("#000000");

  function onColor(e: InputEvent & { currentTarget: HTMLInputElement }) {
    const result = safeParse(Color, e.currentTarget.value);
    setColor(result.success ? result.output : "#000000");
  }

  return (
    <Input
      {...props}
      maxlength={7}
      leftIcon={{
        name: "palette",
        style: { color: color().padStart(7, "#") },
      }}
      onInput={onColor}
    />
  );
};

export default ColorInput;
