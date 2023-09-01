import { For } from "solid-js";
import { createStore } from "solid-js/store";
import { Portal } from "solid-js/web";
import Toast, { ToastProps } from "./toast";

const toastContainer = document.getElementById("toasts")!;

const [toasts, setToasts] = createStore<ToastProps[]>([]);

const ToastProvider = () => {
  function handleToastClose(toastId: number) {
    setToasts(() => toasts.filter((t) => t.id !== toastId));
  }

  return (
    <Portal mount={toastContainer}>
      <div class="pointer-events-none fixed right-0 top-0">
        <ul class="p-3">
          <For each={toasts}>
            {(toast) => (
              <li class="h-fit">
                <Toast {...toast} onClose={handleToastClose} />
              </li>
            )}
          </For>
        </ul>
      </div>
    </Portal>
  );
};

export default ToastProvider;
export { setToasts };
