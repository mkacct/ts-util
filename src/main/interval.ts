// Class representing a numeric interval

type IntervalRep = {
	min: number;
	max: number;
	minClosed: boolean;
	maxClosed: boolean;
} | null;

type IntervalLeftBracket = "[" | "(";
type IntervalRightBracket = "]" | ")";

/**
 * A numeric interval
 * @note immutable
 */
export class Interval {

	/** The empty interval */
	public static readonly EMPTY = new Interval("(", 0, 0, ")");

	private readonly rep: IntervalRep;

	/**
	 * Create a new interval
	 * @param left bracket signifying the type of left boundary
	 * @param min minimum value
	 * @param max maximum value
	 * @param right bracket signifying the type of right boundary
	 * @returns the new interval
	 */
	public constructor(left: IntervalLeftBracket, min: number, max: number, right: IntervalRightBracket) {
		const minClosed: boolean = left === "[";
		const maxClosed: boolean = right === "]";
		if (isNaN(min) || isNaN(max)) {throw new RangeError("min and max must be numbers");}
		if (min > max) {throw new RangeError("min must be less than or equal to max");}
		if (min === max) {
			if (!minClosed && !maxClosed) {
				this.rep = null;
				return;
			} else if (!(minClosed && maxClosed)) {
				throw new RangeError("interval definition is contradictory");
			}
		}
		if ((!isFinite(min) && minClosed) || (!isFinite(max) && maxClosed)) {
			throw new RangeError("interval cannot include infinite bounds");
		}
		this.rep = {min, max, minClosed, maxClosed};
	}

	/**
	 * Create an open interval
	 * @param min the minimum value
	 * @param max the maximum value
	 * @returns an open interval with the given bounds
	 */
	public static open(min: number, max: number): Interval {
		return new Interval("(", min, max, ")");
	}

	/**
	 * Create a closed interval
	 * @param min the minimum value
	 * @param max the maximum value
	 * @returns a closed interval with the given bounds
	 */
	public static closed(min: number, max: number): Interval {
		return new Interval("[", min, max, "]");
	}

	/**
	 * @param n a real number
	 * @returns true iff the interval contains n
	 */
	public contains(n: number): boolean {
		if (isNaN(n)) {return false;}
		if (!isFinite(n)) {return false;}
		if (this.rep === null) {return false;}
		if ((n < this.rep.min) || (n > this.rep.max)) {return false;}
		if (!this.rep.minClosed && (n === this.rep.min)) {return false;}
		if (!this.rep.maxClosed && (n === this.rep.max)) {return false;}
		return true;
	}

	/**
	 * @param other another interval
	 * @returns true iff the two intervals are equal
	 */
	public equals(other: Interval): boolean {
		if ((this.rep === null) && (other.rep === null)) {return true;}
		if ((this.rep === null) || (other.rep === null)) {return false;}
		return (this.rep.min === other.rep.min)
			&& (this.rep.max === other.rep.max)
			&& (this.rep.minClosed === other.rep.minClosed)
			&& (this.rep.maxClosed === other.rep.maxClosed);
	}

	/**
	 * @param other another interval
	 * @returns true iff the two intervals intersect
	 */
	public intersects(other: Interval): boolean {
		if ((this.rep === null) || (other.rep === null)) {return false;}
		if (this.rep.max < other.rep.min) {return false;}
		if (this.rep.min > other.rep.max) {return false;}
		if ((this.rep.max === other.rep.min) && (!this.rep.maxClosed || !other.rep.minClosed)) {return false;}
		if ((this.rep.min === other.rep.max) && (!this.rep.minClosed || !other.rep.maxClosed)) {return false;}
		return true;
	}

	/**
	 * @param other another interval
	 * @returns true iff this interval entirely contains the other interval
	 */
	public isSubsetOrEqual(other: Interval) {
		if (other.rep === null) {return true;}
		if (this.rep === null) {return false;}
		if (this.rep.min > other.rep.min) {return false;}
		if (this.rep.max < other.rep.max) {return false;}
		if ((this.rep.min === other.rep.min) && (!this.rep.minClosed && other.rep.minClosed)) {return false;}
		if ((this.rep.max === other.rep.max) && (!this.rep.maxClosed && other.rep.maxClosed)) {return false;}
		return true;
	}

	/**
	 * @param other another interval
	 * @returns true iff this interval entirely contains the other interval and is not equal to it
	 */
	public isStrictSubset(other: Interval) {
		return !this.equals(other) && this.isSubsetOrEqual(other);
	}

	/** True iff the interval is empty */
	public get isEmpty(): boolean {
		return this.rep === null;
	}

	/** The minimum value of the interval, or null if the interval is empty */
	public get min(): number | null {
		if (this.rep === null) {return null;}
		return this.rep.min;
	}

	/** The maximum value of the interval, or null if the interval is empty */
	public get max(): number | null {
		if (this.rep === null) {return null;}
		return this.rep.max;
	}

	/** True iff the interval's minimum value is included */
	public get isLeftClosed(): boolean {
		if (this.rep === null) {return false;}
		return this.rep.minClosed;
	}

	/** True iff the interval's maximum value is included */
	public get isRightClosed(): boolean {
		if (this.rep === null) {return false;}
		return this.rep.maxClosed;
	}

	/** True iff the interval is closed (both bounds are included) */
	public get isClosed(): boolean {
		if (this.rep === null) {return false;}
		return this.rep.minClosed && this.rep.maxClosed;
	}

	/**
	 * @returns a string representation of the interval
	 */
	public toString(): string {
		if (this.rep === null) {return "∅";}
		return `${this.rep.minClosed ? "[" : "("}${this.rep.min}, ${this.rep.max}${this.rep.maxClosed ? "]" : ")"}`;
	}

}
