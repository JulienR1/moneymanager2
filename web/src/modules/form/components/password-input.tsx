import { Component, createSignal } from "solid-js";
import Input, { InputProps } from "./input";

const PasswordInput: Component<InputProps> = (props) => {
  const [showPassword, setShowPassword] = createSignal(false);

  const passwordInputType = () => (showPassword() ? "text" : "password");
  const passwordIcon = () => (showPassword() ? "visibility" : "visibility_off");

  return (
    <Input
      {...props}
      type={passwordInputType()}
      leftIcon={{ name: "lock" }}
      rightIcon={{
        name: passwordIcon(),
        onClick: () => setShowPassword((v) => !v),
      }}
    />
  );
};

export default PasswordInput;
