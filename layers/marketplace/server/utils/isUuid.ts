/**
 * Check if a string is a valid UUID
 * @param value - The string to check
 * @returns True if the string is a valid UUID, false otherwise
 */
export function isUuid(value: string) {
	return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}
