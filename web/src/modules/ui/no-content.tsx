import { Component } from "solid-js";

type NoContentProps = {
  message: string;
};

export const NoContent: Component<NoContentProps> = (props) => {
  return <p class="text-xs opacity-75 md:text-sm">{props.message}</p>;
};
