/**
 * Converts an array of strings to a single string using a separator.
 * Handles various input types gracefully.
 *
 * @param input - The input value to convert (array, string, or nullish)
 * @param separator - The separator to use when joining array elements (default: '/')
 * @returns A string representation of the input
 *
 * @example
 * arrayToString(['a', 'b', 'c']) // 'a/b/c'
 * arrayToString(['a', 'b', 'c'], '-') // 'a-b-c'
 * arrayToString('single') // 'single'
 * arrayToString(undefined) // ''
 * arrayToString([]) // ''
 */
export function arrayToString(input: string[] | string | null | undefined, separator = '/'): string {
	// Handle nullish values
	if (input == null) {
		return '';
	}

	// Handle array input
	if (Array.isArray(input)) {
		// Filter out non-string values and join
		return input.filter((item): item is string => typeof item === 'string').join(separator);
	}

	// Handle string input
	if (typeof input === 'string') {
		return input;
	}

	// Fallback for other types - convert to string
	return String(input);
}
