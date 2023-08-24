import { Component, JSX } from "solid-js";
import FieldError from "./field-error";
import { useForm } from "./form";

type Props = JSX.InputHTMLAttributes<HTMLInputElement> & { label: string };

const Input: Component<Props> = (props) => {
  const { validateForm } = useForm();

  return (
    <div>
      <label for={props.name}>{props.label}</label>
      <input {...props} onInput={validateForm} />
      <FieldError name={props.name} />
    </div>
  );
};

export default Input;
