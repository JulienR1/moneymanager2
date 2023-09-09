import { Component, createSignal, onMount } from "solid-js";
import Card, { CardProps } from "./card";

type AccordionProps = Omit<CardProps, "rightIcon"> & {
  initial?: boolean;
};

const Accordion: Component<AccordionProps> = (props) => {
  let containerRef: HTMLDivElement;

  const [opened, setOpened] = createSignal(props.initial ?? true);
  const [containerHeight, setContainerHeight] = createSignal(10000);

  onMount(() => {
    setContainerHeight(containerRef!.offsetHeight ?? 0);
  });

  return (
    <Card
      {...props}
      rightIcon={{
        name: opened() ? "expand_less" : "expand_more",
        onClick: () => setOpened((o) => !o),
      }}
    >
      <div
        ref={(el) => (containerRef = el)}
        style={{ "--h": containerHeight() + "px" }}
        classList={{ "max-h-0": true, "max-h-[var(--h)]": opened() }}
        class="duration-600 overflow-y-hidden px-1 transition-all"
      >
        {props.children}
      </div>
    </Card>
  );
};

export default Accordion;
