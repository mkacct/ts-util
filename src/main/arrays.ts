// Utility class with static methods replicating string utilities for arrays

import {isValue} from "./main.js";

/**
 * A class that provides utility functions for working with arrays.
 */
export default class Arrays {
	private constructor() {} // prevent instantiation

	private static equalsImpl<T>(a: readonly T[], b: readonly T[], comparator: (a: T, b: T) => boolean): boolean {
		if (a.length !== b.length) {return false;}
		for (let i = 0; i < a.length; i++) {
			if ((i in a) && (i in b)) {
				if (!comparator(a[i], b[i])) {return false;}
			} else if ((i in a) || (i in b)) {return false;}
		}
		return true;
	}

	/**
	 * Tests shallow equality of two arrays, using the `==` operator to compare elements
	 */
	public static equals<T>(a: readonly T[], b: readonly T[]): boolean {
		// eslint-disable-next-line eqeqeq
		return this.equalsImpl(a, b, (x, y) => (x == y));
	}

	/**
	 * Tests shallow equality of two arrays, using the `===` operator to compare elements
	 */
	public static strictEquals<T>(a: readonly T[], b: readonly T[]): boolean {
		return Arrays.equalsImpl(a, b, (x, y) => (x === y));
	}

	private static isSubarrayAtIndex<T>(array: readonly T[], searchSubarray: readonly T[], indexInt: number): boolean {
		if (indexInt < 0 || (indexInt + searchSubarray.length > array.length)) {return false;}
		return Arrays.strictEquals(array.slice(indexInt, indexInt + searchSubarray.length), searchSubarray);
	}

	private static resolveIndex(indexInt: number, arrayLength: number): number {
		if (indexInt > arrayLength) {
			return arrayLength;
		} else if (indexInt < -arrayLength) {
			return 0;
		} else if (indexInt < 0) {
			return arrayLength + indexInt;
		}
		return indexInt;
	}

	/**
	 * @param array
	 * @param searchSubarray the subarray to search for in `array`
	 * @param fromIndex the array index at which to begin the search; if fromIndex is omitted, the search starts at index 0
	 * @returns the index of the first occurrence of `searchSubarray`, or -1 if it is not present
	 * @note negative `fromIndex` counts back from the end of the array, as in `Array.indexOf()`
	 */
	public static indexOfSubarray<T>(array: readonly T[], searchSubarray: readonly T[], fromIndex?: number): number {
		let fromIndexInt = isValue(fromIndex) ? toInt(fromIndex) : 0;
		fromIndexInt = Arrays.resolveIndex(fromIndexInt, array.length);
		const upperBound: number = array.length - searchSubarray.length;
		for (let i = fromIndexInt; i <= upperBound; i++) {
			if (Arrays.isSubarrayAtIndex(array, searchSubarray, i)) {return i;}
		}
		return -1;
	}

	/**
	 * @param array
	 * @param searchSubarray the subarray to search for in `array`
	 * @param fromIndex the array index at which to begin searching backward; if fromIndex is omitted, the search starts at the last index in the array
	 * @returns the index of the last occurrence of `searchSubarray`, or -1 if it is not present
	 * @note negative `fromIndex` counts back from the end of the array, as in `Array.lastIndexOf()`
	 */
	public static lastIndexOfSubarray<T>(array: readonly T[], searchSubarray: readonly T[], fromIndex?: number): number {
		let fromIndexInt = isValue(fromIndex) ? toInt(fromIndex) : Infinity;
		fromIndexInt = Arrays.resolveIndex(fromIndexInt, array.length);
		const upperBound: number = array.length - searchSubarray.length;
		for (let i = Math.min(fromIndexInt, upperBound); i >= 0; i--) {
			if (Arrays.isSubarrayAtIndex(array, searchSubarray, i)) {return i;}
		}
		return -1;
	}

	/**
	 *
	 * @param array
	 * @param searchSubarray search subarray
	 * @param fromIndex the position in `array` at which to begin searching for `searchSubarray`
	 * @returns true iff `searchSubarray` appears as a subarray of `array`, at one or more indices that are greater than or equal to `fromIndex`
	 * @note if `fromIndex` is undefined, 0 is assumed, so as to search all of `array`
	 */
	public static includesSubarray<T>(array: readonly T[], searchSubarray: readonly T[], fromIndex?: number): boolean {
		return Arrays.indexOfSubarray(array, searchSubarray, fromIndex) !== -1;
	}

