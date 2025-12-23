const test = require("node:test");
const assert = require("node:assert");
const pcp = require("../src/pcp.js");

test("merge combines two dominos", () => {
    assert.deepStrictEqual(pcp.merge(["11", "01"], ["10", "00"]), [
        "1110",
        "0100",
    ]);
});
