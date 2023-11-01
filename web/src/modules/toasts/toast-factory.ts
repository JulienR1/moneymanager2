import { IconProps } from "@ui";
import { ToastColor, ToastProps } from "./toast";
import { setToasts } from "./toast-provider";

let toastId = 0;

export function cookToast(
  title: string,
  args: {
    description?: string;
    duration?: number;
  } = {},
) {
  const toastProps: Omit<ToastProps, "icon" | "color"> = {
    ...args,
    title,
    duration: args.duration ?? 4000,
    id: toastId++,
  };

  const pushToast = (toast: ToastProps) =>
    setToasts((prev) => [...prev, toast]);

  return {
    burnt: () =>
      pushToast({
        ...toastProps,
        color: "red",
        icon: { name: "warning" },
      }),
    dry: () =>
      pushToast({
        ...toastProps,
        color: "yellow",
        icon: { name: "help" },
      }),
    golden: () =>
      pushToast({
        ...toastProps,
        color: "primary",
        icon: { name: "check_circle" },
      }),
    skip: (details: { color?: ToastColor; icon?: IconProps }) =>
      pushToast({
        ...toastProps,
        color: details.color ?? "primary",
        icon: details.icon,
      }),
  };
}
