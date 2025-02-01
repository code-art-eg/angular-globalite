import { ValidatorFn } from '@angular/forms';
import { compareValidator } from '../util/compare-validator';

export function neq(otherKey: string | number): ValidatorFn {
	return compareValidator('neq', otherKey, r => r !== 0);
}
