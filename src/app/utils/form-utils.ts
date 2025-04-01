import {
  AbstractControl,
  FormArray,
  FormGroup,
  ValidationErrors,
} from '@angular/forms';

export class FormUtils {
  static isValidField(myForm: FormGroup, fieldName: string): boolean | null {
    return (
      !!myForm.controls[fieldName].errors && myForm.controls[fieldName].touched
    );
  }

  static getFieldError(myForm: FormGroup, fieldName: string): string | null {
    if (!myForm.controls[fieldName]) return null;

    const errors = myForm.controls[fieldName].errors ?? {};

    return FormUtils.getTextErrors(errors);
  }
  static getFieldErrorInArray(myForm: FormArray, index: number): string | null {
    if (myForm.controls.length == 0) return null;

    const errors = myForm.controls[index].errors ?? {};
    return FormUtils.getTextErrors(errors);
  }

  static getTextErrors(errors: ValidationErrors) {
    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return 'Este campo es requerido';
        case 'minlength':
          return `Minimo de ${errors['minlength'].requiredLength} caracteres`;
        case 'pattern':
          if (errors['pattern'].requiredPattern == FormUtils.emailPattern)
            return 'El valor introduciodo no es un email';

          return 'El valor introducido no coincide con el patron';
        case 'min':
          return `Minimo de ${errors['min'].min}`;
        case 'email':
          return 'El valor introducido no es un email';
        case 'emailTaken':
          return 'El ya esta en uso';
        case 'usernameTaken':
          return 'El ya nombre esta en uso';
        default:
          return `Error no controlado: ${key}`;
      }
    }
    return null;
  }

  static isValidFieldInArray(formarray: FormArray, index: number) {
    return (
      formarray.controls[index].errors && formarray.controls[index].touched
    );
  }

  static isField1EqualToField2(one: string, two: string) {
    return (formGroup: AbstractControl) => {
      const field1 = formGroup.get(one)?.value;
      const field2 = formGroup.get(two)?.value;
      return field1 == field2 ? null : { passwordsNotEqual: true };
    };
  }

  static namePattern = '([a-zA-Z]+) ([a-zA-Z]+)';
  static emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
  static notOnlySpacesPattern = '^[a-zA-Z0-9]+$';
  static slugPattern = '^[a-z0-9_]+(?:-[a-z0-9_]+)*$';

  static checkingUsername(controler: AbstractControl): ValidationErrors | null {
    if (controler.value == 'strider') {
      return {
        usernameTaken: true,
      };
    }
    return null;
  }

  static async checkingResponse(
    control: AbstractControl
  ): Promise<ValidationErrors | null> {
    await sleep();

    const formValue = control.value;

    if (formValue == 'hola@mundo.com') {
      return {
        emailTaken: true,
      };
    }

    return null;
  }
}

async function sleep() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 2400);
  });
}
