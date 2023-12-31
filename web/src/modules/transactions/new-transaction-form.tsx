import { Dashboard } from "@/resources/schema";
import {
  Button,
  FieldError,
  Form,
  Input,
  Toggle,
  useForm,
} from "@modules/form";
import { A, useLocation, useNavigate } from "@solidjs/router";
import { Accordion, Card, Icon, useAccordion } from "@ui";
import {
  Accessor,
  Component,
  Index,
  Show,
  createEffect,
  createSignal,
  createUniqueId,
  onMount,
} from "solid-js";
import { Category } from "./components/category";
import { NewTransactionSchema } from "./schema";
import { createTransaction } from "./service";

type TransactionType = "income" | "expense";

type NewTransactionProps = {
  closeEndpoint: string;
  dashboard: Accessor<Dashboard>;
};

const FormWrapper: Component<NewTransactionProps> = (props) => {
  const navigate = useNavigate();

  return (
    <Form
      schema={NewTransactionSchema}
      onSubmit={(d) =>
        createTransaction(d, props.dashboard().id, () =>
          navigate(props.closeEndpoint),
        )
      }
    >
      <NewTransactionForm {...props} />
    </Form>
  );
};

const NewTransactionForm: Component<NewTransactionProps> = (props) => {
  const { issues } = useForm();
  const location = useLocation();

  const [transactionType, setTransactionType] =
    createSignal<TransactionType>("expense");

  function toggleTransactionType() {
    setTransactionType((t) => (t === "expense" ? "income" : "expense"));
  }

  const generalAccordion = useAccordion(false);
  const categoriesAccordion = useAccordion(false);

  createEffect(() => {
    const generalInfoFields = ["description", "amount", "receipt", "date"];
    const keys = Object.keys(issues());

    if (keys.some((k) => generalInfoFields.includes(k))) {
      generalAccordion.setIsOpened(true);
    }

    if (keys.includes("category")) {
      categoriesAccordion.setIsOpened(true);
    }
  });

  onMount(() => {
    setTimeout(() => generalAccordion.setIsOpened(true), 250);
  });

  return (
    <div class="mx-auto max-w-lg md:max-w-2xl">
      <Card>
        <div class="mx-auto grid w-fit grid-cols-3 items-center justify-center gap-2">
          <div class="ml-auto">
            <p
              class="duration-250 after:duration-250 w-fit text-sm transition-all after:block after:h-1 after:w-full after:max-w-0 after:rounded-sm after:bg-primary after:transition-all md:text-base"
              classList={{
                "after:max-w-[200px]": transactionType() === "expense",
              }}
            >
              Dépense
            </p>
          </div>
          <Toggle
            class="mx-auto"
            name="isIncome"
            id="expense-toggle"
            onToggle={toggleTransactionType}
          />
          <div>
            <p
              class="duration-250 after:duration-250 w-fit text-sm transition-all after:block after:h-1 after:w-full after:max-w-0 after:rounded-sm after:bg-primary after:transition-all md:text-base"
              classList={{
                "after:max-w-[200px]": transactionType() === "income",
              }}
            >
              Revenu
            </p>
          </div>
        </div>
      </Card>

      <Accordion
        title="Informations générales"
        leftIcon={{ name: "settings" }}
        controls={generalAccordion}
      >
        <div class="grid grid-cols-[auto_150px] gap-3 md:grid-cols-[auto_180px]">
          <Input
            id="description"
            label="Titre"
            name="description"
            placeholder="Saisir un titre"
            leftIcon={{ name: "signature" }}
          />
          <Input
            id="amount"
            label="Montant"
            name="amount"
            placeholder="Saisir le montant"
            type="number"
            step="0.01"
            leftIcon={{ name: "payments" }}
            onChange={() => categoriesAccordion.setIsOpened(true)}
          />
        </div>

        <div class="grid grid-cols-[auto_150px] gap-3 md:grid-cols-[auto_180px]">
          <Input
            id="receipt"
            label="Facture"
            name="receipt"
            placeholder="Téléverser une preuve"
            type="file"
            accept="application/pdf,image/png,image/jpg,image/jpeg"
            leftIcon={{ name: "history_edu" }}
            capture
          />
          <Input
            id="date"
            label="Date"
            name="date"
            type="date"
            leftIcon={{ name: "today" }}
            value={new Date().toLocaleDateString("fr-CA")}
          />
        </div>
      </Accordion>

      <Accordion
        title="Catégories"
        leftIcon={{ name: "category" }}
        controls={categoriesAccordion}
      >
        <Show
          when={props.dashboard().categories.length > 0}
          fallback={
            <p class="opacity-70">
              Aucune catégorie n'est associée au tableau de bord.
            </p>
          }
        >
          <ul class="flex flex-wrap justify-center gap-x-4 gap-y-2">
            <Index each={props.dashboard().categories}>
              {(category) => {
                const { validateForm } = useForm();
                const id = `category-selector-${createUniqueId()}`;

                return (
                  <li>
                    <input
                      id={id}
                      type="radio"
                      name="category"
                      value={category().id}
                      onChange={() => {
                        validateForm();
                        generalAccordion.setIsOpened(false);
                      }}
                      class="invisible absolute h-0 [&:checked+label]:translate-x-2 [&:checked+label]:border-l-4 [&:checked+label]:opacity-100"
                    />
                    <label
                      for={id}
                      class="block cursor-pointer rounded-md border-solid border-primary opacity-40 transition-all duration-100 hocus:translate-x-2"
                    >
                      <Category {...category()} />
                    </label>
                  </li>
                );
              }}
            </Index>
          </ul>
          <FieldError name="category" />
        </Show>

        <div class="pt-2">
          <A
            href={location.pathname.replace(/\/$/, "") + "/category"}
            class="group ml-auto mt-2 flex w-fit items-center rounded-2xl bg-gradient-to-tr from-primary to-secondary px-3 py-1 text-xs text-white hover:shadow-md md:px-5 md:text-sm"
          >
            <span class="font-semibold">Ajouter</span>
            <Icon
              name="add"
              class="pl-2 transition-transform group-hover:translate-x-2"
            />
          </A>
        </div>
      </Accordion>

      <Card>
        <div class="flex items-center justify-evenly">
          <A
            href={props.closeEndpoint}
            class="ml-2 block w-fit text-sm text-red-500 underline"
          >
            Annuler
          </A>
          <Button type="submit" icon={{ name: "contract_edit" }}>
            <span class="font-semibold">Enregistrer</span>
          </Button>
        </div>
      </Card>
    </div>
  );
};

export { FormWrapper as NewTransactionForm };
