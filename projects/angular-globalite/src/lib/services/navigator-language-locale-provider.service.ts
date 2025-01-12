import { inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { LocaleProvider } from '../types';
import { of } from 'rxjs';

/**
 * Locale provider service that uses the navigator language to provide the locale.
 */
@Injectable({
	providedIn: 'root',
})
export class NavigatorLanguageLocaleProviderService implements LocaleProvider {
	readonly #document: Document = inject(DOCUMENT);
	readonly locale: string | null =
		this.#document.defaultView?.navigator.language ?? 'null';
	readonly canWrite = false;
	readonly locale$ = of(this.locale);
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	setLocale(_: string | null) {
		throw new Error('Method not supported.');
	}
}
