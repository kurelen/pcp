const instances = {
    1: [
        ["111", "110"],
        ["011", "1"],
        ["10", "100"],
        ["0", "11"],
    ],
    2: [
        ["0", "111"],
        ["11", "0"],
        ["10", "100"],
        ["000", "0"],
    ],
    3: [
        ["11101", "0110"],
        ["110", "1"],
        ["1", "1011"],
    ],
};

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

function solve_pcp(dominos, budget, start_difference) {
    const result = [];

    function recursion_step(difference, remaining_budget) {
        if (remaining_budget <= 0 || difference === undefined) {
            return false;
        }
        for (let i = 0; i < dominos.length; i++) {
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

    return result.reverse();
}

function iterate_search_space(options) {
    const { dominos, start_budget, end_budget, incrementer, explore } = options;

    const start_difference = shrink(
        explore.map((i) => dominos[i]).reduce(merge, ["", ""])
    );

    if (start_difference === undefined) {
        return { type: "error" };
    }
    for (
        let budget = start_budget;
        budget <= end_budget;
        budget += incrementer
    ) {
        console.log("Search with budget " + budget);

        const solution = solve_pcp(dominos, budget, start_difference);
        if (solution.length !== 0) {
            return { type: "found", result: [...explore, ...solution] };
        }
    }
    return { type: "not_found" };
}

function print_solution(options, solution) {
    const { dominos, explore } = options;
    const { type, result } = solution;
    const dom_s = dominos
        .map((domino, index) => `${index + 1}:(${domino[0]},${domino[1]})`)
        .join(" ");
    switch (type) {
        case "error":
            console.log("Can't explore invalid start configuration");
            console.log("Dominos  > " + dom_s);
            console.log("Explore  > " + explore.map((i) => i + 1).join(""));
            console.log(
                "Top      > " + explore.map((i) => dominos[i][0]).join("")
            );
            console.log(
                "Bottom   > " + explore.map((i) => dominos[i][1]).join("")
            );
            return;
        case "not_found":
            console.log("No solution for dominos found " + dom_s);
            return;
        default:
            console.log("Found solution of length " + result.length);
            console.log("Dominos  > " + dom_s);
            console.log("Solution > " + result.map((i) => i + 1).join(","));
            console.log(
                "Top      > " + result.map((i) => dominos[i][0]).join("")
            );
            console.log(
                "Bottom   > " + result.map((i) => dominos[i][1]).join("")
            );
    }
}

function parseOptions() {
    const options = process.argv
        .slice(2)
        .map((s) => parseInt(s, 10))
        .filter((n) => Number.isSafeInteger(n) && n > 0);
    if (options.length === 0 || options[0] > 3 || options[1] === undefined) {
        return undefined;
    }
    const [index, start_budget, end_budget, incrementer, ...explore] = options;
    const dominos = instances[index];
    const valid = explore.every((n) => n > 0 && n <= dominos.length);
    return {
        dominos,
        start_budget: start_budget,
        end_budget: end_budget ?? start_budget,
        incrementer: incrementer ?? 1,
        explore: explore.map((i) => i - 1) ?? [],
    };
}

function processOptions(options) {
    if (options === undefined) {
        console.log(
            "Usage: node pcp.js [instance 1,2,3] [start_budget int] [end_budget int] [incrementer int]"
        );
        return;
    }
    const { dominos, start_budget, end_budget, incrementer, explore } = options;
    print_solution(options, iterate_search_space(options));
}

processOptions(parseOptions());
