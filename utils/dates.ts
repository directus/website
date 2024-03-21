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
