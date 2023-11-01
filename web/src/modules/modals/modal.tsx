import { Backdrop, Card, CardProps } from "@ui";
import { Component, JSX, onCleanup, onMount } from "solid-js";
import { useModal } from "./modal-provider";

type ModalProps = {
  visible: boolean;
  onClose: Function;
  header?: Omit<CardProps, "children">;
  children: JSX.Element;
};

export const Modal: Component<ModalProps> = (props) => {
  let removeModal: Function | null = null;
  const registerModal = useModal();

  onMount(() => {
    removeModal = registerModal(() => (
      <>
        <Backdrop visible={props.visible} onClick={props.onClose} />
        <div
          class="mx-auto mt-32 w-fit min-w-[300px] transition-all md:min-w-[400px]"
          classList={{
            "opacity-0": !props.visible,
            "opacity-100 pointer-events-auto": props.visible,
          }}
        >
          <Card {...props.header}>{props.children}</Card>
        </div>
      </>
    ));
  });

  onCleanup(() => removeModal?.());

  return <></>;
};
