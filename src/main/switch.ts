/* eslint-disable @typescript-eslint/no-unsafe-function-type */

const SW_DEFAULT: unique symbol = Symbol("default");

type SwCase<E, R> = readonly [condition: SwCondition<E>, result: SwResult<E, R>];
type SwCondition<E> = Exclude<E, Function> | ((value: Exclude<E, Function>) => boolean) | typeof SW_DEFAULT;
type SwResult<E, R> = ((value: E) => R) | Exclude<R, Function>;

/** Thrown by sw() if no case matches the value */
export class SwitchError extends Error {};

function isFunction(value: unknown): value is Function {
	return (typeof value === "function");
}

function checkSwCondition<E>(value: Exclude<E, Function>, condition: SwCondition<E>): boolean {
	return (condition === SW_DEFAULT) || (isFunction(condition) ? condition(value) : (value === condition));
}

/**
 * Alternative to switch statement that allows for functional conditions and return values
 * @param value value to match against cases
 * @param cases array of [condition, result] pairs, both of which may either be a constant or a function
 * @returns result of the first case matched by value
 * @throws {SwitchError} if value does not match any cases
 */
export default function sw<E, R>(value: Exclude<E, Function>, cases: ReadonlyArray<SwCase<E, R>>): R {
	for (const [condition, result] of cases) {
		if (checkSwCondition(value, condition)) {
			return isFunction(result) ? result(value) : result;
		}
	}
	throw new SwitchError(`No match`);
}

/**
 * sw() condition denoting the default case
 * @note use as the last case in sw() to avoid SwitchError if no other case matches
 */
sw.DEFAULT = SW_DEFAULT;

/**
 * @param conditions one or more sw() conditions
 * @returns condition that is true iff at least one of the given conditions is true
 */
sw.or = <E>(...conditions: ReadonlyArray<SwCondition<E>>): SwCondition<E> => (
	(value: Exclude<E, Function>): boolean => conditions.some((condition) => checkSwCondition(value, condition))
);

/**
 * @param conditions one or more sw() conditions
 * @returns condition that is true iff all of the given conditions are true
 */
sw.and = <E>(...conditions: ReadonlyArray<SwCondition<E>>): SwCondition<E> => (
	(value: Exclude<E, Function>): boolean => conditions.every((condition) => checkSwCondition(value, condition))
);

/**
 * @param condition a sw() condition
 * @returns condition that is true iff the given condition is false
 */
sw.not = <E>(condition: SwCondition<E>): SwCondition<E> => (
	(value: Exclude<E, Function>): boolean => !checkSwCondition(value, condition)
);
