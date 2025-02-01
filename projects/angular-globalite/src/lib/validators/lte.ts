import { ValidatorFn } from '@angular/forms';
import { compareValidator } from '../util/compare-validator';

export function lte(otherKey: string | number): ValidatorFn {
	return compareValidator('lte', otherKey, r => r <= 0);
}
