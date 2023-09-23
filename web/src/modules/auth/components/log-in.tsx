import Button from "@modules/form/components/button";
import Form from "@modules/form/components/form";
import Input from "@modules/form/components/input";
import PasswordInput from "@modules/form/components/password-input";

import { useNavigate } from "@solidjs/router";
import { LogInSchema } from "../schemas";
import { login } from "../service";

const LogInForm = () => {
  const navigate = useNavigate();

  return (
    <Form schema={LogInSchema} onSubmit={(d) => login(d, navigate)}>
      <Input
        id="email"
        name="email"
        label="Identifiant"
        placeholder="Saisir son identifiant"
        leftIcon={{ name: "mail" }}
      />

      <PasswordInput
        id="password"
        name="password"
        label="Mot de passe"
        placeholder="Saisir son mot de passe"
      />

      <Button icon={{ name: "arrow_forward" }} class="ml-auto mt-6">
        <p class="font-semibold">Connexion</p>
      </Button>
    </Form>
  );
};

export default LogInForm;
