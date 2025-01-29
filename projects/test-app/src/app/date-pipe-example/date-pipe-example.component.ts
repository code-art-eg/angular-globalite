import { Component } from '@angular/core';
import { from, concatAll, interval, scheduled, asyncScheduler } from 'rxjs';
import { map } from 'rxjs/operators';
import { GlobalizeDatePipe } from '@code-art-eg/angular-globalite';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
	selector: 'app-date-pipe-example',
	imports: [GlobalizeDatePipe],
	templateUrl: './date-pipe-example.component.html',
	styleUrl: './date-pipe-example.component.scss',
})
export class DatePipeExampleComponent {
	now$ = scheduled([from([0]), interval(1000)], asyncScheduler).pipe(
		concatAll(),
		map(() => new Date()),
		takeUntilDestroyed()
	);
	date = new Date(2008, 5, 23);
}
