interface FormatDateOptions {
	day?: 'numeric';
	month?: 'short' | 'long';
	year?: 'numeric';
}

export function formatTvDate(
	dateString: string,
	options: FormatDateOptions = { day: 'numeric', month: 'short', year: 'numeric' },
) {
	const formatted = new Intl.DateTimeFormat('en-US', options).format(new Date(dateString)).split(',').join('');
	return formatted;
}

/**
 * Formats a date as relative time (e.g., "2 hours ago", "3 days ago")
 * @param date - The date to format (Unix timestamp in seconds, milliseconds, or Date/string)
 * @param prefix - Optional prefix (default: "Updated")
 * @returns Formatted relative time string
 */
export function formatTimeAgo(date: number | string | Date): string {
	if (!date) return '';

	// Convert to Date object
	let dateObj: Date;

	if (typeof date === 'number') {
		// Check if it's seconds (Unix timestamp) or milliseconds
		// Unix timestamps are typically 10 digits, JS timestamps are 13
		dateObj = new Date(date < 10000000000 ? date * 1000 : date);
	} else if (typeof date === 'string') {
		dateObj = new Date(date);
	} else {
		dateObj = date;
	}

	// Get time difference in milliseconds
	const now = new Date();
	const diffMs = now.getTime() - dateObj.getTime();

	// Handle future dates
	if (diffMs < 0) {
		return `in the future`;
	}

	// Convert to seconds
	const diffSeconds = Math.floor(diffMs / 1000);

	// Less than a minute
	if (diffSeconds < 60) {
		return `just now`;
	}

	// Less than an hour
	const diffMinutes = Math.floor(diffSeconds / 60);

	if (diffMinutes < 60) {
		return `${diffMinutes} ${diffMinutes === 1 ? 'minute' : 'minutes'} ago`;
	}

	// Less than a day
	const diffHours = Math.floor(diffMinutes / 60);

	if (diffHours < 24) {
		return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
	}

	// Less than a week
	const diffDays = Math.floor(diffHours / 24);

	if (diffDays < 7) {
		if (diffDays === 0) return `today`;
		if (diffDays === 1) return `yesterday`;
		return `${diffDays} days ago`;
	}

	// Less than a month (30 days)
	const diffWeeks = Math.floor(diffDays / 7);

	if (diffWeeks < 4) {
		return `${diffWeeks} ${diffWeeks === 1 ? 'week' : 'weeks'} ago`;
	}

	// Less than a year
	const diffMonths = Math.floor(diffDays / 30);

	if (diffMonths < 12) {
		return `${diffMonths} ${diffMonths === 1 ? 'month' : 'months'} ago`;
	}

	// Years
	const diffYears = Math.floor(diffDays / 365);

	return `${diffYears} ${diffYears === 1 ? 'year' : 'years'} ago`;
}
