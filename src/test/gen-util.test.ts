import assert from "node:assert/strict";
import test, {describe as suite} from "node:test";
import {between, collapse, isClosedInterval, isInterval, isValue, minusProps, padNumber, propsEq, range} from "../main/gen-util.js";

suite("General utilities", (): void => {

	test("isValue", (): void => {
		assert.equal(isValue(undefined), false);
		assert.equal(isValue(null), false);

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

	test("between", (): void => {
		assert.equal(between(4, 3, 5), true);
		assert.equal(between(3, 3, 3), true);
		assert.equal(between(2, 3, 5), false);
		assert.equal(between(6, 3, 5), false);
		assert.equal(between(0, -Infinity, Infinity), true);
	});

	test("range", (): void => {
		assert.deepEqual(range(0, 5), [0, 1, 2, 3, 4, 5]);
		assert.deepEqual(range(-3, 3), [-3, -2, -1, 0, 1, 2, 3]);
		assert.deepEqual(range(3, 6.6), [3, 4, 5, 6]);
		assert.deepEqual(range(3.2, 6.2), [3.2, 4.2, 5.2, 6.2]);
		assert.deepEqual(range(3.2, 6.1), [3.2, 4.2, 5.2]);
		assert.deepEqual(range(3.2, 6.7, 0.5), [3.2, 3.7, 4.2, 4.7, 5.2, 5.7, 6.2, 6.7]);
		assert.deepEqual(range(3.2, 6.6, 0.5), [3.2, 3.7, 4.2, 4.7, 5.2, 5.7, 6.2]);
	});

	test("isInterval", (): void => {
		assert.equal(isInterval(undefined), false);
		assert.equal(isInterval(null), false);
		assert.equal(isInterval(3), false);
		assert.equal(isInterval({}), false);
		assert.equal(isInterval({min: 3}), true);
		assert.equal(isInterval({max: 3}), true);
		assert.equal(isInterval({min: 3, max: 5.5}), true);
		assert.equal(isInterval({min: 3, max: 5, foo: 7}), true);
		assert.equal(isInterval({min: "foo"}), false);
		assert.equal(isInterval({min: NaN}), false);
		assert.equal(isInterval({min: 3, max: NaN}), false);
		assert.equal(isInterval({min: 3, max: 2}), false);
	});

	test("isClosedInterval", (): void => {
		assert.equal(isClosedInterval({min: 3}), false);
		assert.equal(isClosedInterval({max: 5}), false);
		assert.equal(isClosedInterval({min: -Infinity, max: 5}), false);
		assert.equal(isClosedInterval({min: 4, max: Infinity}), false);
		assert.equal(isClosedInterval({min: Infinity, max: Infinity}), false);
		assert.equal(isClosedInterval({min: 3, max: 5}), true);
	});

	test("collapse", (): void => {
		assert.equal(collapse("foo"), "foo");
		assert.equal(collapse("\n  foo  \t "), "foo");
		assert.equal(collapse("\n  foo\f\t\nbar  \t "), "foo bar");
	});

	test("padNumber", (): void => {
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

	test("propsEq", (): void => {
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

	test("minusProps", (): void => {
		const OBJ: object = {foo: 3, bar: "apple", baz: undefined};
		assert.deepEqual(minusProps(OBJ, []), OBJ);
		assert.deepEqual(minusProps(OBJ, ["blech"]), OBJ);
		assert.deepEqual(minusProps(OBJ, ["foo"]), {bar: "apple", baz: undefined});
		assert.deepEqual(minusProps(OBJ, ["baz"]), {foo: 3, bar: "apple"});
		assert.deepEqual(minusProps(OBJ, ["foo", "dirt", "baz"]), {bar: "apple"});
		assert.deepEqual(minusProps(OBJ, ["foo", "bar", "baz"]), {});
	});

});
