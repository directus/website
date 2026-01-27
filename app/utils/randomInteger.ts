/**
 * Get a random number between min and max
 */
export const randomInt = (min: number, max: number) =>
	Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1) + Math.ceil(min));
