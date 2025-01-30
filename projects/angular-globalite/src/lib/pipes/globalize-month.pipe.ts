import { Pipe, PipeTransform } from '@angular/core';
import { BaseGlobalizePipe } from './base-globalize-pipe';
import { MonthDisplay } from '../types';
import { getMonthName } from '@code-art-eg/globalite';

@Pipe({
	name: 'gmonth',
	pure: false,
})
export class GlobalizeMonthPipe
	extends BaseGlobalizePipe<number, MonthDisplay>
	implements PipeTransform
{
	protected override transformValue(
		input: number,
		optionsFormat: string,
		locale: string
	): string {
		let format: MonthDisplay = 'long';
		let calendar: 'islamic' | 'gregory' = 'gregory';
		if (optionsFormat === '') {
			format = 'long';
		} else if (optionsFormat === 'M') {
			format = 'narrow';
		} else if (optionsFormat === 'MM') {
			format = 'short';
		} else if (optionsFormat === 'MMM') {
			format = 'short';
		} else if (optionsFormat === 'MMMM') {
			format = 'long';
		} else if (
			optionsFormat === 'long' ||
			optionsFormat === 'short' ||
			optionsFormat === 'narrow'
		) {
			format = optionsFormat;
		} else if (
			optionsFormat === 'long-islamic' ||
			optionsFormat === 'short-islamic' ||
			optionsFormat === 'narrow-islamic'
		) {
			format = optionsFormat.slice(0, optionsFormat.indexOf('-')) as
				| 'long'
				| 'short'
				| 'narrow';
			calendar = 'islamic';
		} else {
			throw new Error(
				`Invalid month format: ${optionsFormat}. Supported formats are 'long', 'short', 'narrow', 'M', 'MM', 'MMM', 'MMMM'.`
			);
		}

		return getMonthName(locale, input, format, calendar);
	}
	protected override getDefaultOptionsOrFormat(): string {
		return 'MMMM';
	}
}
