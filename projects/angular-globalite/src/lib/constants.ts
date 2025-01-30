// noinspection ES6PreferShortImport

import type {
	CookieLocaleConfig,
	LocaleProvider,
	StorageLocaleConfig,
} from './types';
import { inject, InjectionToken } from '@angular/core';
import { StorageLocaleProviderService } from './services/storage-locale-provider.service';
import { NavigatorLanguageLocaleProviderService } from './services/navigator-language-locale-provider.service';
import { AngularLocaleProviderService } from './services/angular-locale-provider.service';

const CONFIG_PREFIX = 'angular-globalite';

/**
 * default key for the locale storage key. See {@link StorageLocaleProviderService}.
 */
export const DEFAULT_APP_LOCALE_KEY = CONFIG_PREFIX + '.locale';
/**
 * default cookie name for the locale cookie. See {@link CookieLocaleProviderService}.
 */
export const DEFAULT_COOKIE_NAME = CONFIG_PREFIX + '.locale';

/**
 * default cookie expiration in minutes. See {@link CookieLocaleProviderService}.
 */
export const DEFAULT_COOKIE_EXPIRES_MINUTES = 365 * 24 * 60;

/**
 * default cookie path. See {@link CookieLocaleProviderService}.
 */
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

/**
 * Injection token for the cookie locale configuration.
 */
export const COOKIE_LOCALE_CONFIG_TOKEN =
	new InjectionToken<CookieLocaleConfig>('locale-cookie-config', {
		providedIn: 'root',
		factory: () => ({
			cookieName: DEFAULT_COOKIE_NAME,
			cookieExpiresMinutes: DEFAULT_COOKIE_EXPIRES_MINUTES,
			cookiePath: DEFAULT_COOKIE_PATH,
		}),
	});

/**
 * The default locale. English (United States).
 */
export const DEFAULT_LOCALE = 'en-US';

/**
 * Injection token for the supported locales. See {@link LocaleValidatorService}.
 */
export const SUPPORTED_LOCALES_TOKEN = new InjectionToken<string[]>(
	'supported-locales',
	{ providedIn: 'root', factory: () => [DEFAULT_LOCALE] }
);

/**
 * Injection token for the locale providers. See {@link LocaleService}.
 * @remarks The providers are provided in the root injector.
 * The default providers are:
 * - {@link AngularLocaleProviderService}
 * - {@link NavigatorLanguageLocaleProviderService}
 * - {@link StorageLocaleProviderService}
 *
 * The values are checked in the reverse order. The last provider to provide a value is used.
 * If a provider does not provide a value, the next provider is checked.
 *
 * So the default providers first use the stored locale. This allows users to override the locale set by browser settings.
 * If the stored locale is not set, the browser language is used.
 * If the browser language is not set, the Angular locale is used.
 */
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
