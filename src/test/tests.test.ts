import assert from "node:assert/strict";
import test, {suite} from "node:test";
import {matrixStrategy} from "../main/tests.js";

suite("Test utilities", (): void => {

	test(`matrixStrategy`, (): void => {
		{
			let runs: number = 0;
			matrixStrategy({}, (values): void => {
				assert.deepEqual(values, {});
				runs++;
			});
			assert.equal(runs, 1);
		}
		{
			const output: {a: number, b: string}[] = [];
			matrixStrategy({
				a: [1, 2, 3],
				b: ["x", "y"]
			}, (values): void => {
				output.push(values);
			});
			assert.deepEqual(output, [
				{a: 1, b: "x"},
				{a: 1, b: "y"},
				{a: 2, b: "x"},
				{a: 2, b: "y"},
				{a: 3, b: "x"},
				{a: 3, b: "y"}
			]);
		}
	});

});
