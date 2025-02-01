import { ValidatorFn } from '@angular/forms';
import { compareValidator } from '../util/compare-validator';

export function gt(otherKey: string | number): ValidatorFn {
	return compareValidator('gt', otherKey, r => r > 0);
}
