import { Component, Index, Show } from "solid-js";
import { useForm } from "./form";

type Props = { name?: string };

const FieldError: Component<Props> = (props) => {
  const { issues } = useForm();

  return (
    <Show when={props.name && issues()[props.name]}>
      <ul>
        <Index each={issues()[props.name!]}>
          {(issue) => <li>{issue()}</li>}
        </Index>
      </ul>
    </Show>
  );
};

export default FieldError;
