import {
  Accessor,
  JSX,
  createContext,
  createEffect,
  createSignal,
  splitProps,
  useContext,
} from "solid-js";
import z from "zod";
import { getFormData } from "../utils";
import FieldError from "./field-error";

type Props<S extends z.Schema> = Omit<
  JSX.HTMLAttributes<HTMLFormElement>,
  "onSubmit" | "onsubmit"
> & {
  schema: S;
  onSubmit: (data: z.infer<S>) => void;
};

// TODO: change keys for schema keys
type IFormContext = {
  issues: Accessor<Record<string, string[]>>;
  validateForm: () => unknown;
};

const FormContext = createContext<IFormContext>({
  issues: () => ({}),
  validateForm: () => {},
});

export const useForm = () => useContext(FormContext);

const Form = <S extends z.Schema>(props: Props<S>) => {
  const [local, others] = splitProps(props, ["schema"]);
  let formRef: HTMLFormElement;

  const [isDirty, setIsDirty] = createSignal(false);
  const [issues, setIssues] = createSignal<Record<string, string[]>>({});

  createEffect(() => validateForm());

  function validateForm(): ReturnType<S["safeParse"]> {
    const formData = getFormData(formRef);
    const validationResult = local.schema.safeParse(formData) as ReturnType<
      S["safeParse"]
    >;

    const currentIssues: ReturnType<typeof issues> = {};
    if (!validationResult.success) {
      for (const issue of validationResult.error.issues) {
        const key = issue.path[0] ?? "unknown";
        currentIssues[key] ??= [];
        currentIssues[key].push(issue.message);
      }
    }
    setIssues(currentIssues);

    return validationResult;
  }

  function handleSubmit(e: Event) {
    e.preventDefault();
    setIsDirty(true);

    const validationResult = validateForm();
    if (validationResult.success) {
      others.onSubmit(validationResult.data);
      formRef.reset();
      setIsDirty(false);
    }
  }

  const parsedIssues = () => (isDirty() ? issues() : {});

  return (
    <FormContext.Provider value={{ issues: parsedIssues, validateForm }}>
      <form {...others} ref={(el) => (formRef = el)} onSubmit={handleSubmit}>
        {others.children}
        <FieldError name="unknown" />
      </form>
    </FormContext.Provider>
  );
};

export default Form;
