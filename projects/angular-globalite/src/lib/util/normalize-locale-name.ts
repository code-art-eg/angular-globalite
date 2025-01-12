/**
 * Normalizes a locale name by trimming, replacing underscores with hyphens,
 * and formatting each part of the locale string appropriately.
 *
 * @param {string} locale - The locale string to normalize.
 * @returns {string} - The normalized locale string.
 */
export function normalizeLocaleName(locale: string): string {
	if (!locale) {
		throw new Error('Invalid locale name');
	}
	locale = locale.trim().replace('_', '-');
	const split = locale.split('-');
	if (split.length > 3) {
		throw new Error('Invalid locale name');
	}
	if (split.length === 1) {
		return locale.toLocaleLowerCase();
	} else {
		let res = '';
		for (let i = 0; i < split.length; i++) {
			if (i > 0) {
				res += '-';
			}
			if (i === 0) {
				res += split[i].toLowerCase();
			} else if (i === 1 && split.length > 2) {
				res +=
					split[1][0].toUpperCase() +
					split[1].substring(1).toLowerCase();
			} else {
				res += split[i].toUpperCase();
			}
		}
		return res;
	}
}
