// Utility functions for use in test cases

import {cartesianProduct} from "./main.js";

type Matrix = Readonly<Record<string, ReadonlyArray<unknown>>>;
type MatrixStrategyFn<M extends Matrix> = (values: Readonly<{[K in keyof M]: M[K][number];}>) => void;

export function matrixStrategy<M extends Matrix>(matrix: M, fn: MatrixStrategyFn<M>): void {
	const keys: (keyof M)[] = Object.keys(matrix);
	const arrays: M[keyof M][] = keys.map((key: keyof M): M[keyof M] => matrix[key]);
	const product: M[keyof M][number][][] = cartesianProduct(...arrays);
	for (const combination of product) {
		const values: {[K in keyof M]: M[K][number];} = Object.fromEntries(
			keys.map((key: keyof M, index: number): [keyof M, M[keyof M][number]] => [key, combination[index]])
		) as {[K in keyof M]: M[K][number];};
		fn(values);
	}
}
