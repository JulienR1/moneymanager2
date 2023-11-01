import { Component, Match, Switch } from "solid-js";

type SkeletonProps = {
  type: "round";
};

export const Skeleton: Component<SkeletonProps> = (props) => {
  return (
    <div class="h-full w-full animate-pulse">
      <Switch>
        <Match when={props.type === "round"}>
          <div class="aspect-square rounded-full bg-secondary opacity-20" />
        </Match>
      </Switch>
    </div>
  );
};
