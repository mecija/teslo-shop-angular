import { Component, input } from '@angular/core';
import { AbstractControl, ValidationErrors, Validator } from '@angular/forms';
import { FormUtils } from 'src/app/utils/form-utils';

@Component({
  selector: 'app-form-error-label',
  imports: [],
  templateUrl: './form-error-label.component.html',
})
export class FormErrorLabelComponent {
  control = input.required<AbstractControl>();
  get errorMessage() {
    const errors: ValidationErrors = this.control().errors || {};

    return this.control().touched && Object.keys(errors).length > 0
      ? FormUtils.getTextErrors(errors)
      : null;
  }
}
