import Button from "@modules/form/components/button";
import ColorInput from "@modules/form/components/color-input";
import Form from "@modules/form/components/form";
import Input from "@modules/form/components/input";

import { A, useNavigate } from "@solidjs/router";
import { Component } from "solid-js";
import { CategorySchema } from "./schemas";
import { createCategory } from "./service";

type NewCategoryFormProps = {
  closeLocation: string;
  dashboardId: number;
  refreshDashboard: Function;
};

const NewCategoryForm: Component<NewCategoryFormProps> = (props) => {
  const navigate = useNavigate();

  function closeForm() {
    navigate(props.closeLocation);
  }

  return (
    <Form
      onSubmit={(d) =>
        createCategory(d, props.dashboardId, props.refreshDashboard, closeForm)
      }
      schema={CategorySchema}
    >
      <Input
        id="label"
        name="label"
        label="Nom"
        placeholder="Saisir un nom"
        leftIcon={{ name: "label" }}
      />
      <ColorInput
        id="color"
        name="color"
        label="Couleur"
        placeholder="Saisir une couleur (HEX)"
      />
      <Input
        id="icon"
        name="icon"
        label="Icône"
        placeholder="Saisir un icône"
        leftIcon={{ name: "image" }}
      />

      <div class="mt-2 flex items-center justify-between">
        <A
          href={props.closeLocation}
          class="ml-2 block w-fit text-sm text-red-500 underline"
        >
          Annuler
        </A>
        <Button type="submit" icon={{ name: "check" }}>
          Confirmer
        </Button>
      </div>
    </Form>
  );
};

export default NewCategoryForm;
