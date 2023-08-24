export const getFormData = <T extends Record<string, unknown>>(
  form: HTMLFormElement,
): T => {
  const formData: Record<string, FormDataEntryValue> = {};
  new FormData(form).forEach((value, key) => (formData[key] = value));
  return formData as T;
};
