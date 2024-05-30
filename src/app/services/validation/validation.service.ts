import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class ValidationService {
  constructor() {}

  public getErrorMessage(controlName: string, form: FormGroup): string {
    const control = form.get(controlName);
    if (control?.hasError('email')) {
      return 'Invalid email';
    }
    if (control?.hasError('maxLength')) {
      return 'Maximum of 16 characters.';
    }
    if (control?.hasError('minlength')) {
      return 'At least 8 characters';
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
