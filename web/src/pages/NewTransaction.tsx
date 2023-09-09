import NewTransactionForm from "@modules/transactions/new-transaction-form";
import { useParams } from "@solidjs/router";
import { Component } from "solid-js";

type NewTransactionProps = {};

const NewTransaction: Component<NewTransactionProps> = (props) => {
  const params = useParams<{ team: "me" | (string & {}) }>();

  return (
    <>
      <NewTransactionForm />
    </>
  );
};

export default NewTransaction;
