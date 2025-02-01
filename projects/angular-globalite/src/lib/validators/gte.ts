import { ValidatorFn } from '@angular/forms';
import { compareValidator } from '../util/compare-validator';

export function gte(otherKey: string | number): ValidatorFn {
	return compareValidator('gte', otherKey, r => r >= 0);
}
