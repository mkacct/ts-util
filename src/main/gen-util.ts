// General utilities for TypeScript

/** Any string-keyed object */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyObject = {[key: string]: any};

/** Not null or undefined */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type Value = {};

/**
 * @param value anything
 * @returns true iff value is neither undefined nor null
 */
export function isValue(value: unknown): value is Value {
	return (value !== undefined) && (value !== null);
}

/**
 * @param value a number
 * @param low lower bound
 * @param high upper bound
 * @returns low <= value <= high
 */
export function between(value: number, low: number, high: number): boolean {
	return (value >= low) && (value <= high);
}

/**
 * @param min minimum value
 * @param max maximum value
 * @param step increment (default 1)
 * @returns array of numbers from min to max inclusive, in steps of step
 */
export function range(min: number, max: number, step: number = 1): number[] {
	const res: number[] = [];
	for (let i = min; i <= max; i += step) {
		res.push(i);
	}
	return res;
}

/**
 * @param str input string
 * @returns string with all whitespace collapsed to single spaces
 */
export function collapse(str: string): string {
	return str.replace(/\s+/g, " ").trim();
}

/**
 * @param n input number
 * @param length minimum length of the output string
 * @param pad character to pad with (default "0")
 * @returns number with pad character repeatedly prepended to meet the minimum length
 */
export function padNumber(n: number, length: number, pad: string = "0"): string {
	if (pad.length !== 1) {throw new Error("pad must be one character");}
	let s: string = n.toString();
	while (s.length < length) {s = pad + s;}
	return s;
}

/**
 * Test if checks is a subset of obj
 * @param obj to check
 * @param checks key/value pairs expected in obj
 * @returns true iff obj contains all key/value pairs in checks (shallow)
 */
export function propsEq(obj: object, checks: object): boolean {
	for (const key in checks) {
		if (!guardKeyIn(key, obj)) {return false;}
		if (obj[key] !== checks[key]) {return false;}
	}
	return true;
}

/**
 * @param obj original object
 * @param minusKeys keys to remove
 * @returns shallow copy of obj with keys in minusKeys removed
 */
export function minusProps(obj: AnyObject, minusKeys: string[]): AnyObject {
	const result: AnyObject = {};
	for (const key in obj) {
		if (!minusKeys.includes(key)) {
			result[key] = obj[key];
		}
	}
	return result;
}

export function guardKeyIn(key: string, obj: object): key is keyof typeof obj {
	return key in obj;
}
