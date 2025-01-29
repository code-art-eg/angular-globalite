/*
 * Public API Surface of angular-globalite
 */

export * from './lib/services/angular-locale-provider.service';
export * from './lib/services/cookie-locale-provider.service';
export * from './lib/services/locale.service';
export * from './lib/services/navigator-language-locale-provider.service';
export * from './lib/services/storage-locale-provider.service';

export type {
	LocaleProvider,
	CookieLocaleConfig,
	StorageLocaleConfig,
} from './lib/types';

export * from './lib/pipes/globalize-number.pipe';
export * from './lib/pipes/globalize-date.pipe';
export * from './lib/constants';
