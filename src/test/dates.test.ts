import assert from "node:assert/strict";
import test, {suite} from "node:test";
import {formatSimpleDate, yearIsLeap} from "../main/dates.js";

suite("dates", (): void => {

	suite("yearIsLeap()", (): void => {

		test("multiples of 100", (): void => {
			assert.equal(yearIsLeap(1600), true);
			assert.equal(yearIsLeap(1700), false);
			assert.equal(yearIsLeap(1800), false);
			assert.equal(yearIsLeap(1900), false);
			assert.equal(yearIsLeap(2000), true);
			assert.equal(yearIsLeap(2100), false);
			assert.equal(yearIsLeap(2200), false);
			assert.equal(yearIsLeap(2300), false);
		});

		test("not multiples of 100", (): void => {
			assert.equal(yearIsLeap(2001), false);
			assert.equal(yearIsLeap(2002), false);
			assert.equal(yearIsLeap(2003), false);
			assert.equal(yearIsLeap(2004), true);
			assert.equal(yearIsLeap(2005), false);
			assert.equal(yearIsLeap(2006), false);
			assert.equal(yearIsLeap(2007), false);
			assert.equal(yearIsLeap(2008), true);
		});

	});

	suite("formatSimpleDate()", (): void => {

		test("no padding needed", (): void => {
			assert.equal(formatSimpleDate(new Date("2024-12-25T00:00:00")), "2024-12-25");
		});

		test("padding needed", (): void => {
			assert.equal(formatSimpleDate(new Date("2012-02-03T23:59:59")), "2012-02-03");
		});

		test("very long ago", (): void => {
			assert.equal(formatSimpleDate(new Date("0004-01-01T00:00:00")), "4-01-01");
		});

	});

});
