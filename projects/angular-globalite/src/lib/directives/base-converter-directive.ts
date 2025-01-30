import {
	DestroyRef,
	Directive,
	inject,
	Injector,
	OnDestroy,
	OnInit,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { LocaleService } from '@code-art-eg/angular-globalite';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CoercedValue, ControlValue, OnChangeHandler } from '../types';

@Directive()
export abstract class BaseConverterDirective<T>
	implements OnDestroy, OnInit, ControlValueAccessor
{
	#controlValueAccessor: ControlValueAccessor | undefined;
	#onchange: OnChangeHandler<T>[] = [];
	#onTouch: (() => void)[] = [];
	#controlValue: ControlValue<T> = null;
	#disabled = false;
	#valueSubject = new BehaviorSubject<ControlValue<T>>(null);

	protected readonly injector = inject(Injector);
	protected readonly localeService = inject(LocaleService);
	#destroyRef = inject(DestroyRef);

	writeValue(val: ControlValue<T>): void {
		this.value = val;
	}

	get value(): ControlValue<T> {
		return this.#valueSubject.value;
	}

	set value(val: ControlValue<T>) {
		if (typeof val === 'string') {
			if (val === this.value) {
				return;
			}
		} else if (
			typeof this.value !== 'string' &&
			this.#valuesAreEqual(val, this.value)
		) {
			return;
		}
		this.#valueSubject.next(val);
		this.raiseOnChange(val);
	}

	ngOnDestroy(): void {
		this.#setAccessor(undefined);
		this.#valueSubject.complete();
	}

	public registerOnChange(fn: unknown): void {
		if (typeof fn === 'function') {
			this.#onchange.push(fn as OnChangeHandler<T>);
		}
	}

	public registerOnTouched(fn: unknown): void {
		if (typeof fn === 'function') {
			this.#onTouch.push(fn as () => void);
		}
	}

	public setDisabledState(isDisabled: boolean): void {
		this.#disabled = isDisabled;
		if (this.#controlValueAccessor) {
			if (
				typeof this.#controlValueAccessor.setDisabledState ===
				'function'
			) {
				this.#controlValueAccessor.setDisabledState(this.#disabled);
			}
		}
	}

	public ngOnInit(): void {
		this.#selectAccessor();
	}

	private raiseOnChange(val: ControlValue<T>): void {
		for (const fn of this.#onchange) {
			fn(val);
		}
	}

	private raiseOnTouched(): void {
		for (const fn of this.#onTouch) {
			fn();
		}
	}

	#setAccessor(accessor: ControlValueAccessor | undefined): void {
		if (this.#controlValueAccessor === accessor) {
			return;
		}
		this.#controlValueAccessor = accessor;
		if (accessor) {
			accessor.registerOnChange((v: ControlValue<T>) => {
				if (this.#controlValueAccessor !== accessor) {
					return;
				}
				this.#controlValue = v;
				const val = this.coerceValue(v);
				this.value = val !== undefined ? val : v;
			});
			accessor.registerOnTouched(() => {
				if (this.#controlValueAccessor !== accessor) {
					return;
				}
				this.raiseOnTouched();
			});
			if (typeof accessor.setDisabledState === 'function') {
				accessor.setDisabledState(this.#disabled);
			}
		}
	}

	#selectAccessor(): void {
		let accessors = this.injector.get<
			ControlValueAccessor | ControlValueAccessor[]
		>(NG_VALUE_ACCESSOR);
		if (accessors) {
			accessors = Array.isArray(accessors) ? accessors : [accessors];
			for (const accessor of accessors) {
				if (accessor !== this) {
					if (this.#controlValueAccessor) {
						throw new Error(
							`More than one control value accessor is provider.`
						);
					}
					this.#setAccessor(accessor);
				}
			}
		}

		combineLatest([this.localeService.locale$, this.#valueSubject])
			.pipe(takeUntilDestroyed(this.#destroyRef))
			.subscribe(v => {
				if (!this.#controlValueAccessor) {
					return;
				}
				const [, val] = v;
				let coercedValue: CoercedValue<T>;
				if (typeof val === 'string') {
					coercedValue = this.coerceValue(val);
					if (coercedValue !== undefined && coercedValue !== val) {
						this.value = coercedValue;
					} else if (this.#controlValue !== val) {
						this.#controlValue = val;
						this.#controlValueAccessor.writeValue(val);
					}
				} else if (val === null) {
					if (this.#controlValue !== '') {
						this.#controlValue = '';
						this.#controlValueAccessor.writeValue('');
					}
				} else {
					coercedValue = this.coerceValue(this.#controlValue);
					if (
						coercedValue === null ||
						!this.#valuesAreEqual(coercedValue as T, val)
					) {
						this.#controlValue = this.formatValue(val);
						this.#controlValueAccessor.writeValue(
							this.#controlValue
						);
					}
				}
			});
	}

	protected abstract coerceValue(v: ControlValue<T>): CoercedValue<T>;

	protected abstract formatValue(v: T): string;

	#valuesAreEqual(v1: T | null, v2: T | null): boolean {
		if (v1 === null) {
			return v2 === null;
		}
		if (v2 === null) {
			return false;
		}
		return this.inputsEqual(v1, v2);
	}

	protected abstract inputsEqual(v1: T, v2: T): boolean;
}
