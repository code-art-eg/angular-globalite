import { AbstractControl, ValidationErrors } from '@angular/forms';
import { isEmptyValue } from '../util/is-empty-value';

const emailRx = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;

/**
 * Validator that requires the control value to be a valid email address.
 * @Remarks This validator uses a regular expression similar to that of .NET
 * to check if the control value is a valid email address. This is used rather than Angular's built-in email validator
 * to have consistent validation across between Angular (browser) and .NET (server).
 * @returns An error object with the `email` property if the validation check fails, otherwise `null`.
 */
export function email(control: AbstractControl): ValidationErrors | null {
	if (isEmptyValue(control.value)) {
		return null;
	}
	return emailRx.test(control.value) ? null : { email: true };
}
