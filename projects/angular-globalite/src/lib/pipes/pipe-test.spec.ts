import {
	ChangeDetectorRef,
	Injector,
	runInInjectionContext,
} from '@angular/core';
import { LocaleService } from '../services/locale.service';
import { BehaviorSubject, Subject } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { BaseGlobalizePipe } from './base-globalize-pipe';

type Formatter<TInput> = (value: TInput) => string;

type FormatterFactory<TInput, TOptions> = (
	locale: string,
	optionsOrFormat: TOptions | string
) => Formatter<TInput>;

export function generatePipeTest<
	TInput,
	TOptions,
	TClass extends BaseGlobalizePipe<TInput, TOptions>,
>(
	pipeClass: new () => TClass,
	defaultOptions: TOptions,
	defaultFormat: string,
	defaultValue: TInput,
	factory: FormatterFactory<TInput, TOptions>,
	secondValue: TInput
) {
	let locale$: BehaviorSubject<string>;

	let mockLocalizeService: LocaleService;

	let pipe: BaseGlobalizePipe<TInput, TOptions>;

	beforeEach(() => {
		locale$ = new BehaviorSubject<string>('en');
		mockLocalizeService = {
			locale$: locale$,
			currentLocale: 'en',
		} as unknown as LocaleService;
		Object.defineProperty(mockLocalizeService, 'currentLocale', {
			get: () => locale$.value,
			set: (value: string) => locale$.next(value),
		});
		TestBed.configureTestingModule({
			providers: [
				{
					provide: ChangeDetectorRef,
					useValue: jasmine.createSpyObj('ChangeDetectorRef', [
						'markForCheck',
						'detectChanges',
					]),
				},
				{ provide: LocaleService, useValue: mockLocalizeService },
			],
			imports: [pipeClass],
		});
		const injector = TestBed.inject(Injector);
		runInInjectionContext(injector, () => {
			pipe = new pipeClass();
		});
	});

	afterEach(() => {
		pipe.ngOnDestroy();
		locale$.complete();
	});

	it('create an instance', () => {
		expect(pipe).toBeTruthy();
	});

	it('transforms null to null', () => {
		expect(pipe.transform(null)).toBeNull();
	});

	it('transforms undefined to null', () => {
		expect(pipe.transform(undefined)).toBeNull();
	});

	it('transforms null to null with locale', () => {
		expect(pipe.transform(null, undefined, 'en')).toBe(null);
	});

	it('transforms undefined to null with locale', () => {
		expect(pipe.transform(null, undefined, 'en')).toBe(null);
	});

	it('transforms null to null with options', () => {
		expect(pipe.transform(null, defaultOptions, 'en')).toBe(null);
	});

	it('transforms undefined to null with options', () => {
		expect(pipe.transform(undefined, defaultOptions, 'en')).toBe(null);
	});

	it('transforms null to null with options', () => {
		expect(pipe.transform(null, defaultFormat, 'en')).toBe(null);
	});

	it('transforms undefined to null with options', () => {
		expect(pipe.transform(undefined, defaultFormat, 'en')).toBe(null);
	});

	it('transforms a value to a string with default format and culture', () => {
		expect(pipe.transform(defaultValue, defaultFormat, 'de')).toBe(
			factory('de', defaultFormat)(defaultValue)
		);
	});

	it('transforms a value to a string with default options and culture', () => {
		expect(pipe.transform(defaultValue, defaultOptions, 'de')).toBe(
			factory('de', defaultFormat)(defaultValue)
		);
	});

	it('transforms a value to a string with default options and default culture', () => {
		expect(pipe.transform(defaultValue, defaultOptions)).toBe(
			factory('en', defaultOptions)(defaultValue)
		);

		mockLocalizeService.currentLocale = 'ar-EG';

		expect(pipe.transform(defaultValue, defaultOptions)).toBe(
			factory('ar-EG', defaultOptions)(defaultValue)
		);
	});

	it('transforms a value to a string with default format and default culture', () => {
		expect(pipe.transform(defaultValue, defaultOptions)).toBe(
			factory('en', defaultOptions)(defaultValue)
		);

		mockLocalizeService.currentLocale = 'ar-EG';

		expect(pipe.transform(defaultValue, defaultOptions)).toBe(
			factory('ar-EG', defaultOptions)(defaultValue)
		);
	});

	it('transforms an Observable to a string with default format and default culture', () => {
		const subject = new Subject<TInput>();

		expect(pipe.transform(subject, defaultFormat)).toBeNull();

		subject.next(defaultValue);

		expect(pipe.transform(subject, defaultFormat)).toBe(
			factory('en', defaultOptions)(defaultValue)
		);

		mockLocalizeService.currentLocale = 'ar-EG';

		expect(pipe.transform(subject, defaultFormat)).toBe(
			factory('ar-EG', defaultFormat)(defaultValue)
		);

		subject.next(secondValue);

		expect(pipe.transform(subject, defaultFormat)).toBe(
			factory('ar-EG', defaultFormat)(secondValue)
		);

		mockLocalizeService.currentLocale = 'en';

		expect(pipe.transform(subject, defaultFormat)).toBe(
			factory('en', defaultFormat)(secondValue)
		);

		subject.complete();
	});
}
