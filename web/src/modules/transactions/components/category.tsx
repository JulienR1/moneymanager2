import { CategorySchema } from "@modules/categories/schemas";
import Icon from "@modules/form/components/icon";
import { Component } from "solid-js";

type CategoryProps = CategorySchema;

const Category: Component<CategoryProps> = (props) => {
  return (
    <div class="flex w-[180px] items-center justify-between rounded-md px-3 py-1 shadow-md">
      <Icon name={props.icon} />
      <p
        class="overflow-hidden overflow-ellipsis whitespace-nowrap first-letter:capitalize"
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

export default Category;
