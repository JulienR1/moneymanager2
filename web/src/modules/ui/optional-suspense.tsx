import { children, Component, Show } from "solid-js";
import { Suspense } from "solid-js/web";

type SuspenseProps = Parameters<typeof Suspense>[0];

type OptionalSuspenseProps = SuspenseProps & { disableSuspense?: boolean };

export const OptionalSuspense: Component<OptionalSuspenseProps> = (props) => {
  const c = children(() => props.children);
  return (
    <Show when={props.disableSuspense} fallback={<Suspense {...props} />}>
      {c()}
    </Show>
  );
};
