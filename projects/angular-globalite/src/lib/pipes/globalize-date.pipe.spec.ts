import { generatePipeTest } from './pipe-test.spec';
import { dateFormatter } from '@code-art-eg/globalite';
import { GlobalizeDatePipe } from './globalize-date.pipe';

describe('GlobalizeDatePipe', () => {
	generatePipeTest(
		GlobalizeDatePipe,
		{
			style: 'decimal',
			useGrouping: true,
		} as Intl.DateTimeFormatOptions,
		'd',
		new Date(2008, 7, 16),
		dateFormatter,
		new Date(2015, 1, 29)
	);
});
