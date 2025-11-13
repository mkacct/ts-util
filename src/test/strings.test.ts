import assert from "node:assert/strict";
import test, {suite} from "node:test";
import {block, fold} from "../main/strings.js";

suite("strings", (): void => {

	suite("block()", (): void => {

		test("tabs", (): void => {
			assert.equal(block(4, `
				foo bar
				baz
			`), "foo bar\nbaz");
		});

		test("spaces", (): void => {
			assert.equal(block(16, /* the next two lines are intentionally indented with spaces instead of tabs! */ `
                foo bar
                baz
			`), "foo bar\nbaz");
		});

		test("no trailing line break", (): void => {
			assert.equal(block(4, `
				foo bar
				baz`
			), "foo bar\nbaz");
		});

		test("blank line", (): void => {
			assert.equal(block(4, `
				foo bar
				baz

			`), "foo bar\nbaz\n");
		});

		test("multilevel", (): void => {
			assert.equal(block(4, `
				function foo() {
					if (bar) {
						return baz;
					}
				}
			`), "function foo() {\n\tif (bar) {\n\t\treturn baz;\n\t}\n}");
		});

	});

	suite("fold()", (): void => {

		test("tabs", (): void => {
			assert.equal(fold(4, `
				foo bar
				baz
			`), "foo bar baz");
		});

		test("spaces", (): void => {
			assert.equal(fold(16, /* the next two lines are intentionally indented with spaces instead of tabs! */ `
                foo bar
                baz
			`), "foo bar baz");
		});

		test("no trailing line break", (): void => {
			assert.equal(fold(4, `
				foo bar
				baz`
			), "foo bar baz");
		});

		test("blank lines", (): void => {
			assert.equal(fold(4, `
				foo bar

				baz
				qux

			`), "foo bar\nbaz qux\n");
		});

	});

});
