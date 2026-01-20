import assert from "node:assert/strict";
import test, {suite} from "node:test";
import {
	between,
	cartesianProduct,
	collapse,
	isValue,
	minusProps,
	padNumber,
	propsEq,
	range,
	requireNonNullish,
	throwInExpr
} from "../main/main.js";

suite("main", (): void => {

	suite("isValue()", (): void => {

		test("nullish", (): void => {
			assert.equal(isValue(undefined), false);
			assert.equal(isValue(null), false);
		});

		test("non-nullish", (): void => {
			assert.equal(isValue(true), true);
			assert.equal(isValue(false), true);
			assert.equal(isValue(3), true);
			assert.equal(isValue(0), true);
			assert.equal(isValue(Infinity), true);
			assert.equal(isValue(NaN), true);
			assert.equal(isValue("foo"), true);
			assert.equal(isValue(""), true);
			assert.equal(isValue(Symbol()), true);
			assert.equal(isValue([3]), true);
			assert.equal(isValue([]), true);
			assert.equal(isValue({foo: 3}), true);
			assert.equal(isValue({}), true);
			assert.equal(isValue(new Promise<null>((resolve) => {resolve(null);})), true);
		});

	});

	suite("requireNonNullish()", (): void => {

		test("nullish", (): void => {
			assert.throws(() => {requireNonNullish(undefined);});
			assert.throws(() => {requireNonNullish(null);});
		});

		test("non-nullish", (): void => {
			assert.equal(requireNonNullish(true), true);
			assert.equal(requireNonNullish(false), false);
			assert.equal(requireNonNullish(3), 3);
			assert.equal(requireNonNullish(0), 0);
			assert.equal(requireNonNullish(Infinity), Infinity);
			assert.ok(isNaN(requireNonNullish(NaN)));
			assert.equal(requireNonNullish("foo"), "foo");
			assert.equal(requireNonNullish(""), "");
			const symbol: symbol = Symbol();
			assert.equal(requireNonNullish(symbol), symbol);
			assert.deepEqual(requireNonNullish([3]), [3]);
			assert.deepEqual(requireNonNullish([]), []);
			assert.deepEqual(requireNonNullish({foo: 3}), {foo: 3});
			assert.deepEqual(requireNonNullish({}), {});
			const promise: Promise<null> = new Promise((resolve) => {resolve(null);});
			assert.equal(requireNonNullish(promise), promise);
		});

	});

	suite("between()", (): void => {

		test("simple", (): void => {
			assert.equal(between(4, 3, 5), true);
			assert.equal(between(3, 3, 3), true);
			assert.equal(between(2, 3, 5), false);
			assert.equal(between(6, 3, 5), false);
			assert.equal(between(0, -Infinity, Infinity), true);
		});

	});

	suite("range()", (): void => {

		test("simple", (): void => {
			assert.deepEqual(range(0, 5), [0, 1, 2, 3, 4, 5]);
			assert.deepEqual(range(-3, 3), [-3, -2, -1, 0, 1, 2, 3]);
		});

		test("non-integers", (): void => {
			assert.deepEqual(range(3, 6.6), [3, 4, 5, 6]);
			assert.deepEqual(range(3.2, 6.2), [3.2, 4.2, 5.2, 6.2]);
			assert.deepEqual(range(3.2, 6.1), [3.2, 4.2, 5.2]);
		});

		test("custom step", (): void => {
			assert.deepEqual(range(3.2, 6.7, 0.5), [3.2, 3.7, 4.2, 4.7, 5.2, 5.7, 6.2, 6.7]);
			assert.deepEqual(range(3.2, 6.6, 0.5), [3.2, 3.7, 4.2, 4.7, 5.2, 5.7, 6.2]);
		});

	});

	suite("collapse()", (): void => {

		test("simple", (): void => {
			assert.equal(collapse("foo"), "foo");
			assert.equal(collapse("\n  foo  \t "), "foo");
			assert.equal(collapse("\n  foo\f\t\nbar  \t "), "foo bar");
		});

	});

	suite("[deprecated] padNumber()", (): void => {

		test("simple", (): void => {
			assert.equal(padNumber(3, 0), "3");
			assert.equal(padNumber(3, 1), "3");
			assert.equal(padNumber(3, 2), "03");
			assert.equal(padNumber(25, 1), "25");
			assert.equal(padNumber(25, 2), "25");
			assert.equal(padNumber(25, 3), "025");
			assert.equal(padNumber(25, 7), "0000025");
			assert.equal(padNumber(7.93, 3), "7.93");
			assert.equal(padNumber(7.93, 4), "7.93");
			assert.equal(padNumber(7.93, 5), "07.93");
			assert.equal(padNumber(7.93, 9), "000007.93");
		});

		test("custom pad character", (): void => {
			assert.equal(padNumber(7.93, 9, "0"), "000007.93");
			assert.equal(padNumber(7.93, 9, " "), "     7.93");
			assert.equal(padNumber(7.93, 7, "\u2022"), "\u2022\u2022\u20227.93");
			assert.throws(() => {padNumber(7.93, 9, "");});
			assert.throws(() => {padNumber(7.93, 9, "fo");});
		});

	});

	suite("propsEq()", (): void => {

		test("simple", (): void => {
			const OBJ: object = {foo: 3, bar: "apple", baz: undefined};
			assert.deepEqual(propsEq(OBJ, {}), true);
			assert.deepEqual(propsEq(OBJ, OBJ), true);
			assert.deepEqual(propsEq(OBJ, {foo: 3}), true);
			assert.deepEqual(propsEq(OBJ, {foo: 5}), false);
			assert.deepEqual(propsEq(OBJ, {nope: 3}), false);
			assert.deepEqual(propsEq(OBJ, {foo: 3, bar: 4}), false);
			assert.deepEqual(propsEq(OBJ, {foo: 3, zee: 9}), false);
			assert.deepEqual(propsEq(OBJ, {baz: undefined}), true);
			assert.deepEqual(propsEq(OBJ, {baz: null}), false);
			assert.deepEqual(propsEq(OBJ, {zee: undefined}), false);
		});

	});

	suite("cartesianProduct()", (): void => {

		test("0 arrays", (): void => {
			assert.deepEqual(cartesianProduct(), [[]]);
		});

		test("empty array", (): void => {
			assert.deepEqual(cartesianProduct([]), []);
		});

		test("2 arrays but one is empty", (): void => {
			assert.deepEqual(cartesianProduct([1, 2, 3], []), []);
		});

		test("1 array", (): void => {
			assert.deepEqual(cartesianProduct([1, 2, 3]), [[1], [2], [3]]);
		});

		test("2 arrays", (): void => {
			assert.deepEqual(cartesianProduct([1, 2, 3], ["a", "b", "c"]), [
				[1, "a"], [1, "b"], [1, "c"],
				[2, "a"], [2, "b"], [2, "c"],
				[3, "a"], [3, "b"], [3, "c"]
			]);
		});

		test("3 arrays", (): void => {
			assert.deepEqual(cartesianProduct([1, 2], ["a", "b"], [true, false]), [
				[1, "a", true], [1, "a", false],
				[1, "b", true], [1, "b", false],
				[2, "a", true], [2, "a", false],
				[2, "b", true], [2, "b", false]
			]);
		});

	});

	suite("minusProps()", (): void => {

		test("simple", (): void => {
			const OBJ: object = {foo: 3, bar: "apple", baz: undefined};
			assert.deepEqual(minusProps(OBJ, []), OBJ);
			assert.deepEqual(minusProps(OBJ, ["blech"]), OBJ);
			assert.deepEqual(minusProps(OBJ, ["foo"]), {bar: "apple", baz: undefined});
			assert.deepEqual(minusProps(OBJ, ["baz"]), {foo: 3, bar: "apple"});
			assert.deepEqual(minusProps(OBJ, ["foo", "dirt", "baz"]), {bar: "apple"});
			assert.deepEqual(minusProps(OBJ, ["foo", "bar", "baz"]), {});
		});

	});

	suite("throwInExpr()", (): void => {

		test("simple", (): void => {
			let value: string = "foo";
			assert.throws(() => {
				value = throwInExpr(new RangeError());
			}, RangeError);
			assert.equal(value, "foo");
		});

	});

});
