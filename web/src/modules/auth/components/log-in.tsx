import { Button, Form, Input, PasswordInput } from "@modules/form";
import { useNavigate } from "@solidjs/router";
import { LogInSchema } from "../schemas";
import { login } from "../service";

export const LogInForm = () => {
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
