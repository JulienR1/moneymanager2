import { A } from "@solidjs/router";
import { Component, For, Match, Show, Switch, ValidComponent } from "solid-js";
import { Dynamic } from "solid-js/web";
import { z } from "zod";
import { Icon } from "./icon";

type Linkify<T extends Record<string, unknown>> = Partial<{
  [K in keyof T]: T[K] extends Record<string, unknown> ? Linkify<T[K]> : string;
}>;

type DetailsProps<T extends Record<string, unknown>> = {
  header?: string[];
  data: T;
  links?: Linkify<T>;
  depth?: number;
};

export const Details = <T extends Record<string, unknown>>(
  props: DetailsProps<T>,
) => {
  return (
    <ul>
      <DetailsHeader header={props.header} />
      <For each={Object.entries(props.data)}>
        {([key, value]) => (
          <DetailsRow
            label={key}
            value={value}
            links={props.links?.[key]}
            depth={props.depth ?? 0}
          />
        )}
      </For>
    </ul>
  );
};

// TODO
const DetailsHeader: Component<{ header?: string[] }> = (props) => {
  return (
    <Show when={(props.header ?? []).length > 0}>
      <li>
        <For each={props.header}>{(heading) => <p>{heading}</p>}</For>
      </li>
    </Show>
  );
};

type DetailsRowProps = {
  label: string;
  value: unknown;
  depth: number;
  links?: Record<string, unknown> | string;
};

const DetailsRow: Component<DetailsRowProps> = (props) => {
  const hasLink = typeof props.links === "string";

  const Inner = () => (
    <div class="grid grid-cols-[125px_auto] rounded px-2 py-1">
      <span class="flex items-center gap-2 font-semibold">
        {props.label}
        <Show when={typeof props.links === "string"}>
          <Icon name="open_in_new" size="sm" />
        </Show>
      </span>
      <div class="relative w-fit after:absolute after:bottom-0 after:left-0 after:block after:h-[2px] after:w-[calc(100%+32px)] after:-translate-x-4 after:bg-primary">
        <Switch fallback={<span>{String(props.value)}</span>}>
          <Match when={typeof props.value === "function"}>
            <Dynamic component={props.value as ValidComponent} />
          </Match>

          <Match
            when={
              z.record(z.string(), z.unknown()).safeParse(props.value).success
            }
          >
            <Details
              data={props.value as Record<string, unknown>}
              links={(props.links as any)?.[props.label]}
              depth={props.depth + 1}
            />
          </Match>
        </Switch>
      </div>
    </div>
  );

  return (
    <li
      class="font-light hocus:bg-gray-100"
      classList={{
        "text-sm": props.depth == 1,
        "text-xs": props.depth > 1,
      }}
    >
      <Show when={hasLink} fallback={<Inner />}>
        <A href={props.links as string} class="hocus:font-medium">
          <Inner />
        </A>
      </Show>
    </li>
  );
};
