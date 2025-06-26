import assert from "node:assert/strict";
import test, {suite} from "node:test";
import {block, fold} from "../main/strings.js";

suite("String utilities", (): void => {

	test("block", (): void => {
		assert.equal(block(3, `
			foo bar
			baz
		`), "foo bar\nbaz");
		assert.equal(block(12, /* the next two lines are intentionally indented with spaces instead of tabs! */ `
            foo bar
            baz
		`), "foo bar\nbaz");
		assert.equal(block(3, `
			foo bar
			baz`
		), "foo bar\nbaz");
		assert.equal(block(3, `
			foo bar
			baz

		`), "foo bar\nbaz\n");
		assert.equal(block(3, `
			function foo() {
				if (bar) {
					return baz;
				}
			}
		`), "function foo() {\n\tif (bar) {\n\t\treturn baz;\n\t}\n}");
	});

	test("fold", (): void => {
		assert.equal(fold(3, `
			foo bar
			baz
		`), "foo bar baz");
		assert.equal(fold(12, /* the next two lines are intentionally indented with spaces instead of tabs! */ `
            foo bar
            baz
		`), "foo bar baz");
		assert.equal(fold(3, `
			foo bar
			baz`
		), "foo bar baz");
		assert.equal(fold(3, `
			foo bar

			baz
			qux

		`), "foo bar\nbaz qux\n");
	});

});
