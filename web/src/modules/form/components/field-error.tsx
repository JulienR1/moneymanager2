import { Component, Index, Show, createRenderEffect, on } from "solid-js";
import { useForm } from "./form";

type Props = { name?: string };

export const FieldError: Component<Props> = (props) => {
  let listRef: HTMLUListElement;

  const { issues } = useForm();

  createRenderEffect(
    on(issues, () => {
      if (listRef) {
        listRef.classList.remove("animate-shake");
        void listRef.offsetWidth; // JavaScript is a beautiful language, tirggering reflow
        listRef.classList.add("animate-shake");
      }
    }),
  );

  return (
    <Show when={props.name && issues()[props.name]}>
      <ul
        ref={(el) => (listRef = el)}
        class={"animate-shake pt-1 text-xs font-semibold text-red-600"}
      >
        <Index each={issues()[props.name!]}>
          {(issue) => <li>{issue()}</li>}
        </Index>
      </ul>
    </Show>
  );
};
