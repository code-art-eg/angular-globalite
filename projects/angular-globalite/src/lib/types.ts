import { Observable } from 'rxjs';

export interface LocaleProvider {
	readonly canWrite: boolean;
	readonly locale: string | null;
	setLocale(locale: string | null): void;
	readonly locale$: Observable<string | null>;
}

export interface StorageLocaleConfig {
	readonly key: string;
	readonly useSessionStorage: boolean;
}

export interface CookieLocaleConfig {
	readonly cookieName: string;
	readonly cookieExpiresMinutes: number;
	readonly cookiePath: string;
}

export type MonthDisplay =
	| 'narrow'
	| 'short'
	| 'long'
	| 'narrow-islamic'
	| 'short-islamic'
	| 'long-islamic';

export type WeekdayDisplay = 'narrow' | 'short' | 'long';
