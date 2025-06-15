import assert from "node:assert/strict";
import test, {suite} from "node:test";
import Interval from "../main/interval.js";

suite("Interval", (): void => {

	test("constructor", (): void => {
		assertInterval(new Interval("[", 3, 5, "]"), "[3, 5]");
		assertInterval(new Interval("(", 3, 5, ")"), "(3, 5)");
		assertInterval(new Interval("[", 3, 5, ")"), "[3, 5)");
		assertInterval(new Interval("(", 3, 5, "]"), "(3, 5]");
		assertInterval(new Interval("(", -Infinity, 5, "]"), "(-Infinity, 5]");
		assertInterval(new Interval("[", 3, Infinity, ")"), "[3, Infinity)");
		assertInterval(new Interval("(", -Infinity, Infinity, ")"), "(-Infinity, Infinity)");
		assertInterval(new Interval("[", 3, 3, "]"), "[3, 3]");
		assertInterval(new Interval("(", 3, 3, ")"), "∅");
		assertInterval(new Interval("(", Infinity, Infinity, ")"), "∅");

		assert.throws(() => {new Interval("[", 5, 3, "]");}, RangeError);
		assert.throws(() => {new Interval("[", NaN, 3, "]");}, RangeError);
		assert.throws(() => {new Interval("[", 3, NaN, "]");}, RangeError);
		assert.throws(() => {new Interval("[", -Infinity, 3, "]");}, RangeError);
		assert.throws(() => {new Interval("[", 3, Infinity, "]");}, RangeError);
		assert.throws(() => {new Interval("(", Infinity, -Infinity, ")");}, RangeError);
		assert.throws(() => {new Interval("(", 3, 3, "]");}, RangeError);
		assert.throws(() => {new Interval("[", 3, 3, ")");}, RangeError);
	});

	test("open factory", (): void => {
		assertInterval(Interval.open(3, 5), "(3, 5)");
		assertInterval(Interval.open(3, 3), "∅");
		assertInterval(Interval.open(-Infinity, 5), "(-Infinity, 5)");
		assertInterval(Interval.open(3, Infinity), "(3, Infinity)");
	});

	test("closed factory", (): void => {
		assertInterval(Interval.closed(3, 5), "[3, 5]");
		assertInterval(Interval.closed(3, 3), "[3, 3]");
	});

	function assertContainsNoNonReals(interval: Interval): void {
		assert.equal(interval.contains(Infinity), false);
		assert.equal(interval.contains(-Infinity), false);
		assert.equal(interval.contains(NaN), false);
	}

	test("contains", (): void => {
		const allReals: Interval = Interval.open(-Infinity, Infinity);
		assertContainsNoNonReals(allReals);
		assert.equal(allReals.contains(3), true);
		assert.equal(allReals.contains(-3), true);

		const openInterval: Interval = Interval.open(3, 5);
		assertContainsNoNonReals(openInterval);
		assert.equal(openInterval.contains(3), false);
		assert.equal(openInterval.contains(3.01), true);
		assert.equal(openInterval.contains(4), true);
		assert.equal(openInterval.contains(4.99), true);
		assert.equal(openInterval.contains(5), false);

		const closedInterval: Interval = Interval.closed(3, 5);
		assertContainsNoNonReals(closedInterval);
		assert.equal(closedInterval.contains(2.99), false);
		assert.equal(closedInterval.contains(3), true);
		assert.equal(closedInterval.contains(4), true);
		assert.equal(closedInterval.contains(5), true);
		assert.equal(closedInterval.contains(5.01), false);

		assertContainsNoNonReals(Interval.EMPTY);
		assert.equal(Interval.EMPTY.contains(3), false);
		assert.equal(Interval.EMPTY.contains(-3), false);

		const interval1: Interval = new Interval("[", 3, 5, ")");
		assertContainsNoNonReals(interval1);
		assert.equal(interval1.contains(2.99), false);
		assert.equal(interval1.contains(3), true);
		assert.equal(interval1.contains(4), true);
		assert.equal(interval1.contains(4.99), true);
		assert.equal(interval1.contains(5), false);

		const interval2: Interval = new Interval("(", 3, 5, "]");
		assertContainsNoNonReals(interval2);
		assert.equal(interval2.contains(3), false);
		assert.equal(interval2.contains(3.01), true);
		assert.equal(interval2.contains(4), true);
		assert.equal(interval2.contains(5), true);
		assert.equal(interval2.contains(5.01), false);

		const interval3: Interval = new Interval("(", -Infinity, 5, "]");
		assertContainsNoNonReals(interval3);
		assert.equal(interval3.contains(-9999), true);
		assert.equal(interval3.contains(2), true);
		assert.equal(interval3.contains(5), true);
		assert.equal(interval3.contains(5.01), false);

		const interval4: Interval = new Interval("[", 3, Infinity, ")");
		assertContainsNoNonReals(interval4);
		assert.equal(interval4.contains(2.99), false);
		assert.equal(interval4.contains(3), true);
		assert.equal(interval4.contains(5), true);
		assert.equal(interval4.contains(9999), true);
	});

	test("equals", (): void => {
		assert.ok(Interval.EMPTY.equals(new Interval("(", 3, 3, ")")));
		assert.ok(Interval.open(3, 5).equals(new Interval("(", 3, 5, ")")));
		assert.ok(Interval.closed(3, 5).equals(new Interval("[", 3, 5, "]")));
		assert.ok(Interval.open(-Infinity, Infinity).equals(new Interval("(", -Infinity, Infinity, ")")));
		assert.ok(Interval.open(-Infinity, 5).equals(new Interval("(", -Infinity, 5, ")")));
		assert.ok(Interval.open(3, Infinity).equals(new Interval("(", 3, Infinity, ")")));
		assert.ok(new Interval("[", 3, 5, ")").equals(new Interval("[", 3, 5, ")")));
		assert.ok(new Interval("(", 3, 5, "]").equals(new Interval("(", 3, 5, "]")));

		assert.ok(!Interval.open(3, 5).equals(Interval.closed(3, 5)));
		assert.ok(!Interval.open(3, 5).equals(new Interval("(", 3, 5, "]")));
		assert.ok(!Interval.open(3, 5).equals(new Interval("[", 3, 5, ")")));
		assert.ok(!Interval.closed(3, 5).equals(Interval.open(3, 5)));
		assert.ok(!Interval.closed(3, 5).equals(new Interval("(", 3, 5, "]")));
		assert.ok(!Interval.closed(3, 5).equals(new Interval("[", 3, 5, ")")));
		assert.ok(!Interval.open(-Infinity, Infinity).equals(Interval.EMPTY));
		assert.ok(!Interval.closed(3, 3).equals(Interval.EMPTY));
	});

	test("intersects", (): void => {
		assert.ok(Interval.closed(3, 5).intersects(Interval.closed(3, 5)));
		assert.ok(Interval.closed(3, 6).intersects(Interval.open(5, 9)));
		assert.ok(Interval.closed(3, 6).intersects(Interval.closed(6, 9)));
		assert.ok(Interval.closed(3, 3).intersects(Interval.closed(3, 4)));

		assert.ok(!Interval.open(-Infinity, Infinity).intersects(Interval.EMPTY));
		assert.ok(!Interval.closed(3, 4).intersects(Interval.open(4, 5)));
		assert.ok(!Interval.closed(3, 4).intersects(Interval.open(2, 3)));
	});

	test("isSubsetOrEqual", (): void => {
		assert.ok(Interval.closed(3, 5).isSubsetOrEqual(Interval.closed(3, 5)));
		assert.ok(Interval.closed(3, 5).isSubsetOrEqual(Interval.open(3, 5)));
		assert.ok(Interval.open(-Infinity, Infinity).isSubsetOrEqual(Interval.closed(3, 5)));
		assert.ok(Interval.closed(3, 5).isSubsetOrEqual(Interval.closed(3, 3)));
		assert.ok(Interval.closed(3, 3).isSubsetOrEqual(Interval.EMPTY));
		assert.ok(Interval.EMPTY.isSubsetOrEqual(Interval.EMPTY));
		assert.ok(Interval.open(-Infinity, Infinity).isSubsetOrEqual(Interval.open(-Infinity, Infinity)));
		assert.ok(Interval.open(-Infinity, Infinity).isSubsetOrEqual(Interval.open(-Infinity, 33)));
		assert.ok(Interval.open(-Infinity, Infinity).isSubsetOrEqual(Interval.open(-33, Infinity)));
		assert.ok(Interval.open(3, 5).isSubsetOrEqual(Interval.open(4, 5)));

		assert.ok(!Interval.open(3, 5).isSubsetOrEqual(Interval.closed(3, 5)));
		assert.ok(!Interval.EMPTY.isSubsetOrEqual(Interval.closed(3, 3)));
		assert.ok(!Interval.closed(3, 5).isSubsetOrEqual(Interval.closed(2, 4)));
		assert.ok(!Interval.closed(3, 5).isSubsetOrEqual(Interval.closed(4, 6)));
		assert.ok(!Interval.open(3, 5).isSubsetOrEqual(Interval.closed(4, 5)));
	});

	test("isStrictSubset", (): void => {
		assert.ok(Interval.closed(3, 5).isStrictSubset(Interval.open(3, 5)));
		assert.ok(Interval.open(-Infinity, Infinity).isStrictSubset(Interval.closed(3, 5)));
		assert.ok(Interval.closed(3, 5).isStrictSubset(Interval.closed(3, 3)));
		assert.ok(Interval.closed(3, 3).isStrictSubset(Interval.EMPTY));
		assert.ok(Interval.open(-Infinity, Infinity).isStrictSubset(Interval.open(-Infinity, 33)));
		assert.ok(Interval.open(-Infinity, Infinity).isStrictSubset(Interval.open(-33, Infinity)));
		assert.ok(Interval.open(3, 5).isStrictSubset(Interval.open(4, 5)));

		assert.ok(!Interval.closed(3, 5).isStrictSubset(Interval.closed(3, 5)));
		assert.ok(!Interval.EMPTY.isStrictSubset(Interval.EMPTY));
		assert.ok(!Interval.open(-Infinity, Infinity).isStrictSubset(Interval.open(-Infinity, Infinity)));
		assert.ok(!Interval.open(3, 5).isStrictSubset(Interval.closed(3, 5)));
		assert.ok(!Interval.EMPTY.isStrictSubset(Interval.closed(3, 3)));
		assert.ok(!Interval.closed(3, 5).isStrictSubset(Interval.closed(2, 4)));
		assert.ok(!Interval.closed(3, 5).isStrictSubset(Interval.closed(4, 6)));
		assert.ok(!Interval.open(3, 5).isStrictSubset(Interval.closed(4, 5)));
	});

	test("isEmpty", (): void => {
		assert.equal(Interval.EMPTY.isEmpty, true);
		assert.equal(Interval.open(3, 5).isEmpty, false);
		assert.equal(Interval.closed(3, 5).isEmpty, false);
		assert.equal(Interval.open(-Infinity, Infinity).isEmpty, false);
		assert.equal(new Interval("[", 3, 5, ")").isEmpty, false);
		assert.equal(new Interval("(", 3, 5, "]").isEmpty, false);
		assert.equal(new Interval("(", -Infinity, 5, "]").isEmpty, false);
		assert.equal(new Interval("[", 3, Infinity, ")").isEmpty, false);
	});

	test("min", (): void => {
		assert.equal(Interval.EMPTY.min, null);
		assert.equal(Interval.open(3, 5).min, 3);
		assert.equal(Interval.closed(3, 5).min, 3);
		assert.equal(Interval.open(-Infinity, Infinity).min, -Infinity);
		assert.equal(new Interval("[", 3, 5, ")").min, 3);
		assert.equal(new Interval("(", 3, 5, "]").min, 3);
		assert.equal(new Interval("(", -Infinity, 5, "]").min, -Infinity);
		assert.equal(new Interval("[", 3, Infinity, ")").min, 3);
	});

	test("max", (): void => {
		assert.equal(Interval.EMPTY.max, null);
		assert.equal(Interval.open(3, 5).max, 5);
		assert.equal(Interval.closed(3, 5).max, 5);
		assert.equal(Interval.open(-Infinity, Infinity).max, Infinity);
		assert.equal(new Interval("[", 3, 5, ")").max, 5);
		assert.equal(new Interval("(", 3, 5, "]").max, 5);
		assert.equal(new Interval("(", -Infinity, 5, "]").max, 5);
		assert.equal(new Interval("[", 3, Infinity, ")").max, Infinity);
	});

	test("isLeftClosed", (): void => {
		assert.equal(Interval.EMPTY.isLeftClosed, false);
		assert.equal(Interval.open(3, 5).isLeftClosed, false);
		assert.equal(Interval.closed(3, 5).isLeftClosed, true);
		assert.equal(Interval.open(-Infinity, Infinity).isLeftClosed, false);
		assert.equal(new Interval("[", 3, 5, ")").isLeftClosed, true);
		assert.equal(new Interval("(", 3, 5, "]").isLeftClosed, false);
		assert.equal(new Interval("(", -Infinity, 5, "]").isLeftClosed, false);
		assert.equal(new Interval("[", 3, Infinity, ")").isLeftClosed, true);
	});

	test("isRightClosed", (): void => {
		assert.equal(Interval.EMPTY.isRightClosed, false);
		assert.equal(Interval.open(3, 5).isRightClosed, false);
		assert.equal(Interval.closed(3, 5).isRightClosed, true);
		assert.equal(Interval.open(-Infinity, Infinity).isRightClosed, false);
		assert.equal(new Interval("[", 3, 5, ")").isRightClosed, false);
		assert.equal(new Interval("(", 3, 5, "]").isRightClosed, true);
		assert.equal(new Interval("(", -Infinity, 5, "]").isRightClosed, true);
		assert.equal(new Interval("[", 3, Infinity, ")").isRightClosed, false);
	});

	test("isClosed", (): void => {
		assert.equal(Interval.EMPTY.isClosed, false);
		assert.equal(Interval.open(3, 5).isClosed, false);
		assert.equal(Interval.closed(3, 5).isClosed, true);
		assert.equal(Interval.open(-Infinity, Infinity).isClosed, false);
		assert.equal(new Interval("[", 3, 5, ")").isClosed, false);
		assert.equal(new Interval("(", 3, 5, "]").isClosed, false);
		assert.equal(new Interval("(", -Infinity, 5, "]").isClosed, false);
		assert.equal(new Interval("[", 3, Infinity, ")").isClosed, false);
	});

	test("toString", (): void => {
		assert.equal(Interval.EMPTY.toString(), "∅");
		assert.equal(Interval.open(3, 5).toString(), "(3, 5)");
		assert.equal(Interval.closed(3, 5).toString(), "[3, 5]");
		assert.equal(Interval.open(-Infinity, Infinity).toString(), "(-Infinity, Infinity)");
		assert.equal(new Interval("[", 3, 5, ")").toString(), "[3, 5)");
		assert.equal(new Interval("(", 3, 5, "]").toString(), "(3, 5]");
		assert.equal(new Interval("(", -Infinity, 5, "]").toString(), "(-Infinity, 5]");
		assert.equal(new Interval("[", 3, Infinity, ")").toString(), "[3, Infinity)");
	});

});

function assertInterval(actual: Interval, expectedStr: string): void {
	assert.equal(actual.toString(), expectedStr);
}
