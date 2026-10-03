// After a failed submit, move focus to the first field with an error.
export function focusFirstInvalid(form: HTMLFormElement) {
  requestAnimationFrame(() =>
    form.querySelector<HTMLInputElement>("[aria-invalid=true]")?.focus(),
  );
}
