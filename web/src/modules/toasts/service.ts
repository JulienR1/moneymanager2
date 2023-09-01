import { IconProps } from "@modules/form/components/icon";
import { ToastColor, ToastProps } from "./toast";
import { setToasts } from "./toast-provider";

let toastId = 0;

export function cookToast(
  title: string,
  args: {
    description?: string;
    color?: ToastColor;
    icon?: IconProps;
    duration?: number;
  } = {},
) {
  const toastProps: ToastProps = {
    ...args,
    title,
    duration: args.duration ?? 2000,
    color: args.color ?? "primary",
    id: toastId++,
  };
  setToasts((prev) => [...prev, toastProps]);
}
