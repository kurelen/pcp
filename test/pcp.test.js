const test = require("node:test");
const assert = require("node:assert");
const pcp = require("../src/pcp.js");

test("pcp.merge", () => {
    assert.deepStrictEqual(pcp.merge(["11", "01"], ["10", "00"]), [
        "1110",
        "0100",
    ]);
});

test("pcp.shrink", () => {
    assert.deepStrictEqual(pcp.shrink(["abcde", "abc"]), ["de", ""]);
    assert.deepStrictEqual(pcp.shrink(["abcde", "abx"]), undefined);
});

test("pcp.is_balanced", () => {
    assert.deepStrictEqual(pcp.is_balanced(["abc", "abc"]), true);
    assert.deepStrictEqual(pcp.is_balanced(["", ""]), true);
    assert.deepStrictEqual(pcp.is_balanced(["abc", "xyz"]), false);
});

test("pcp.solve", () => {
    const instance = {
        dominos: [
            ["a", "ab"],
            ["bb", "b"],
            ["c", "cb"],
        ],
        budget: 5,
        explore: [],
        reverse: false,
    };
    assert.deepStrictEqual(pcp.solve(instance), [0, 1]);
    assert.deepStrictEqual(pcp.solve({ ...instance, reverse: true }), [2, 1]);
    assert.deepStrictEqual(pcp.solve({ ...instance, explore: [1] }), undefined);
});
