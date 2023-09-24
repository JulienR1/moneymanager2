import { Component, createSignal, onCleanup, onMount } from "solid-js";
import Card, { CardProps } from "./card";

type AccordionProps = Omit<CardProps, "rightIcon"> & {
  initial?: boolean;
  controls?: ReturnType<typeof useAccordion>;
};

export const useAccordion = (initial?: boolean) => {
  const [isOpened, setIsOpened] = createSignal(initial ?? true);
  const toggle = () => setIsOpened((o) => !o);
  return { isOpened, setIsOpened, toggle };
};

const Accordion: Component<AccordionProps> = (props) => {
  let containerRef: HTMLDivElement;

  const accordion = props.controls ?? useAccordion(props.initial);
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
        name: accordion.isOpened() ? "expand_less" : "expand_more",
        onClick: accordion.toggle,
      }}
    >
      <div
        style={{ "--h": containerHeight() + "px" }}
        classList={{
          "max-h-0": true,
          "max-h-[var(--h)]": accordion.isOpened(),
        }}
        class="duration-600 overflow-y-hidden px-1 transition-all"
      >
        <div ref={(el) => (containerRef = el)}>{props.children}</div>
      </div>
    </Card>
  );
};

export default Accordion;
