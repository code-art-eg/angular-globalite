import { Inject, Injectable } from '@angular/core';
import { COOKIE_LOCALE_CONFIG_TOKEN } from '../constants';
import { CookieLocaleConfig, LocaleProvider } from '../types';
import { DOCUMENT } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { createCookie } from '../util/create-cookie';
import { readCookie } from '../util/read-cookie';

/*
 * Service to manage locale storage in cookies.
 */
@Injectable({
	providedIn: 'root',
})
export class CookieLocaleProviderService implements LocaleProvider {
	readonly canWrite = true;
	readonly #locale$: BehaviorSubject<string | null>;
	readonly locale$: Observable<string | null>;

	constructor(
		@Inject(COOKIE_LOCALE_CONFIG_TOKEN)
		private readonly config: CookieLocaleConfig,
		@Inject(DOCUMENT) private readonly document: Document
	) {
		this.#locale$ = new BehaviorSubject<string | null>(this.locale);
		this.locale$ = this.#locale$.asObservable();
	}

	setLocale(locale: string | null): void {
		createCookie(
			this.document,
			this.config.cookieName,
			locale,
			this.config.cookieExpiresMinutes,
			this.config.cookiePath
		);
		this.#locale$.next(locale);
	}

	get locale(): string | null {
		return readCookie(this.document, this.config.cookieName);
	}
}
