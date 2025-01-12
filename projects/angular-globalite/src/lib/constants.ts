import { inject, InjectionToken } from '@angular/core';
import { StorageLocaleProviderService } from './services/storage-locale-provider.service';
import {
	CookieLocaleConfig,
	LocaleProvider,
	StorageLocaleConfig,
} from './types';
import { NavigatorLanguageLocaleProviderService } from './services/navigator-language-locale-provider.service';
import { AngularLocaleProviderService } from './services/angular-locale-provider.service';

const CONFIG_PREFIX = 'angular-globalite';
export const DEFAULT_APP_LOCALE_KEY = CONFIG_PREFIX + '.locale';
export const DEFAULT_COOKIE_NAME = CONFIG_PREFIX + '.locale';
export const DEFAULT_COOKIE_EXPIRES_MINUTES = 365 * 24 * 60;
export const DEFAULT_COOKIE_PATH = '/';

/**
 * Injection token for the locale storage key.
 */
export const STORAGE_LOCALE_CONFIG_TOKEN =
	new InjectionToken<StorageLocaleConfig>('locale-storage-key', {
		providedIn: 'root',
		factory: () => ({
			key: DEFAULT_APP_LOCALE_KEY,
			useSessionStorage: false,
		}),
	});

export const COOKIE_LOCALE_CONFIG_TOKEN =
	new InjectionToken<CookieLocaleConfig>('locale-cookie-config', {
		providedIn: 'root',
		factory: () => ({
			cookieName: DEFAULT_COOKIE_NAME,
			cookieExpiresMinutes: DEFAULT_COOKIE_EXPIRES_MINUTES,
			cookiePath: DEFAULT_COOKIE_PATH,
		}),
	});

export const DEFAULT_LOCALE = 'en-US';

export const SUPPORTED_LOCALES_TOKEN = new InjectionToken<string[]>(
	'supported-locales',
	{ providedIn: 'root', factory: () => [DEFAULT_LOCALE] }
);

export const LOCALE_PROVIDERS_TOKEN = new InjectionToken<LocaleProvider[]>(
	'locale-providers',
	{
		providedIn: 'root',
		factory: () => [
			inject(AngularLocaleProviderService),
			inject(NavigatorLanguageLocaleProviderService),
			inject(StorageLocaleProviderService),
		],
	}
);
