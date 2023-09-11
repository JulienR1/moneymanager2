import Button from "@modules/form/components/button";
import Form from "@modules/form/components/form";
import Input from "@modules/form/components/input";
import PasswordInput from "@modules/form/components/password-input";

import { useNavigate } from "@solidjs/router";
import { createSignal } from "solid-js";
import { makeRegisterSchema } from "../schemas";
import { register } from "../service";

const RegisterForm = () => {
  const navigate = useNavigate();
  const [password, setPassword] = createSignal("");
  const validationSchema = () => makeRegisterSchema(password());

  return (
    <Form schema={validationSchema()} onSubmit={(d) => register(d, navigate)}>
      <Input
        id="firstname"
        name="firstname"
        label="Prénom"
        placeholder="Saisir votre prénom"
      />
      <Input
        id="lastname"
        name="lastname"
        label="Nom de famille"
        placeholder="Saisir votre nom de famille"
      />
      <Input
        id="email"
        name="email"
        label="Courriel"
        placeholder="Saisir votre adresse courriel"
        leftIcon={{ name: "mail" }}
      />
      <PasswordInput
        id="password"
        name="password"
        type="password"
        label="Mot de passe"
        placeholder="Saisir votre mot de passe"
        onInput={(e) => setPassword(e.currentTarget.value)}
      />
      <PasswordInput
        id="passwordConfirmation"
        name="passwordConfirmation"
        type="password"
        label="Confirmation"
        placeholder="Confirmer votre mot de passe"
      />

      <Button icon={{ name: "arrow_forward" }} class="ml-auto mt-6">
        <p class="font-semibold">Créer un compte</p>
      </Button>
    </Form>
  );
};

export default RegisterForm;
