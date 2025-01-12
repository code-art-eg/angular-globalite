import { Pipe, PipeTransform } from '@angular/core';
import { BaseNumberPipe } from './base-number-pipe';

@Pipe({
	name: 'gnumber',
})
export class GlobalizeNumberPipe
	extends BaseNumberPipe
	implements PipeTransform
{
	protected override getDefaultOptionsOrFormat():
		| string
		| Intl.NumberFormatOptions {
		return 'n';
	}
}
