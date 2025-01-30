import { Pipe, PipeTransform } from '@angular/core';
import { BaseGlobalizePipe } from './base-globalize-pipe';
import { getLanguageName } from '@code-art-eg/globalite';

@Pipe({
	name: 'glanguage',
	pure: false,
})
export class GlobalizeLanguagePipe
	extends BaseGlobalizePipe<string, never>
	implements PipeTransform
{
	protected override transformValue(
		input: string,
		_: string,
		locale: string
	): string {
		return getLanguageName(locale, input);
	}

	protected override getDefaultOptionsOrFormat(): string {
		return '';
	}
}
