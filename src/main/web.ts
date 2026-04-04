// Utility functions for use in web applications

export type QueryStringParams = {[key: string]: string | string[]};

/**
 * Encode query string parameters
 * @param params key-value pairs for query parameters (arrays can be used to denote multiple values for a given key)
 * @returns query string (including leading "?") or empty string if no parameters
 */
export function queryString(params: QueryStringParams): string {
	const usp: URLSearchParams = new URLSearchParams();
	for (const [key, value] of Object.entries(params)) {
		if (Array.isArray(value)) {
			for (const v of value) {usp.append(key, v);}
		} else {
			usp.append(key, value);
		}
	}
	const str: string = usp.toString();
	if (str.length === 0) {return "";}
	return `?${str}`;
}