	/**
	 * @param array
	 * @param searchSubarray
	 * @param index
	 * @returns true iff `searchSubarray` is the same as the corresponding elements of `array` starting at `index`
	 * @note negative `fromIndex` counts back from the end of the array, as in `Array.indexOf()`
	 */
	public static startsWith<T>(array: readonly T[], searchSubarray: readonly T[], index?: number): boolean {
		let indexInt = isValue(index) ? toInt(index) : 0;
		indexInt = Arrays.resolveIndex(indexInt, array.length);
		return Arrays.isSubarrayAtIndex(array, searchSubarray, indexInt);
	}

	/**
	 * @param array
	 * @param searchSubarray
	 * @param endIndex
	 * @returns true iff `searchSubarray` is the same as the corresponding elements of `array` starting at `endIndex` − length(`searchSubarray`)
	 * @note negative `fromIndex` counts back from the end of the array, as in `Array.lastIndexOf()`
	 */
	public static endsWith<T>(array: readonly T[], searchSubarray: readonly T[], endIndex?: number): boolean {
		let endIndexInt = isValue(endIndex) ? toInt(endIndex) : Infinity;
		endIndexInt = Arrays.resolveIndex(endIndexInt, array.length);
		return Arrays.isSubarrayAtIndex(array, searchSubarray, endIndexInt - searchSubarray.length);
	}

	/**
	 * Pads `array` with `fillValue` (possibly repeated) so that the resulting array reaches a given length; the padding is applied from the start (left) of `array`
	 * @param array
	 * @param targetLength the length of `array` once it has been padded; if this parameter is smaller than `array`'s initial length, no action is taken
	 * @param fillValue the value to pad `array` with
	 * @returns a reference to `array`
	 * @note this method mutates `array`!
	 */
	public static padStart<T>(array: T[], targetLength: number, fillValue: T): T[] {
		const targetLengthInt = toInt(targetLength);
		while (array.length < targetLengthInt) {
			array.unshift(fillValue);
		}
		return array;
	}

	/**
	 * Pads `array` with `fillValue` (possibly repeated) so that the resulting array reaches a given length; the padding is applied from the end (right) of `array`
	 * @param array
	 * @param targetLength the length of `array` once it has been padded; if this parameter is smaller than `array`'s initial length, no action is taken
	 * @param fillValue the value to pad `array` with
	 * @returns a reference to `array`
	 * @note this method mutates `array`!
	 */
	public static padEnd<T>(array: T[], targetLength: number, fillValue: T): T[] {
		const targetLengthInt = toInt(targetLength);
		while (array.length < targetLengthInt) {
			array.push(fillValue);
		}
		return array;
	}

	/**
	 * @param array
	 * @param targetLength
	 * @param fillValue
	 * @returns a copy of `array` padded with `fillValue` (possibly repeated) so that the resulting array reaches `targetLength`; the padding is applied from the start (left) of `array`
	 * @note copying counterpart of the `Arrays.padStart()` method
	 */
	public static toPaddedStart<T>(array: readonly T[], targetLength: number, fillValue: T): T[] {
		return Arrays.padStart(array.slice(), targetLength, fillValue);
	}

	/**
	 * @param array
	 * @param targetLength
	 * @param fillValue
	 * @returns a copy of `array` padded with `fillValue` (possibly repeated) so that the resulting array reaches `targetLength`; the padding is applied from the end (right) of `array`
	 * @note copying counterpart of the `Arrays.padEnd()` method
	 */
	public static toPaddedEnd<T>(array: readonly T[], targetLength: number, fillValue: T): T[] {
		return Arrays.padEnd(array.slice(), targetLength, fillValue);
	}

