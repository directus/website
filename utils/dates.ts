interface FormatDateOptions {
	day?: 'numeric';
	month?: 'short' | 'long';
	year?: 'numeric';
}

export function formatTvDate(dateString: string, options?: FormatDateOptions) {
	const defaultOptions: FormatDateOptions = {
		day: 'numeric',
		month: 'short',
		year: 'numeric',
	};

	const finalOptions = options ?? defaultOptions;
	const formatted = new Intl.DateTimeFormat('en-US', finalOptions).format(new Date(dateString)).split(',').join('');
	return formatted;
}
