import { Component } from '@angular/core';
import { interval } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { GlobalizeNumberPipe } from '@code-art-eg/angular-globalite';

@Component({
	selector: 'app-number-pipe-example',
	templateUrl: './number-pipe-example.component.html',
	styleUrl: './number-pipe-example.component.scss',
	imports: [GlobalizeNumberPipe],
})
export class NumberPipeExampleComponent {
	number$ = interval(1000).pipe(takeUntilDestroyed());
}
