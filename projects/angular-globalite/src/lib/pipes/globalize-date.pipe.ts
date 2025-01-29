import { Pipe, PipeTransform } from '@angular/core';
import { BaseDatePipe } from './base-date-pipe';

@Pipe({
	name: 'gdate',
	pure: false,
})
export class GlobalizeDatePipe extends BaseDatePipe implements PipeTransform {
	protected override getDefaultOptionsOrFormat():
		| string
		| Intl.DateTimeFormatOptions {
		return 'd';
	}
}
