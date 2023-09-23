import { Component, createSignal, onCleanup, onMount } from "solid-js";
import Card, { CardProps } from "./card";

type AccordionProps = Omit<CardProps, "rightIcon"> & {
  initial?: boolean;
};

const Accordion: Component<AccordionProps> = (props) => {
  let containerRef: HTMLDivElement;

  const [opened, setOpened] = createSignal(props.initial ?? true);
  const [containerHeight, setContainerHeight] = createSignal(10000);

  const observer = new ResizeObserver((entries) => {
    for (const entry of entries) {
      setContainerHeight(entry.contentRect.height);
    }
  });

  onMount(() => observer.observe(containerRef));
  onCleanup(() => observer.unobserve(containerRef));

  return (
    <Card
      {...props}
      rightIcon={{
        name: opened() ? "expand_less" : "expand_more",
        onClick: () => setOpened((o) => !o),
      }}
    >
      <div
        style={{ "--h": containerHeight() + "px" }}
        classList={{ "max-h-0": true, "max-h-[var(--h)]": opened() }}
        class="duration-600 overflow-y-hidden px-1 transition-all"
      >
        <div ref={(el) => (containerRef = el)}>{props.children}</div>
      </div>
    </Card>
  );
};

export default Accordion;
