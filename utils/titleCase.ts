export function toTitleCase(inputString: string): string {
	// Split the string by underscores or hyphens
	const words: string[] = inputString.replace(/[_-]/g, ' ').split(' ');

	// Capitalize the first letter of each word and join them
	const titleCase: string = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');

	return titleCase;
}
