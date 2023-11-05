import { A, AnchorProps } from "@solidjs/router";
import {
  Accessor,
  Component,
  For,
  JSX,
  Match,
  Switch,
  createContext,
  useContext,
} from "solid-js";

type TableProps = {
  header: string[];
  widths?: string[];
  children: JSX.Element;
};

type TableRowProps = {
  index?: Accessor<number>;
  anchor?: AnchorProps;
  children: JSX.Element;
};

const TableContext = createContext<Record<string, string>>({});

export const Table: Component<TableProps> = (props) => {
  const columns = props.widths ?? [];
  const style = { display: "grid", "grid-template-columns": columns.join(" ") };

  return (
    <div>
      <div
        style={style}
        class="relative mb-3 pb-2 after:absolute after:bottom-0 after:left-1/2 after:block after:h-[2px] after:w-11/12 after:-translate-x-1/2 after:rounded-sm after:bg-primary after:opacity-40"
      >
        <For each={props.header}>
          {(header) => (
            <p class="text-center text-xs font-semibold md:text-sm">{header}</p>
          )}
        </For>
      </div>
      <TableContext.Provider value={style}>
        <ul>{props.children}</ul>
      </TableContext.Provider>
    </div>
  );
};

export const TableRow: Component<TableRowProps> = (props) => {
  const style = useContext(TableContext);

  const Inner = () => {
    const highlight = (props.index?.() ?? 0) % 2 === 1;

    return (
      <>
        <div
          class="absolute top-0 block h-full w-full rounded opacity-20 group-hocus:hidden"
          classList={{ "bg-secondary": highlight }}
        />
        <div style={style} class="text-center text-xs md:text-sm">
          {props.children}
        </div>
      </>
    );
  };

  return (
    <li>
      <Switch>
        <Match when={!!props.anchor}>
          <A {...props.anchor!} class="group relative block">
            <div class="absolute top-0 hidden h-full w-full rounded bg-primary-dark opacity-40 group-hocus:block" />
            <Inner />
          </A>
        </Match>
        <Match when={!props.anchor}>
          <Inner />
        </Match>
      </Switch>
    </li>
  );
};
