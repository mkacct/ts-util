// Utility functions for date/time

import {padNumber} from "./gen-util.js";

/**
 * @param year a year (integer) in the Gregorian calendar
 * @returns true iff the year is a leap year
 */
export function yearIsLeap(year: number): boolean {
	return (year % 100 === 0) ? (year % 400 === 0) : (year % 4 === 0);
}

/**
 * @param date input date (time is ignored)
 * @returns the date in "yyyy-mm-dd" format
 * @note uses the local time zone!
 */
export function formatSimpleDate(date: Date): string {
	return `${date.getFullYear()}-${padNumber(date.getMonth() + 1, 2)}-${padNumber(date.getDate(), 2)}`;
}
