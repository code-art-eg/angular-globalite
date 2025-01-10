import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DOCUMENT } from '@angular/common';

export const THEMES = ['light', 'dark', null];
//export const THEME_ICONS = ['sun', 'moon-stars', 'circle-half'];

const APP_THEME_KEY = 'app-theme';
const APP_THEME_ATTR = 'data-bs-theme';

@Component({
	selector: 'app-root',
	imports: [RouterOutlet],
	templateUrl: './app.component.html',
	styleUrl: './app.component.scss',
})
export class AppComponent {
	#document = inject(DOCUMENT);
	#matcher: MediaQueryList | null = null;
	readonly #listener: (e: MediaQueryListEvent) => void;
	readonly #theme = signal<string | null>(this.#currentTheme);
	//readonly theme = this.#theme.asReadonly();
	#listenerSetup = false;

	constructor() {
		this.#listener = this.#themeListener.bind(this);
		this.#applyTheme();
	}

	title = 'test-app';

	get #currentTheme(): string | null {
		if (!localStorage) {
			return null;
		}
		const current = localStorage.getItem(APP_THEME_KEY);
		if (!current || !THEMES.includes(current)) {
			return null;
		}
		return current;
	}

	set #currentTheme(theme: string | null) {
		if (!THEMES.includes(theme)) {
			theme = null;
		}
		if (!theme) {
			localStorage.removeItem(APP_THEME_KEY);
		} else {
			localStorage.setItem(APP_THEME_KEY, theme);
		}
		this.#applyTheme();
		this.#theme.set(theme);
	}

	#applyTheme(): void {
		if (!this.#document) {
			return;
		}
		let theme = this.#currentTheme;
		if (!theme) {
			theme = this.matcher.matches ? 'dark' : 'light';
			if (!this.#listenerSetup) {
				this.matcher.addEventListener('change', this.#listener);
				this.#listenerSetup = true;
			}
		} else if (this.#listenerSetup) {
			if (this.#listenerSetup) {
				this.matcher.removeEventListener('change', this.#listener);
				this.#listenerSetup = false;
			}
		}
		this.#document.body.setAttribute(APP_THEME_ATTR, theme);
	}

	private get matcher(): MediaQueryList {
		if (!this.#matcher) {
			this.#matcher = this.#document.defaultView!.matchMedia(
				'(prefers-color-scheme: dark)'
			);
		}
		return this.#matcher;
	}

	#themeListener(): void {
		this.#applyTheme();
	}
}
