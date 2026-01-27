/**
 * Convert a value in a range to 0-1
 */
export const range = (min: number, max: number, value: number) => (value - min) / (max - min);
