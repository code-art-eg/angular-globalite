import { Inject, Injectable } from '@angular/core';
import { LOCALE_PROVIDERS_TOKEN } from '../constants';
import { LocaleProvider } from '../types';
import { LocaleValidatorService } from './locale-validator.service';
import { combineLatest, map, Observable } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { normalizeLocaleName } from '../util/normalize-locale-name';

/*
 * Service that provides the current locale.
 */
@Injectable({
	providedIn: 'root',
})
export class LocaleService {
	readonly locale$: Observable<string>;
	#currentLocale: string;

	constructor(
		@Inject(LOCALE_PROVIDERS_TOKEN)
		private readonly providers: LocaleProvider[],
		private readonly localeValidator: LocaleValidatorService
	) {
		this.locale$ = combineLatest(
			providers.map(provider => provider.locale$)
		).pipe(map(locales => this.#getBestLocale(locales)));

		this.#currentLocale = this.#getBestLocale(
			this.providers.map(provider => provider.locale)
		);
		this.locale$.pipe(takeUntilDestroyed()).subscribe(locale => {
			this.#currentLocale = locale;
		});
	}

	get currentLocale(): string {
		return this.#currentLocale;
	}

	set currentLocale(locale: string) {
		let val = this.localeValidator.getSupportedLocale(locale);
		if (!val) {
			val = this.localeValidator.getDefaultLocale();
		}
		for (const provider of this.providers) {
			if (provider.canWrite) {
				provider.setLocale(val);
			}
		}
	}

	#getBestLocale(locales: (string | null)[]): string {
		for (let i = locales.length - 1; i >= 0; i--) {
			let locale = locales[i];
			if (!locale) {
				continue;
			}
			locale = normalizeLocaleName(locale);
			const supportedLocale =
				this.localeValidator.getSupportedLocale(locale);
			if (supportedLocale) {
				return supportedLocale;
			}
		}
		return this.localeValidator.getDefaultLocale();
	}
}
