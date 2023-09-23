import { Dashboard } from "@/resources/schema";
import Form from "@modules/form/components/form";
import Icon from "@modules/form/components/icon";
import Input from "@modules/form/components/input";

import { A, useLocation } from "@solidjs/router";
import { Accessor, Component, Index, Show, createSignal } from "solid-js";
import { any } from "valibot";
import Accordion from "./accordion";
import Card from "./card";
import Toggle from "./toggle";

type TransactionType = "refund" | "expense";

type NewTransactionProps = {
  dashboard: Accessor<Dashboard>;
};

const NewTransactionForm: Component<NewTransactionProps> = (props) => {
  const location = useLocation();

  const [transactionType, setTransactionType] =
    createSignal<TransactionType>("expense");

  function toggleTransactionType() {
    setTransactionType((t) => (t === "expense" ? "refund" : "expense"));
  }

  return (
    <Form schema={any()} onSubmit={(s) => console.log(s)}>
      <div class="mx-auto max-w-lg md:max-w-2xl">
        <Card>
          <div class="mx-auto grid w-fit grid-cols-3 items-center justify-center gap-2">
            <div class="ml-auto">
              <p
                class="duration-250 after:duration-250 w-fit transition-all after:block after:h-1 after:w-full after:max-w-0 after:rounded-sm after:bg-primary after:transition-all"
                classList={{
                  "after:max-w-[200px]": transactionType() === "expense",
                }}
              >
                Dépense
              </p>
            </div>
            <Toggle onToggle={toggleTransactionType} class="mx-auto" />
            <div>
              <p
                class="duration-250 after:duration-250 w-fit transition-all after:block after:h-1 after:w-full after:max-w-0 after:rounded-sm after:bg-primary after:transition-all"
                classList={{
                  "after:max-w-[200px]": transactionType() === "refund",
                }}
              >
                Remboursement
              </p>
            </div>
          </div>
        </Card>

        <Accordion
          title="Informations générales"
          leftIcon={{ name: "settings" }}
        >
          <div class="grid grid-cols-[auto_180px] gap-3">
            <Input
              label="Description"
              name="description"
              placeholder="Saisir une description"
              leftIcon={{ name: "signature" }}
            />
            <Input
              label="Montant"
              name="amount"
              placeholder="Saisir le montant"
              type="number"
              leftIcon={{ name: "payments" }}
            />
          </div>

          <div class="grid grid-cols-[auto_180px] gap-3">
            <Input
              label="Facture"
              name="receipt"
              placeholder="Téléverser une preuve"
              type="file"
              accept="application/pdf,image/png,image/jpg,image/jpeg"
              leftIcon={{ name: "history_edu" }}
              capture
            />
            <Input
              label="Date"
              name="date"
              type="date"
              leftIcon={{ name: "today" }}
            />
          </div>
        </Accordion>

        <Accordion title="Catégories" leftIcon={{ name: "category" }}>
          <Show
            when={props.dashboard().categories.length > 0}
            fallback={
              <p class="opacity-70">
                Aucune catégorie n'est associée au tableau de bord.
              </p>
            }
          >
            <ul>
              <Index each={props.dashboard().categories}>
                {(category) => <li>{category().label}</li>}
              </Index>
            </ul>
          </Show>

          <div>
            <A
              href={location.pathname.replace(/\/$/, "") + "/category"}
              class="group ml-auto mt-2 flex w-fit items-center rounded-2xl bg-gradient-to-tr from-primary to-secondary px-5 py-1 text-sm text-white hover:shadow-md"
            >
              <span class="font-semibold">Ajouter</span>
              <Icon
                name="add"
                class="pl-2 transition-transform group-hover:translate-x-2"
              />
            </A>
          </div>
        </Accordion>
      </div>
    </Form>
  );
};

export default NewTransactionForm;
