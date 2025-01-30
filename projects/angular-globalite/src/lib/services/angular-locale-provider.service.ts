import { inject, Injectable, LOCALE_ID } from '@angular/core';
import { LocaleProvider } from '../types';
import { of } from 'rxjs';

/**
 * Service to provide the current locale from Angular's LOCALE_ID.
 * Implements the LocaleProvider interface.
 */
@Injectable({
	providedIn: 'root',
})
export class AngularLocaleProviderService implements LocaleProvider {
	/**
	 * @inheritdoc
	 * @remarks This provider does not support writing.
	 */
	readonly canWrite = false;
	/**
	 * @inheritdoc
	 * @remarks This provider does not support writing.
	 */
	readonly locale: string | null =
		inject(LOCALE_ID, { optional: true }) || null;

	/**
	 * @inheritdoc
	 * @remarks This method is not supported.
	 */
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	setLocale(_: string): void {
		throw new Error('Method not supported.');
	}
	locale$ = of(this.locale);
}