	/**
	 * @param array
	 * @param count number of copies to append
	 * @returns an array that is made from `count` copies of `array` appended together, or the empty array if `count` is 0
	 * @throws {RangeError} if `count` is negative
	 * @note this method does not mutate `array`
	 */
	public static repeat<T>(array: readonly T[], count: number): T[] {
		const countInt = toInt(count);
		if (countInt < 0) {throw new RangeError(`Invalid count value: ${count}`);}
		return [].concat(...(new Array(countInt)).fill(array));
	}

	/**
	 * Split an array into subarrays using the specified separator and return them as an array
	 * @param array
	 * @param separator a value to use in separating `array`
	 * @param limit a value used to limit the number of elements returned in the array
	 * @returns array of subarrays
	 * @throws {RangeError} if `limit` is negative
	 * @note this method does not mutate `array`
	 */
	public static split<T>(array: readonly T[], separator: T, limit?: number) : T[][] {
		return Arrays.splitByPredicate(array, (value) => (value === separator), limit);
	}

	/**
	 * Split an array into subarrays using the specified separator and return them as an array
	 * @param array
	 * @param predicate a predicate that returns true iff the current element is a separator
	 * @param limit a value used to limit the number of elements returned in the array
	 * @returns array of subarrays
	 * @throws {RangeError} if `limit` is negative
	 * @note this method does not mutate `array`
	 */
	public static splitByPredicate<T>(
		array: readonly T[],
		predicate: (value: T, index: number, obj: readonly T[]) => boolean,
		limit?: number
	) : T[][] {
		const limitInt = isValue(limit) ? toInt(limit) : Infinity;
		if (limitInt < 0) {throw new RangeError(`Invalid limit value: ${limit}`);}
		if (limitInt === 0) {return [];}

		const res: T[][] = [];
		let cur: T[] = [];
		for (const [index, value] of array.entries()) {
			if (predicate(value, index, array)) {
				res.push(cur);
				if (res.length >= limitInt) {
					return res;
				}
				cur = [];
			} else {
				cur.push(value);
			}
		}
		res.push(cur);
		return res;
	}

	/**
	 * Split an array into subarrays using the specified separator and return them as an array
	 * @param array
	 * @param separator an array of values to use in separating `array`
	 * @param limit a value used to limit the number of elements returned in the array
	 * @returns array of subarrays
	 * @throws {RangeError} if `limit` is negative
	 * @note this method does not mutate `array`
	 */
	public static splitBySubarray<T>(array: readonly T[], separator: readonly T[], limit?: number): T[][] {
		const limitInt = isValue(limit) ? toInt(limit) : Infinity;
		if (limitInt < 0) {throw new RangeError(`Invalid limit value: ${limit}`);}
		if (limitInt === 0) {return [];}

		const res: T[][] = [];
		if (separator.length === 0) {

			for (const value of array) {
				res.push([value]);
				if (res.length >= limitInt) {
					return res;
				}
			}

		} else {

			let cur: T[] = [];
			let i = 0;
			while (i < array.length) {
				if (Arrays.isSubarrayAtIndex(array, separator, i)) {
					res.push(cur);
					if (res.length >= limitInt) {
						return res;
					}
					cur = [];
					i += separator.length;
				} else {
					cur.push(array[i]);
					i++;
				}
			}
			res.push(cur);

		}
		return res;
	}

	/**
	 * Adds all the elements of an array of arrays into an array, separated by the specified separator value
	 * @param array
	 * @param separator a value used to separate one array from the next in the resulting array
	 * @returns an array, separated by `separator`
	 */
	public static joinArrays<T>(array: readonly T[][], separator: T): T[] {
		return Arrays.joinArraysByArray(array, [separator]);
	}

	/**
	 * Adds all the elements of an array of arrays into an array, separated by the specified separator array
	 * @param array
	 * @param separator an array used to separate one array from the next in the resulting array
	 * @returns an array, separated by `separator`
	 */
	public static joinArraysByArray<T>(array: readonly T[][], separator: readonly T[]): T[] {
		const res: T[] = [];
		for (const [index, value] of array.entries()) {
			if (index > 0) {
				res.push(...separator);
			}
			res.push(...value);
		}
		return res;
	}

}

function toInt(n: number): number {
	n = Math.trunc(n);
	if (isNaN(n) || (n === 0)) {return 0;}
	return n;
}
