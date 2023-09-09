import Form from "@modules/form/components/form";
import Input from "@modules/form/components/input";
import { Component, createSignal } from "solid-js";
import { any } from "valibot";
import Accordion from "./accordion";
import Card from "./card";
import Toggle from "./toggle";

type TransactionType = "refund" | "expense";

type NewTransactionProps = {};

const NewTransactionForm: Component<NewTransactionProps> = (props) => {
  const [transactionType, setTransactionType] =
    createSignal<TransactionType>("expense");

  function toggleTransactionType() {
    setTransactionType((t) => (t === "expense" ? "refund" : "expense"));
  }

  return (
    <Form schema={any()} onSubmit={(s) => console.log(s)}>
      <div>
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
          <div>
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

          <div>
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

        <Accordion>dawd</Accordion>
      </div>
    </Form>
  );
};

export default NewTransactionForm;
