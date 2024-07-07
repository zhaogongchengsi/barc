/**
 * Check if a value is an object.
 * @param value - The value to check.
 * @returns True if the value is an object, false otherwise.
 */
export function isObject(value: any): boolean {
	return typeof value === 'object' && value !== null;
}

/**
 * Check if an object is empty.
 * @param obj - The object to check.
 * @returns True if the object is empty, false otherwise.
 */
export function isEmptyObject(obj: object): boolean {
	return Object.keys(obj).length === 0;
}