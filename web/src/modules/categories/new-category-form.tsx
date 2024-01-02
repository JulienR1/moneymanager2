import { Button, ColorInput, Form, Input, Select } from "@modules/form";
import { A, useNavigate } from "@solidjs/router";
import { Skeleton } from "@ui";
import { Component, For, Suspense, createResource } from "solid-js";
import { CategorySchema } from "./schemas";
import { createCategory, findAvailableIcons } from "./service";

type NewCategoryFormProps = {
  closeLocation: string;
  dashboardId: number;
  refreshDashboard: Function;
};

export const NewCategoryForm: Component<NewCategoryFormProps> = (props) => {
  const navigate = useNavigate();
  const [icons] = createResource(findAvailableIcons);

  function closeForm() {
    navigate(props.closeLocation);
  }

  return (
    <Form
      onSubmit={(d) => createCategory(d, props.dashboardId, props.refreshDashboard, closeForm)}
      schema={CategorySchema}
    >
      <Input id="label" name="label" label="Nom" placeholder="Saisir un nom" leftIcon={{ name: "label" }} />
      <ColorInput id="color" name="color" label="Couleur" placeholder="Saisir une couleur (HEX)" />
      <Suspense fallback={<Skeleton type="line" />}>
        <Select id="icon" name="icon" label="Icône" placeholder="Saisir un icône" leftIcon={{ name: "image" }}>
          <For each={icons()}>{(icon) => <option value={icon}>{icon}</option>}</For>
        </Select>
      </Suspense>

      <div class="mt-2 flex items-center justify-between">
        <A href={props.closeLocation} class="ml-2 block w-fit text-sm text-red-500 underline">
          Annuler
        </A>
        <Button type="submit" icon={{ name: "check" }}>
          Confirmer
        </Button>
      </div>
    </Form>
  );
};
