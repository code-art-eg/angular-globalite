import { ValidatorFn } from '@angular/forms';
import { compareValidator } from '../util/compare-validator';

export function lt(otherKey: string | number): ValidatorFn {
	return compareValidator('lt', otherKey, r => r < 0);
}
