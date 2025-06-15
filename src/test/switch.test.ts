import assert from "node:assert/strict";
import test, {suite} from "node:test";
import sw, {SwitchError} from "../main/switch.js";

suite("Switch", (): void => {

	type Cases<E, R> = [
		condition: (E | ((value: E) => boolean) | typeof sw.DEFAULT),
		result: (R | ((value: E) => R))
	][];

	test("sw (basic)", (): void => {
		const cases: Cases<number, string> = [
			[1, "one"],
			[2, "two"],
			[1, "nope"]
		];
		assert.equal(sw(1, cases), "one");
		assert.equal(sw(2, cases), "two");
		assert.throws(() => {sw(3, cases);}, SwitchError);
	});

	test("sw (default)", (): void => {
		const cases: Cases<number, string> = [
			[1, "one"],
			[2, "two"],
			[sw.DEFAULT, "default"],
			[3, "three"]
		];
		assert.equal(sw(1, cases), "one");
		assert.equal(sw(49, cases), "default");
		assert.equal(sw(3, cases), "default");
	});

	test("sw (other types)", (): void => {
		const cases: Cases<string, number> = [
			["one", 1],
			["two", 2],
			[sw.DEFAULT, -1]
		];
		assert.equal(sw("one", cases), 1);
		assert.equal(sw("two", cases), 2);
		assert.equal(sw("three", cases), -1);
	});

	test("sw (functional condition)", (): void => {
		const cases: Cases<number, string> = [
			[1, "one"],
			[(value) => value >= 50, "big"],
			[sw.DEFAULT, "default"]
		];
		assert.equal(sw(1, cases), "one");
		assert.equal(sw(50, cases), "big");
		assert.equal(sw(60, cases), "big");
		assert.equal(sw(49, cases), "default");
	});

	test("sw (functional result)", (): void => {
		const cases: Cases<number, string> = [
			[1, (value) => `it was ${value}`]
		];
		assert.equal(sw(1, cases), "it was 1");
	});

	test("sw (void)", (): void => {
		let flag = false;
		const cases: Cases<number, void> = [
			[1, () => {assert.fail();}],
			[2, () => {flag = true;}],
			[3, () => {assert.fail();}]
		];
		sw(2, cases);
		assert.ok(flag);
	});

	test("sw.or", (): void => {
		const cases: Cases<number, string> = [
			[sw.or<number>(1, 2, 4), "in list"],
			[sw.DEFAULT, "default"]
		];
		assert.equal(sw(1, cases), "in list");
		assert.equal(sw(2, cases), "in list");
		assert.equal(sw(3, cases), "default");
		assert.equal(sw(4, cases), "in list");
		assert.equal(sw(5, cases), "default");
	});

	test("sw.and", (): void => {
		const cases: Cases<number, string> = [
			[sw.and<number>(
				(value) => value % 2 === 0,
				(value) => value >= 8,
			), "even and >= 8"],
			[sw.DEFAULT, "default"]
		];
		assert.equal(sw(6, cases), "default");
		assert.equal(sw(7, cases), "default");
		assert.equal(sw(8, cases), "even and >= 8");
		assert.equal(sw(9, cases), "default");
		assert.equal(sw(10, cases), "even and >= 8");
	});

	test("sw.not", (): void => {
		const cases: Cases<number, string> = [
			[sw.not<number>(1), "not one"],
			[sw.DEFAULT, "default"]
		];
		assert.equal(sw(1, cases), "default");
		assert.equal(sw(2, cases), "not one");
		assert.equal(sw(3, cases), "not one");
	});

});
