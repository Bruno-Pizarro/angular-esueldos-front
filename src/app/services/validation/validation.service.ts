import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class ValidationService {
  constructor() {}

  public getErrorMessage(controlName: string, form: FormGroup): string {
    const control = form.get(controlName);
    if (control?.hasError('invalidImageType')) {
      return 'File must be an image';
    }
    if (control?.hasError('email')) {
      return 'Invalid email';
    }
    if (control?.hasError('maxlength')) {
      const requiredLength = control.errors?.['maxlength']?.requiredLength;
      return `Maximum of ${requiredLength} characters`;
    }
    if (control?.hasError('minlength')) {
      const requiredLength = control.errors?.['minlength']?.requiredLength;
      return `At least ${requiredLength} characters`;
    }
    if (control?.hasError('max')) {
      const maxValue = control.errors?.['max']?.max;
      return `Maximum of ${maxValue}`;
    }
    if (control?.hasError('min')) {
      const minValue = control.errors?.['min']?.min;
      return `Minimum of ${minValue}`;
    }
    if (control?.hasError('pattern')) {
      return 'Password must contain at least one letter and one number';
    }
    if (control?.hasError('notSame')) {
      return 'Passwords do not match';
    }
    return '';
  }
}
