import { AbstractControl, ControlContainer } from '@angular/forms';

export function forbiddenPasswordValidator(
  control: AbstractControl
): { [key: string]: any } | null {
  const forbidden = /passwordtrue/.test(control.value);
  return forbidden ? { forbiddenName: { value: control.value } } : null;
}
