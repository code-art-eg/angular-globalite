import { Pipe, PipeTransform } from '@angular/core';
import { BaseGlobalizePipe } from './base-globalize-pipe';
import { getCountryName } from '@code-art-eg/globalite';

@Pipe({
	name: 'gcountry',
	pure: false,
})
export class GlobalizeCountryPipe
	extends BaseGlobalizePipe<string, never>
	implements PipeTransform
{
	protected override transformValue(
		input: string,
		_: string,
		locale: string
	): string {
		return getCountryName(locale, input);
	}

	protected override getDefaultOptionsOrFormat(): string {
		return '';
	}
}
