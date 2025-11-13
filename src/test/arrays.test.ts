/* eslint-disable no-sparse-arrays */

import assert from "node:assert/strict";
import test, {suite} from "node:test";
import Arrays from "../main/arrays.js";

suite("Arrays", (): void => {

	suite("equals()", (): void => {

		test("simple", (): void => {
			assert.equal(Arrays.equals([], []), true);
			assert.equal(Arrays.equals([1, 2, 4, 7], [1, 2, 4, 7]), true);
			assert.equal(Arrays.equals([1, 2, 4, 7], [1, 2, 4]), false);
			assert.equal(Arrays.equals(["foo", "bar", "baz"], ["foo", "bar", "baz"]), true);
			assert.equal(Arrays.equals(["foo", "bar", "baz"], ["foo", "bar"]), false);
			assert.equal(Arrays.equals([1, 2, 4, 7], [1, 2, 4, 0]), false);
			assert.equal(Arrays.equals([{}], [{}]), false);
			assert.equal(Arrays.equals([], [undefined]), false);
			assert.equal(Arrays.equals([NaN], [NaN]), false);
		});

		test("not strict", (): void => {
			assert.equal(Arrays.equals<string | number>([1, 2, 4, 7], ["1", "2", "4", "7"]), true);
			assert.equal(Arrays.equals([null], [undefined]), true);
		});

		test("sparse arrays", (): void => {
			assert.equal(Arrays.equals(new Array(1), new Array(1)), true);
			assert.equal(Arrays.equals(new Array(1), []), false);
			assert.equal(Arrays.equals(new Array(1), [undefined]), false);
			assert.equal(Arrays.equals(new Array(1), new Array(2)), false);
		});

	});

	suite("strictEquals()", (): void => {

		test("simple", (): void => {
			assert.equal(Arrays.strictEquals([], []), true);
			assert.equal(Arrays.strictEquals([1, 2, 4, 7], [1, 2, 4, 7]), true);
			assert.equal(Arrays.strictEquals([1, 2, 4, 7], [1, 2, 4]), false);
			assert.equal(Arrays.strictEquals(["foo", "bar", "baz"], ["foo", "bar", "baz"]), true);
			assert.equal(Arrays.strictEquals(["foo", "bar", "baz"], ["foo", "bar"]), false);
			assert.equal(Arrays.strictEquals([1, 2, 4, 7], [1, 2, 4, 0]), false);
			assert.equal(Arrays.strictEquals([{}], [{}]), false);
			assert.equal(Arrays.strictEquals([], [undefined]), false);
			assert.equal(Arrays.strictEquals([NaN], [NaN]), false);
		});

		test("is strict", (): void => {
			assert.equal(Arrays.strictEquals<string | number>([1, 2, 4, 7], ["1", "2", "4", "7"]), false);
			assert.equal(Arrays.strictEquals([null], [undefined]), false);
		});

		test("sparse arrays", (): void => {
			assert.equal(Arrays.strictEquals(new Array(1), new Array(1)), true);
			assert.equal(Arrays.strictEquals(new Array(1), []), false);
			assert.equal(Arrays.strictEquals(new Array(1), [undefined]), false);
			assert.equal(Arrays.strictEquals(new Array(1), new Array(2)), false);
		});
	});

	suite("indexOfSubarray()", (): void => {

		test("simple", (): void => {
			assert.equal(Arrays.indexOfSubarray([], []), 0);
			assert.equal(Arrays.indexOfSubarray([], [0]), -1);
			assert.equal(Arrays.indexOfSubarray([2, 3, 5, 7, 11], [2, 3, 5, 7, 11]), 0);
			assert.equal(Arrays.indexOfSubarray([2, 3, 5, 7, 11], [2, 3, 5]), 0);
			assert.equal(Arrays.indexOfSubarray([2, 3, 5, 7, 11], [5, 7]), 2);
			assert.equal(Arrays.indexOfSubarray([2, 3, 5, 7, 11], [1]), -1);
			assert.equal(Arrays.indexOfSubarray([2, 3, 5, 7, 11], [2, 3, 5, 7, 11, undefined]), -1);
			assert.equal(Arrays.indexOfSubarray([2, 3, 5, 7, 11], [5, 3]), -1);
			assert.equal(Arrays.indexOfSubarray([2, 3, 5, 7, 11], [3, 5, 8]), -1);
			assert.equal(Arrays.indexOfSubarray([2, 3, 5, 7, 11], [11, 12]), -1);
			assert.equal(Arrays.indexOfSubarray([2, 3, 5, 7, 11], [11]), 4);
			assert.equal(Arrays.indexOfSubarray<string | number>([2, 3, 5, 7, 11], ["11"]), -1);
			assert.equal(Arrays.indexOfSubarray(["foo", null, undefined, 0, Infinity], ["foo", null, undefined, 0, Infinity]), 0);
			assert.equal(Arrays.indexOfSubarray([{}], [{}]), -1);
		});

		test("searches forward", (): void => {
			assert.equal(Arrays.indexOfSubarray([2, 3, 5, 7, 11], []), 0);
			assert.equal(Arrays.indexOfSubarray([1, 1, 1, 1], [1, 1]), 0);
			assert.equal(Arrays.indexOfSubarray([1, 2, 1, 2, 3, 1, 2, 3, 3], [2, 3]), 3);
		});

		test("fromIndex", (): void => {
			assert.equal(Arrays.indexOfSubarray([1, 2, 1, 2, 3, 1, 2, 3, 3], [1, 2]), 0);
			assert.equal(Arrays.indexOfSubarray([1, 2, 1, 2, 3, 1, 2, 3, 3], [1, 2], 1), 2);
			assert.equal(Arrays.indexOfSubarray([1, 2, 1, 2, 3, 1, 2, 3, 3], [1, 2], 2), 2);
			assert.equal(Arrays.indexOfSubarray([1, 2, 1, 2, 3, 1, 2, 3, 3], [1, 2], 3), 5);
			assert.equal(Arrays.indexOfSubarray([1, 2, 1, 2, 3, 1, 2, 3, 3], [1, 2], 5), 5);
			assert.equal(Arrays.indexOfSubarray([1, 2, 1, 2, 3, 1, 2, 3, 3], [1, 2], 6), -1);
			assert.equal(Arrays.indexOfSubarray([1, 2, 1, 2, 3, 1, 2, 3, 3], [3], -1), 8);
			assert.equal(Arrays.indexOfSubarray([1, 2, 1, 2, 3, 1, 2, 3, 3], [3], -3), 7);
			assert.equal(Arrays.indexOfSubarray([1, 2, 1, 2, 3, 1, 2, 3, 3], [1, 2], -9), 0);
			assert.equal(Arrays.indexOfSubarray([0, 0, 4], [4], -1), 2);
		});

		test("sparse arrays", (): void => {
			assert.equal(Arrays.indexOfSubarray(new Array(6), new Array(3)), 0);
			assert.equal(Arrays.indexOfSubarray(new Array(6), new Array(6)), 0);
			assert.equal(Arrays.indexOfSubarray(new Array(6), new Array(7)), -1);
			assert.equal(Arrays.indexOfSubarray([1, , , 2, 3, , 2], new Array(1)), 1);
			assert.equal(Arrays.indexOfSubarray([1, , , 2, 3, , 2], [, 2]), 2);
			assert.equal(Arrays.indexOfSubarray([1, , , 2, 3, , 2], [, 2], 3), 5);
			assert.equal(Arrays.indexOfSubarray([1, 2, 3], new Array(1)), -1);
		});

	});

	suite("lastIndexOfSubarray()", (): void => {

		test("simple", (): void => {
			assert.equal(Arrays.lastIndexOfSubarray([], []), 0);
			assert.equal(Arrays.lastIndexOfSubarray([], [0]), -1);
			assert.equal(Arrays.lastIndexOfSubarray([2, 3, 5, 7, 11], [2, 3, 5, 7, 11]), 0);
			assert.equal(Arrays.lastIndexOfSubarray([2, 3, 5, 7, 11], [2, 3, 5]), 0);
			assert.equal(Arrays.lastIndexOfSubarray([2, 3, 5, 7, 11], [5, 7]), 2);
			assert.equal(Arrays.lastIndexOfSubarray([2, 3, 5, 7, 11], [1]), -1);
			assert.equal(Arrays.lastIndexOfSubarray([2, 3, 5, 7, 11], [2, 3, 5, 7, 11, undefined]), -1);
			assert.equal(Arrays.lastIndexOfSubarray([2, 3, 5, 7, 11], [5, 3]), -1);
			assert.equal(Arrays.lastIndexOfSubarray([2, 3, 5, 7, 11], [3, 5, 8]), -1);
			assert.equal(Arrays.lastIndexOfSubarray([2, 3, 5, 7, 11], [11, 12]), -1);
			assert.equal(Arrays.lastIndexOfSubarray([2, 3, 5, 7, 11], [11]), 4);
			assert.equal(Arrays.lastIndexOfSubarray<string | number>([2, 3, 5, 7, 11], ["11"]), -1);
			assert.equal(Arrays.lastIndexOfSubarray(["foo", null, undefined, 0, Infinity], ["foo", null, undefined, 0, Infinity]), 0);
			assert.equal(Arrays.lastIndexOfSubarray([{}], [{}]), -1);
		});

		test("searches backward", (): void => {
			assert.equal(Arrays.lastIndexOfSubarray([2, 3, 5, 7, 11], []), 5);
			assert.equal(Arrays.lastIndexOfSubarray([1, 1, 1, 1], [1, 1]), 2);
			assert.equal(Arrays.lastIndexOfSubarray([1, 2, 1, 2, 3, 1, 2, 3, 3], [2, 3]), 6);
		});

		test("fromIndex", (): void => {
			assert.equal(Arrays.lastIndexOfSubarray([1, 2, 1, 2, 3, 1, 2, 3, 3], [1, 2]), 5);
			assert.equal(Arrays.lastIndexOfSubarray([1, 2, 1, 2, 3, 1, 2, 3, 3], [1, 2], 1), 0);
			assert.equal(Arrays.lastIndexOfSubarray([1, 2, 1, 2, 3, 1, 2, 3, 3], [1, 2], 2), 2);
			assert.equal(Arrays.lastIndexOfSubarray([1, 2, 1, 2, 3, 1, 2, 3, 3], [1, 2], 3), 2);
			assert.equal(Arrays.lastIndexOfSubarray([1, 2, 1, 2, 3, 1, 2, 3, 3], [1, 2], 5), 5);
			assert.equal(Arrays.lastIndexOfSubarray([1, 2, 1, 2, 3, 1, 2, 3, 3], [1, 2], 6), 5);
			assert.equal(Arrays.lastIndexOfSubarray([1, 2, 1, 2, 3, 1, 2, 3, 3], [3]), 8);
			assert.equal(Arrays.lastIndexOfSubarray([1, 2, 1, 2, 3, 1, 2, 3, 3], [3], 0), -1);
			assert.equal(Arrays.lastIndexOfSubarray([1, 2, 1, 2, 3, 1, 2, 3, 3], [3], -1), 8);
			assert.equal(Arrays.lastIndexOfSubarray([1, 2, 1, 2, 3, 1, 2, 3, 3], [3], -3), 4);
			assert.equal(Arrays.lastIndexOfSubarray([1, 2, 1, 2, 3, 1, 2, 3, 3], [1, 2], -9), 0);
		});

		test("sparse arrays", (): void => {
			assert.equal(Arrays.lastIndexOfSubarray(new Array(6), new Array(3)), 3);
			assert.equal(Arrays.lastIndexOfSubarray(new Array(6), new Array(6)), 0);
			assert.equal(Arrays.lastIndexOfSubarray(new Array(6), new Array(7)), -1);
			assert.equal(Arrays.lastIndexOfSubarray([1, , , 2, 3, , 2], new Array(1)), 5);
			assert.equal(Arrays.lastIndexOfSubarray([1, , , 2, 3, , 2], [, 2]), 5);
			assert.equal(Arrays.lastIndexOfSubarray([1, , , 2, 3, , 2], [, 2], 3), 2);
			assert.equal(Arrays.lastIndexOfSubarray([1, 2, 3], new Array(1)), -1);
		});

	});

	suite("includesSubarray()", (): void => {

		test("simple", (): void => {
			assert.equal(Arrays.includesSubarray([], []), true);
			assert.equal(Arrays.includesSubarray([], [0]), false);
			assert.equal(Arrays.includesSubarray([2, 3, 5, 7, 11], [2, 3, 5, 7, 11]), true);
			assert.equal(Arrays.includesSubarray([2, 3, 5, 7, 11], [2, 3, 5]), true);
			assert.equal(Arrays.includesSubarray([2, 3, 5, 7, 11], [5, 7]), true);
			assert.equal(Arrays.includesSubarray([2, 3, 5, 7, 11], [1]), false);
			assert.equal(Arrays.includesSubarray([2, 3, 5, 7, 11], [2, 3, 5, 7, 11, undefined]), false);
			assert.equal(Arrays.includesSubarray([2, 3, 5, 7, 11], [5, 3]), false);
			assert.equal(Arrays.includesSubarray([2, 3, 5, 7, 11], [3, 5, 8]), false);
			assert.equal(Arrays.includesSubarray([2, 3, 5, 7, 11], [11, 12]), false);
			assert.equal(Arrays.includesSubarray([2, 3, 5, 7, 11], [11]), true);
			assert.equal(Arrays.includesSubarray<string | number>([2, 3, 5, 7, 11], ["11"]), false);
			assert.equal(Arrays.includesSubarray(["foo", null, undefined, 0, Infinity], ["foo", null, undefined, 0, Infinity]), true);
			assert.equal(Arrays.includesSubarray([{}], [{}]), false);
		});

		test("included for consistency", (): void => {
			assert.equal(Arrays.includesSubarray([2, 3, 5, 7, 11], []), true);
			assert.equal(Arrays.includesSubarray([1, 1, 1, 1], [1, 1]), true);
			assert.equal(Arrays.includesSubarray([1, 2, 1, 2, 3, 1, 2, 3, 3], [2, 3]), true);
		});

		test("fromIndex", (): void => {
			assert.equal(Arrays.includesSubarray([1, 2, 1, 2, 3, 1, 2, 3, 3], [1, 2]), true);
			assert.equal(Arrays.includesSubarray([1, 2, 1, 2, 3, 1, 2, 3, 3], [1, 2], 1), true);
			assert.equal(Arrays.includesSubarray([1, 2, 1, 2, 3, 1, 2, 3, 3], [1, 2], 2), true);
			assert.equal(Arrays.includesSubarray([1, 2, 1, 2, 3, 1, 2, 3, 3], [1, 2], 3), true);
			assert.equal(Arrays.includesSubarray([1, 2, 1, 2, 3, 1, 2, 3, 3], [1, 2], 5), true);
			assert.equal(Arrays.includesSubarray([1, 2, 1, 2, 3, 1, 2, 3, 3], [1, 2], 6), false);
			assert.equal(Arrays.includesSubarray([1, 2, 1, 2, 3, 1, 2, 3, 3], [3], -1), true);
			assert.equal(Arrays.includesSubarray([1, 2, 1, 2, 3, 1, 2, 3, 3], [3], -3), true);
			assert.equal(Arrays.includesSubarray([1, 2, 1, 2, 3, 1, 2, 3, 3], [1, 2], -9), true);
			assert.equal(Arrays.includesSubarray([0, 0, 4], [4], -1), true);
		});

		test("sparse arrays", (): void => {
			assert.equal(Arrays.includesSubarray(new Array(6), new Array(3)), true);
			assert.equal(Arrays.includesSubarray(new Array(6), new Array(6)), true);
			assert.equal(Arrays.includesSubarray(new Array(6), new Array(7)), false);
			assert.equal(Arrays.includesSubarray([1, , , 2, 3, , 2], new Array(1)), true);
			assert.equal(Arrays.includesSubarray([1, , , 2, 3, , 2], [, 2]), true);
			assert.equal(Arrays.includesSubarray([1, , , 2, 3, , 2], [, 2], 3), true);
			assert.equal(Arrays.includesSubarray([1, 2, 3], new Array(1)), false);
		});

	});

	suite("startsWith()", (): void => {

		test("simple", (): void => {
			assert.equal(Arrays.startsWith([], []), true);
			assert.equal(Arrays.startsWith([], [0]), false);
			assert.equal(Arrays.startsWith([2, 3, 5, 7, 11], []), true);
			assert.equal(Arrays.startsWith([2, 3, 5, 7, 11], [2, 3, 5, 7, 11]), true);
			assert.equal(Arrays.startsWith([2, 3, 5, 7, 11], [2]), true);
			assert.equal(Arrays.startsWith([2, 3, 5, 7, 11], [2, 3, 5]), true);
			assert.equal(Arrays.startsWith([2, 3, 5, 7, 11], [3, 5]), false);
			assert.equal(Arrays.startsWith([2, 3, 5, 7, 11], [undefined]), false);
		});

		test("index", (): void => {
			assert.equal(Arrays.startsWith([2, 3, 5, 7, 11], [], 0), true);
			assert.equal(Arrays.startsWith([2, 3, 5, 7, 11], [], 1), true);
			assert.equal(Arrays.startsWith([2, 3, 5, 7, 11], [2], 1), false);
			assert.equal(Arrays.startsWith([2, 3, 5, 7, 11], [2], 3), false);
			assert.equal(Arrays.startsWith([2, 3, 5, 7, 11], [3, 5], 1), true);
			assert.equal(Arrays.startsWith([2, 3, 5, 7, 11], [11], 4), true);
			assert.equal(Arrays.startsWith([2, 3, 5, 7, 11], [3, 5], -4), true);
			assert.equal(Arrays.startsWith([2, 3, 5, 7, 11], [11], -1), true);
		});

		test("sparse arrays", (): void => {
			assert.equal(Arrays.startsWith([2, 3, 5, 7, 11], new Array(1)), false);
			assert.equal(Arrays.startsWith([, 3, 5, 7, 11], new Array(1)), true);
			assert.equal(Arrays.startsWith(new Array(3), new Array(1)), true);
			assert.equal(Arrays.startsWith(new Array(3), new Array(3)), true);
			assert.equal(Arrays.startsWith(new Array(3), new Array(4)), false);
			assert.equal(Arrays.startsWith([, 3, , 7, 11], [3, ,], 1), true);
			assert.equal(Arrays.startsWith([, 3, , 7, 11], [3, 7], 1), false);
		});

	});

	suite("endsWith()", (): void => {

		test("simple", (): void => {
			assert.equal(Arrays.endsWith([], []), true);
			assert.equal(Arrays.endsWith([], [0]), false);
			assert.equal(Arrays.endsWith([2, 3, 5, 7, 11], []), true);
			assert.equal(Arrays.endsWith([2, 3, 5, 7, 11], [2, 3, 5, 7, 11]), true);
			assert.equal(Arrays.endsWith([2, 3, 5, 7, 11], [11]), true);
			assert.equal(Arrays.endsWith([2, 3, 5, 7, 11], [5, 7, 11]), true);
			assert.equal(Arrays.endsWith([2, 3, 5, 7, 11], [5, 7]), false);
			assert.equal(Arrays.endsWith([2, 3, 5, 7, 11], [undefined]), false);
		});

		test("endIndex", (): void => {
			assert.equal(Arrays.endsWith([2, 3, 5, 7, 11], [], 0), true);
			assert.equal(Arrays.endsWith([2, 3, 5, 7, 11], [], 1), true);
			assert.equal(Arrays.endsWith([2, 3, 5, 7, 11], [11], 1), false);
			assert.equal(Arrays.endsWith([2, 3, 5, 7, 11], [11], 3), false);
			assert.equal(Arrays.endsWith([2, 3, 5, 7, 11], [2], 1), true);
			assert.equal(Arrays.endsWith([2, 3, 5, 7, 11], [3, 5], 3), true);
			assert.equal(Arrays.endsWith([2, 3, 5, 7, 11], [2], -4), true);
			assert.equal(Arrays.endsWith([2, 3, 5, 7, 11], [3, 5], -2), true);
		});

		test("sparse arrays", (): void => {
			assert.equal(Arrays.endsWith([2, 3, 5, 7, 11], new Array(1)), false);
			assert.equal(Arrays.endsWith([3, 5, 7, 11, ,], new Array(1)), true);
			assert.equal(Arrays.endsWith(new Array(3), new Array(1)), true);
			assert.equal(Arrays.endsWith(new Array(3), new Array(3)), true);
			assert.equal(Arrays.endsWith(new Array(3), new Array(4)), false);
			assert.equal(Arrays.endsWith([, 3, 8, , 11], [8, ,], -1), true);
			assert.equal(Arrays.endsWith([, 3, 8, , 11], [8], -1), false);
		});

	});

	suite("padStart()", (): void => {

		test("simple", (): void => {
			assertArrayOp(true, Arrays.padStart, [[], 0, "foo"], []);
			assertArrayOp(true, Arrays.padStart, [[], 1, "foo"], ["foo"]);
			assertArrayOp(true, Arrays.padStart, [[], 4, "foo"], ["foo", "foo", "foo", "foo"]);
			assertArrayOp(true, Arrays.padStart, [["bar", "baz"], 5, "foo"], ["foo", "foo", "foo", "bar", "baz"]);
			assertArrayOp(true, Arrays.padStart, [["bar", "baz"], 2, "foo"], ["bar", "baz"]);
		});

		test("sparse arrays", (): void => {
			assertArrayOp(true, Arrays.padStart, [new Array(3), 5, 0], [0, 0, , , ,]);
		});

	});

	suite("toPaddedStart()", (): void => {

		test("simple", (): void => {
			assertArrayOp(false, Arrays.toPaddedStart, [[], 0, "foo"], []);
			assertArrayOp(false, Arrays.toPaddedStart, [[], 1, "foo"], ["foo"]);
			assertArrayOp(false, Arrays.toPaddedStart, [[], 4, "foo"], ["foo", "foo", "foo", "foo"]);
			assertArrayOp(false, Arrays.toPaddedStart, [["bar", "baz"], 5, "foo"], ["foo", "foo", "foo", "bar", "baz"]);
			assertArrayOp(false, Arrays.toPaddedStart, [["bar", "baz"], 2, "foo"], ["bar", "baz"]);
		});

		test("sparse arrays", (): void => {
			assertArrayOp(false, Arrays.toPaddedStart, [new Array(3), 5, 0], [0, 0, , , ,]);
		});

	});

	suite("padEnd()", (): void => {

		test("simple", (): void => {
			assertArrayOp(true, Arrays.padEnd, [[], 0, "foo"], []);
			assertArrayOp(true, Arrays.padEnd, [[], 1, "foo"], ["foo"]);
			assertArrayOp(true, Arrays.padEnd, [[], 4, "foo"], ["foo", "foo", "foo", "foo"]);
			assertArrayOp(true, Arrays.padEnd, [["bar", "baz"], 5, "foo"], ["bar", "baz", "foo", "foo", "foo"]);
			assertArrayOp(true, Arrays.padEnd, [["bar", "baz"], 2, "foo"], ["bar", "baz"]);
		});

		test("sparse arrays", (): void => {
			assertArrayOp(true, Arrays.padEnd, [new Array(3), 5, 0], [, , , 0, 0]);
		});

	});

	suite("toPaddedEnd()", (): void => {

		test("simple", (): void => {
			assertArrayOp(false, Arrays.toPaddedEnd, [[], 0, "foo"], []);
			assertArrayOp(false, Arrays.toPaddedEnd, [[], 1, "foo"], ["foo"]);
			assertArrayOp(false, Arrays.toPaddedEnd, [[], 4, "foo"], ["foo", "foo", "foo", "foo"]);
			assertArrayOp(false, Arrays.toPaddedEnd, [["bar", "baz"], 5, "foo"], ["bar", "baz", "foo", "foo", "foo"]);
			assertArrayOp(false, Arrays.toPaddedEnd, [["bar", "baz"], 2, "foo"], ["bar", "baz"]);
		});

		test("sparse arrays", (): void => {
			assertArrayOp(false, Arrays.toPaddedEnd, [new Array(3), 5, 0], [, , , 0, 0]);
		});

	});

	suite("repeat()", (): void => {

		test("simple", (): void => {
			assertArrayOp(false, Arrays.repeat, [[], 0], []);
			assertArrayOp(false, Arrays.repeat, [[], 5], []);
			assertArrayOp(false, Arrays.repeat, [["foo", 6, 0], 0], []);
			assertArrayOp(false, Arrays.repeat, [["foo", 6, 0], 1], ["foo", 6, 0]);
			assertArrayOp(false, Arrays.repeat, [["foo", 6, 0], 4], ["foo", 6, 0, "foo", 6, 0, "foo", 6, 0, "foo", 6, 0]);
		});

		test("sparse arrays", (): void => {
			assertArrayOp(false, Arrays.repeat, [new Array(3), 1], new Array(3));
			assertArrayOp(false, Arrays.repeat, [new Array(3), 4], new Array(12));
			assertArrayOp(false, Arrays.repeat, [[1, 2, , , 3], 1], [1, 2, , , 3]);
			assertArrayOp(false, Arrays.repeat, [[1, 2, , , 3], 1], [1, 2, , , 3]);
			assertArrayOp(false, Arrays.repeat, [[1, 2, , , 3], 2], [1, 2, , , 3, 1, 2, , , 3]);
		});

	});

	suite("split()", (): void => {

		type Args = [unknown, number?];

		test("simple", (): void => {
			assertArrayOp<unknown, Args>(false, Arrays.split, [[], 0], [[]]);
			assertArrayOp<unknown, Args>(false, Arrays.split, [[1, 3, 5, 7], 0], [[1, 3, 5, 7]]);
			assertArrayOp<unknown, Args>(false, Arrays.split, [[1, 3, 5, 7], 3], [[1], [5, 7]]);
			assertArrayOp<unknown, Args>(false, Arrays.split, [[6, 0, 5, 5, 0, 1, 2, 0, 0, 9], 0], [[6], [5, 5], [1, 2], [], [9]]);
		});

		test("limit", (): void => {
			assertArrayOp<unknown, Args>(false, Arrays.split, [[6, 0, 5, 5, 0, 1, 2, 0, 0, 9], 0, 3], [[6], [5, 5], [1, 2]]);
			assertArrayOp<unknown, Args>(false, Arrays.split, [[6, 0, 5, 5, 0, 1, 2, 0, 0, 9], 0, 1], [[6]]);
			assertArrayOp<unknown, Args>(false, Arrays.split, [[6, 0, 5, 5, 0, 1, 2, 0, 0, 9], 0, 0], []);
		});

	});

	suite("splitByPredicate()", (): void => {

		type Args = [(value: unknown, index: number, obj: readonly unknown[]) => boolean, number?];

		test("simple", (): void => {
			assertArrayOp<unknown, Args>(false, Arrays.splitByPredicate, [[1, 2, 3, 2, 3, 2, 1], () => false], [[1, 2, 3, 2, 3, 2, 1]]);
			assertArrayOp<unknown, Args>(false, Arrays.splitByPredicate, [[1, 2, 3, 2, 3, 2, 1], (value) => value === 3], [[1, 2],  [2], [2, 1]]);
			assertArrayOp<unknown, Args>(false, Arrays.splitByPredicate, [[1, 2, 3, 2, 3, 2, 1], (_value, index) => index === 3], [[1, 2, 3],  [3, 2, 1]]);
		});

		test("limit", (): void => {
			assertArrayOp<unknown, Args>(false, Arrays.splitByPredicate, [[1, 2, 3, 2, 3, 2, 1], (value) => value === 3, 2], [[1, 2],  [2]]);
		});

		test("obj parameter", (): void => {
			const arr = [6];
			let arg3: unknown;
			Arrays.splitByPredicate(arr, (_value, _index, obj) => {
				arg3 = obj;
				return false;
			});
			assert.equal(arg3, arr);
			assert.deepEqual(arg3, [6]);
		});

	});

	suite("splitBySubarray()", (): void => {

		type Args = [unknown[], number?];

		test("simple", (): void => {
			assertArrayOp<unknown, Args>(false, Arrays.splitBySubarray, [[], []], []);
			assertArrayOp<unknown, Args>(false, Arrays.splitBySubarray, [[], [8]], [[]]);
			assertArrayOp<unknown, Args>(false, Arrays.splitBySubarray, [[1, 2, 3], []], [[1], [2], [3]]);
			assertArrayOp<unknown, Args>(false, Arrays.splitBySubarray, [[1, 2, 3], [5]], [[1, 2, 3]]);
			assertArrayOp<unknown, Args>(false, Arrays.splitBySubarray, [[1, 3, 5, 7], [5]], [[1, 3], [7]]);
			assertArrayOp<unknown, Args>(false, Arrays.splitBySubarray, [[1, 2, 3, 2, 3, 3, 2, 1, 3, 3], [3, 3]], [[1, 2, 3, 2], [2, 1], []]);
			assertArrayOp<unknown, Args>(false, Arrays.splitBySubarray, [[3, 3, 1, 2, 3, 2, 3, 3, 2, 1], [3, 3]], [[], [1, 2, 3, 2], [2, 1]]);
		});

		test("limit", (): void => {
			assertArrayOp<unknown, Args>(false, Arrays.splitBySubarray, [[6, 5, 0, 2, 0, 4, 4, 2, 0, 1, 0], [2, 0]], [[6, 5, 0], [4, 4], [1, 0]]);
			assertArrayOp<unknown, Args>(false, Arrays.splitBySubarray, [[6, 5, 0, 2, 0, 4, 4, 2, 0, 1, 0], [2, 0], 6], [[6, 5, 0], [4, 4], [1, 0]]);
			assertArrayOp<unknown, Args>(false, Arrays.splitBySubarray, [[6, 5, 0, 2, 0, 4, 4, 2, 0, 1, 0], [2, 0], 3], [[6, 5, 0], [4, 4], [1, 0]]);
			assertArrayOp<unknown, Args>(false, Arrays.splitBySubarray, [[6, 5, 0, 2, 0, 4, 4, 2, 0, 1, 0], [2, 0], 2], [[6, 5, 0], [4, 4]]);
			assertArrayOp<unknown, Args>(false, Arrays.splitBySubarray, [[6, 5, 0, 2, 0, 4, 4, 2, 0, 1, 0], [2, 0], 0], []);
		});

	});

	suite("joinArrays()", (): void => {

		test("simple", (): void => {
			assert.deepEqual(Arrays.joinArrays([], 0), []);
			assert.deepEqual(Arrays.joinArrays([[1, 2, 3]], 0), [1, 2, 3]);
			assert.deepEqual(Arrays.joinArrays([[1, 2], [3, 4, 5]], 0), [1, 2, 0, 3, 4, 5]);
			assert.deepEqual(Arrays.joinArrays([[2, 3], [5, 7], [11]], 42), [2, 3, 42, 5, 7, 42, 11]);
		});

	});

	suite("joinArraysByArray()", (): void => {

		test("simple", (): void => {
			assert.deepEqual(Arrays.joinArraysByArray([], [0]), []);
			assert.deepEqual(Arrays.joinArraysByArray([[1, 2, 3]], [0]), [1, 2, 3]);
			assert.deepEqual(Arrays.joinArraysByArray([[1, 2], [3, 4, 5]], [0]), [1, 2, 0, 3, 4, 5]);
			assert.deepEqual(Arrays.joinArraysByArray([[2, 3], [5, 7], [11]], [42]), [2, 3, 42, 5, 7, 42, 11]);
		});

		test("multi-element separator", (): void => {
			assert.deepEqual(Arrays.joinArraysByArray([], [1, 2, 3]), []);
			assert.deepEqual(Arrays.joinArraysByArray([[1]], [1, 2, 3]), [1]);
			assert.deepEqual(Arrays.joinArraysByArray([[2, 3], [5, 7], [11]], [2, 3]), [2, 3, 2, 3, 5, 7, 2, 3, 11]);
		});

	});

});

function assertArrayOp<T, A extends readonly unknown[]>(
	isMutating: boolean,
	fut: (array: T[], ...args: A) => T[],
	args: readonly [T[], ...A],
	expected: readonly T[]
): void {
	const passedArray: T[] = args[0];
	const copyOfOrigArray: T[] | undefined = isMutating ? undefined : passedArray.slice();

	const returnValue: T[] = fut(...args);

	assert.deepEqual(returnValue, expected);
	if (isMutating) {
		assert.equal(returnValue, passedArray, "mutating function should return reference to original array");
	} else {
		assert.notEqual(returnValue, passedArray, "non-mutating function should return a new array");
		assert.deepEqual(passedArray, copyOfOrigArray, "non-mutating function should not modify original array");
	}
}
