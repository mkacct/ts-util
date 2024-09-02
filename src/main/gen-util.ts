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

/** A numeric interval */
export interface Interval {
	readonly min?: number;
	readonly max?: number;
}

/**
 * @param value anything
 * @returns true iff value is an Interval
 */
export function isInterval(value: unknown): value is Interval {
	if (typeof value !== "object") {return false;}
	if (value === null) {return false;}
	let hasMin: boolean = false, hasMax: boolean = false;
	if (("min" in value) && (value.min !== undefined)) {
		hasMin = true;
		if (typeof value.min !== "number") {return false;}
		if (isNaN(value.min)) {return false;}
	}
	if (("max" in value) && (value.max !== undefined)) {
		hasMax = true;
		if (typeof value.max !== "number") {return false;}
		if (isNaN(value.max)) {return false;}
	}
	if (!hasMin && !hasMax) {return false;}
	if (hasMin && hasMax) {
		const valueWithBoth: Required<Interval> = value as Required<Interval>;
		if (valueWithBoth.min > valueWithBoth.max) {return false;}
	}
	return true;
}

/**
 * @param value an interval
 * @returns true iff the interval is closed (defined finite min and max)
 */
export function isClosedInterval(value: Interval): boolean {
	return (value.min !== undefined) && (value.max !== undefined)
		&& isFinite(value.min) && isFinite(value.max) && (value.min <= value.max);
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
 * @returns number with zeroes prepended to meet the minimum length
 */
export function padNumber(n: number, length: number): string {
	let s: string = n.toString();
	while (s.length < length) {s = "0" + s;}
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
