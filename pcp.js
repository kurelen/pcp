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
    if (t.startsWith(b)) {
        return [t.slice(b.length), ""];
    } else if (b.startsWith(t)) {
        return ["", b.slice(t.length)];
    } else {
        return undefined;
    }
}

function is_balanced(domino) {
    return domino[0] == domino[1];
}

function solve_pcp(dominos, budget) {
    const result = [];

    function recursion_step(difference, budget) {
        if (budget <= 0 || difference == undefined) {
            return false;
        }
        for (let i = 0; i < dominos.length; i++) {
            const merged_domino = merge(difference, dominos[i]);
            if (
                is_balanced(merged_domino) ||
                recursion_step(shrink(merged_domino), budget - 1)
            ) {
                result.push(i);
                return true;
            }
        }
        return false;
    }

    recursion_step(["", ""], budget);

    return result.reverse();
}

function iterate_search_space(dominos, start_budget, end_budget, incrementer) {
    for (
        let budget = start_budget;
        budget <= end_budget;
        budget += incrementer
    ) {
        console.log("Search with budget " + budget);

        const solution = solve_pcp(dominos, budget);
        if (solution.length != 0) {
            return solution;
        }
    }
}

function print_solution(dominos, solution) {
    const dom_s = dominos
        .map((domino, index) => `${index + 1}:(${domino[0]},${domino[1]})`)
        .join(" ");
    if (!Array.isArray(solution) || solution.length == 0) {
        console.log("No solution for dominos found " + dom_s);
        return;
    }
    console.log("Found solution of length " + solution.length);
    console.log("Dominos  > " + dom_s);
    console.log("Solution > " + solution.map((i) => i + 1).join(","));
    console.log("Top      > " + solution.map((i) => dominos[i][0]).join(""));
    console.log("Bottom   > " + solution.map((i) => dominos[i][1]).join(""));
}

function parseOptions() {
    const options = process.argv
        .slice(2)
        .map((s) => parseInt(s, 10))
        .filter((n) => n > 0);
    if (options.length == 0 || options[0] > 3 || options[1] == undefined) {
        return undefined;
    }
    const [index, start_budget, end_budget, incrementer] = options;
    return {
        dominos: instances[index],
        start_budget: start_budget,
        end_budget: end_budget ?? start_budget,
        incrementer: incrementer ?? 1,
    };
}

function processOptions(options) {
    if (options == undefined) {
        console.log(
            "Usage: node pcp.js [instance 1,2,3] [start_budget int] [end_budget int] [incrementer int]"
        );
        return;
    }
    const { dominos, start_budget, end_budget, incrementer } = options;
    print_solution(
        dominos,
        iterate_search_space(dominos, start_budget, end_budget, incrementer)
    );
}

processOptions(parseOptions());
