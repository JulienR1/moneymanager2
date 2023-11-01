import { CategorySchema } from "@modules/categories/schemas";
import { Icon } from "@ui";
import { Component } from "solid-js";

type CategoryProps = CategorySchema;

export const Category: Component<CategoryProps> = (props) => {
  return (
    <div class="flex w-[120px] items-center justify-between rounded-md px-3 py-1 shadow-md md:w-[180px]">
      <Icon name={props.icon} size="lg" mdSize="xl" />
      <p
        class="overflow-hidden overflow-ellipsis whitespace-nowrap text-sm first-letter:capitalize md:text-base"
        style={{ width: "calc(100% - 36px)" }}
      >
        {props.label}
      </p>
      <div
        style={{ "background-color": props.color.padStart(7, "#") }}
        class="h-3 w-3 rounded-full"
      ></div>
    </div>
  );
};
