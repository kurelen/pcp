function merge(domino_1, domino_2) {
    return [domino_1[0] + domino_2[0], domino_1[1] + domino_2[1]];
}

function shrink(domino) {
    const [t, b] = domino;
    let i = 0;
    while (i < t.length && i < b.length) {
        if (t[i] !== b[i]) {
            return undefined;
        }
        i++;
    }
    return [t.slice(i), b.slice(i)];
}

function is_balanced(domino) {
    return domino[0] === domino[1];
}

function solve({ dominos, budget, explore, reverse }) {
    const result = [];
    const indices = [...dominos.keys()];
    if (reverse) {
        indices.reverse();
    }

    const start_difference = shrink(
        explore.map((i) => dominos[i]).reduce(merge, ["", ""])
    );
    if (start_difference === undefined) {
        return undefined;
    }

    function recursion_step(difference, remaining_budget) {
        if (remaining_budget <= 0 || difference === undefined) {
            return false;
        }
        for (const i of indices) {
            const merged_domino = merge(difference, dominos[i]);
            if (
                is_balanced(merged_domino) ||
                recursion_step(shrink(merged_domino), remaining_budget - 1)
            ) {
                result.push(i);
                return true;
            }
        }
        return false;
    }

    recursion_step(start_difference, budget);

    return result.length > 0 ? [...explore, ...result.reverse()] : [];
}

module.exports = {
    merge,
    shrink,
    is_balanced,
    solve,
};
