const fs = require("fs");
const command_ling_args = require("command-line-args");
const command_ling_usage = require("command-line-usage");

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

const options_definition = [
    {
        name: "dominos",
        alias: "d",
        type: String,
        multiple: true,
        description:
            'Dominos in format "top,bottom" seperated by spaces. Example: --dominos',
    },
    {
        name: "read",
        alias: "r",
        type: String,
        typeLabel: "{underline file}",
        description: "Read dominos from a file (whitespace separated)",
    },
    {
        name: "budget",
        alias: "b",
        type: String,
        typeLabel: "{underline range}",
        description:
            'Budget range. Examples: "200" for a single value, "200..210" for range with step 1, "200..200:2" for custom step',
    },
    {
        name: "explore",
        alias: "e",
        type: Number,
        multiple: true,
        typeLabel: "{underline indices...}",
        description:
            "Start with specific domino indices (1-based). Example: --explore 4 2",
    },
    {
        name: "max-op",
        alias: "m",
        type: Number,
        typeLabel: "{underline count}",
        description: "Maximum operations per search",
    },
    {
        name: "help",
        alias: "h",
        type: Boolean,
        description: "Display this usage guide",
    },
    {
        name: "reverse",
        alias: "x",
        type: Boolean,
        description: "Iterate over dominos in reverse order",
    },
    {
        name: "verbose",
        alias: "v",
        type: Boolean,
        description: "Verbose output",
    },
];

const range_regex = /^(\d+)(\.\.(\d+)(:(\d+))?)?$/;
const domino_regex = /^([^,\s]),([^,\s])$/;
const whitespace_regex = /\s+/;

function read_dominos(filePath) {
    const content = fs.readFileSync(filePath, "utf-8");
    return content.split(whitespace_regex);
}

function validate_options(options) {
    const { budget, dominos, read, explore, help, max_op, reverse, verbose } =
        options;
    const result = { help, max_op, reverse, verbose };

    if (budget == undefined) {
        throw new Error("Missing budget (--budget)");
    }
    const match = budget.match(range_regex);
    if (!match) {
        throw new Error('Invalid budget range "' + budget + '"');
    }
    const start = parseInt(match[1], 10);
    const end = match[3] ? parseInt(match[3], 10) : start;
    const step = match[5] ? parseInt(match[5], 10) : 1;
    if (start > end) {
        throw new Error("Invalid range, " + start + " > " + end);
    }

    result.budget = { start, end, step };

    if (dominos != undefined && read != undefined) {
        throw new Error("Mutual exclusive arguments '--dominos' and '--read'");
    }
    let ds =
        dominos != undefined
            ? dominos
            : read != undefined
              ? read_dominos(read)
              : read_dominos(0);

    if (ds.length == 0) {
        throw new Error("Dominos must not be empty");
    }

    result.dominos = ds
        .filter((s) => s != "")
        .map((domino) => {
            const match = domino.match(domino_regex);
            if (
                match == undefined ||
                match[1] == undefined ||
                match[2] == undefined
            ) {
                throw new Error("Invalid formatted domino " + domino);
            }
            return [match[1], match[2]];
        });

    const dominos_amount = result.dominos.length;

    if (explore != undefined) {
        result.explore = explore.map((index) => {
            index = index - 1;
            if (0 <= index && index < dominos_amount) {
                return index;
            }
            throw new Error(
                "Explore index " + i + " out of bounds (" + dominos_amount + ")"
            );
        });
    }

    return result;
}

const usage_definition = [
    {
        header: "PCP Solver",
        content: "Solves Post Correspondence Problem instances",
    },
    {
        header: "Options",
        optionList: options_definition,
    },
    {
        header: "Examples",
        content: [
            {
                desc: "1. Using stdin",
                example: "$ node pcp.js --budget 200..210:2",
            },
            {
                desc: "2. Inline dominos",
                example:
                    "$ node pcp.js --dominos 11101,0110 110,1 1,1011 --budget 302",
            },
            {
                desc: "3. From file",
                example:
                    "$ node pcp.js --open dominos.txt --budget 200..210 --reverse",
            },
            {
                desc: "4. With explore",
                example:
                    "$ node pcp.js --dominos 000,0 0,111 11,0 10,100 --budget 202 --reverse --explore 4 2",
            },
        ],
    },
];

function processOptions(options) {
    if (options === undefined) {
        console.log(
            "Usage: node pcp.js [instance 1,2,3] [start_budget int] [end_budget int]\n" +
                "                   [incrementer int] [explore [int]]"
        );
        return;
    }
    print_solution(options, iterate_search_space(options));
}

function main() {
    let options;
    try {
        options = validate_options(command_ling_args(options_definition));
    } catch (err) {
        console.error(err.message);
        console.log(command_ling_usage(usage_definition));
        process.exit(1);
    }

    if (options.help) {
        console.log(command_ling_usage(usage_definition));
        process.exit(0);
    }

    console.log(options);
}

main();
