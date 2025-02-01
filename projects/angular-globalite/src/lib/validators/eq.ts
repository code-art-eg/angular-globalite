import { ValidatorFn } from '@angular/forms';
import { compareValidator } from '../util/compare-validator';

export function eq(otherKey: string | number): ValidatorFn {
	return compareValidator('eq', otherKey, r => r === 0);
}
