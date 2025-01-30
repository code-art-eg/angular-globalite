import { Pipe, PipeTransform } from '@angular/core';
import { BaseGlobalizePipe } from './base-globalize-pipe';
import { BooleanFormatter, booleanFormatter } from '@code-art-eg/globalite';

@Pipe({
	name: 'gbool',
	pure: false,
})
export class GlobalizeBooleanPipe
	extends BaseGlobalizePipe<boolean, never>
	implements PipeTransform
{
	#booleanFormatter?: BooleanFormatter;
	#locale?: string;

	protected override transformValue(
		input: boolean,
		_: string,
		locale: string
	): string {
		if (!this.#booleanFormatter || this.#locale !== locale) {
			this.#booleanFormatter = booleanFormatter(locale);
			this.#locale = locale;
		}

		return this.#booleanFormatter(input);
	}

	protected override getDefaultOptionsOrFormat(): string {
		return '';
	}
}
