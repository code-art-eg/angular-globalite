import { Injectable, Inject } from '@angular/core';
import { SUPPORTED_LOCALES_TOKEN } from '../constants';
import { normalizeLocaleName } from '../util/normalize-locale-name';
import { isParentLocale } from '../util/is-parent-locale';
import { sameParentLocale } from '../util/same-parent-locale';

/**
 * Service to validate and retrieve supported locales.
 * This is used by the LocaleService to ensure that the locale selected is one that is supported.
 */
@Injectable({
	providedIn: 'root',
})
export class LocaleValidatorService {
	/**
	 * Constructs a new instance of LocaleValidatorService.
	 * @throws {Error} If the supportedLocales array is empty.
	 */
	constructor(
		@Inject(SUPPORTED_LOCALES_TOKEN)
		private readonly supportedLocales: string[]
	) {
		if (this.supportedLocales.length === 0) {
			throw new Error(
				'Parameter supportedLocales passed to LocaleValidatorService constructor cannot be empty.'
			);
		}
		this.supportedLocales = this.supportedLocales.map(normalizeLocaleName);
	}

	/**
	 * Retrieves the supported locale that matches or is a parent of the given locale.
	 *
	 * @param {string} locale - The locale string to validate.
	 * @returns {string} - The supported locale string.
	 */
	getSupportedLocale(locale: string): string | null {
		locale = normalizeLocaleName(locale);
		let index = this.supportedLocales.findIndex(v => v === locale);
		if (index < 0) {
			index = this.supportedLocales.findIndex(v =>
				isParentLocale(v, locale)
			);
		}
		if (index < 0) {
			index = this.supportedLocales.findIndex(v =>
				isParentLocale(locale, v)
			);
		}
		if (index < 0) {
			index = this.supportedLocales.findIndex(v =>
				sameParentLocale(locale, v)
			);
		}
		return null;
	}

	getDefaultLocale(): string {
		return this.supportedLocales[0];
	}
}
