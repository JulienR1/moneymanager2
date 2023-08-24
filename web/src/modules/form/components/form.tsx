import {
  Accessor,
  JSX,
  createContext,
  createSignal,
  useContext,
} from "solid-js";
import { BaseSchema, Output, SafeParseResult, safeParse } from "valibot";
import { getFormData } from "../utils";
import FieldError from "./field-error";

type Props<S extends BaseSchema> = Omit<
  JSX.HTMLAttributes<HTMLFormElement>,
  "onSubmit" | "onsubmit"
> & {
  schema: S;
  onSubmit: (data: Output<S>) => void;
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

const Form = <S extends BaseSchema>(props: Props<S>) => {
  let formRef: HTMLFormElement;

  const [isDirty, setIsDirty] = createSignal(false);
  const [issues, setIssues] = createSignal<Record<string, string[]>>({});

  function validateForm(): SafeParseResult<S> {
    const formData = getFormData(formRef);
    const validationResult = safeParse(props.schema, formData);

    const currentIssues: ReturnType<typeof issues> = {};
    if (!validationResult.success) {
      for (const issue of validationResult.issues) {
        const key = issue.path?.at(-1)?.key ?? "unknown";
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
      props.onSubmit(validationResult.output);
    }
  }

  const parsedIssues = () => (isDirty() ? issues() : {});

  return (
    <FormContext.Provider value={{ issues: parsedIssues, validateForm }}>
      <form {...props} ref={(el) => (formRef = el)} onSubmit={handleSubmit}>
        {props.children}
        <FieldError name="unknown" />
      </form>
    </FormContext.Provider>
  );
};

export default Form;
