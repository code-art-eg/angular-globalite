import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { STORAGE_LOCALE_CONFIG_TOKEN } from '../constants';
import { LocaleProvider, StorageLocaleConfig } from '../types';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class StorageLocaleProviderService implements LocaleProvider {
	readonly #locale$: BehaviorSubject<string | null>;
	readonly #storageListener = this.#onStorageChange.bind(this);
	readonly locale$: Observable<string | null>;
	readonly canWrite = true;

	constructor(
		@Inject(DOCUMENT) private readonly document: Document,
		@Inject(STORAGE_LOCALE_CONFIG_TOKEN)
		private readonly config: StorageLocaleConfig
	) {
		this.#locale$ = new BehaviorSubject(this.#getStorageLocale());
		if (this.#window) {
			this.#window.addEventListener('storage', this.#storageListener);
		}
		this.locale$ = this.#locale$.asObservable();
	}

	get #window(): Window | null {
		return this.document.defaultView ?? null;
	}

	get #storage(): Storage | null {
		if (!this.#window) {
			return null;
		}
		return this.config.useSessionStorage
			? this.#window.sessionStorage
			: this.#window.localStorage;
	}

	get locale(): string | null {
		return this.#locale$.value;
	}

	setLocale(value: string | null) {
		if (!this.#storage) {
			return;
		}
		if (value) {
			this.#storage.setItem(this.config.key, value);
		} else {
			this.#storage.removeItem(this.config.key);
		}

		this.#window!.dispatchEvent(
			new StorageEvent('storage', {
				key: this.config.key,
				newValue: value,
			})
		);
	}

	/**
	 * Gets the locale value from storage.
	 * @private
	 */
	#getStorageLocale(): string | null {
		if (!this.#storage) {
			return null;
		}
		return this.#storage.getItem(this.config.key) ?? null;
	}

	/**
	 * Handles the storage event to update the locale.
	 * @private
	 * @param {StorageEvent} event - The storage event.
	 */
	#onStorageChange(event: StorageEvent) {
		if (event.key === this.config.key) {
			const locale = event.newValue;
			if (locale !== this.#locale$.value) {
				this.#locale$.next(locale);
			}
		}
	}
}
