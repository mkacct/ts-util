import assert from "node:assert/strict";
import test, {suite} from "node:test";
import {queryString} from "../main/web.js";

suite("web", (): void => {

	suite("queryString()", (): void => {

		test("empty", (): void => {
			assert.equal(queryString({}), "");
		});

		test("simple", (): void => {
			assert.equal(queryString({
				"foo": "aaa",
				"bar": "bbb",
				"baz": "ccc"
			}), "?foo=aaa&bar=bbb&baz=ccc");
		});

		test("multiple values", (): void => {
			assert.equal(queryString({
				"foo": ["apple", "banana"],
				"bar": "orange",
				"baz": ["lemon", "lime", "lime"]
			}), "?foo=apple&foo=banana&bar=orange&baz=lemon&baz=lime&baz=lime");
		});

		test("varying characters", (): void => {
			assert.equal(queryString({
				"The first value": "what's this?",
				"The 2nd value": "it's a query string!",
				"empty": ""
			}), "?The+first+value=what%27s+this%3F&The+2nd+value=it%27s+a+query+string%21&empty=");
		});

		test("all together", (): void => {
			assert.equal(queryString({
				"symbols": ["!", "@", "#", "?&="],
				"empties": ["",""],
				"single": ["last entry"]
			}), "?symbols=%21&symbols=%40&symbols=%23&symbols=%3F%26%3D&empties=&empties=&single=last+entry");
		});

	});

});
