const instance_1 = [
  ["111", "110"],
  ["011","1"],
  ["10", "100"],
  ["0", "11"]
];

const instance_2 = [
  ["0","111"],
  ["11", "0"],
  ["10", "100"],
  ["000", "0"],
];

const instance_3 = [
  ["11101", "0110"],
  ["110","1"],
  ["1", "1011"],
];

const instances = [instance_1, instance_2, instance_3];

function merge_and_shrink(d1, d2) {
  let t = d1[0] + d2[0];
  let b = d1[1] + d2[1];
  if (t.startsWith(b)) {
    return [
      t.slice(b.length),
      ""
    ];
  } else if (b.startsWith(t)) {
    return [
      "",
      b.slice(t.length),
    ];
  } else {
    return undefined;
  }
}

function solve_pcp(dominoes, budget) {
  const result = [];

  function recursion_step(difference, budget) {
    const [t, b] = difference;
    if (budget <= 0) {
      return false;
    }

    for (let i = 0; i < dominoes.length; i++) {
      const new_difference = merge_and_shrink(difference, dominoes[i]);
      if (new_difference == undefined) {
        continue;
      }
      const [t, b] = new_difference;
      if (t == "" && b == "") {
        result.push(i);
        return true;
      } else {
        if (recursion_step(new_difference, budget - 1)) {
          result.push(i);
          return true;
        }
      }
    }
    return false;
  }

  recursion_step(["",""], budget);

  return result.reverse();
}

function iterate_search_space(dominoes, start_budget, end_budget, incrementer) {
  for (let budget = start_budget; budget <= end_budget; budget += incrementer) {
    console.log("Search with budget " + budget);

    const solution = solve_pcp(dominoes, budget);
    if (solution.length != 0) {
      return solution;
    }
  }
}

function print_solution(dominoes, solution) {
  const dom_s = dominoes.map(
    (domino, index) => `${index}:(${domino[0]}, ${domino[1]})`).join(" ");
  if (!Array.isArray(solution) || solution.length == 0) {
    console.log("No solution for dominoes found " + dom_s);
    return;
  } 
  console.log("Found solution of length " + solution.length);
  console.log("Dominoes " + dom_s);
  console.log("Solution " + solution.join(","));
  console.log(solution.map(i => dominoes[i][0]).join(""));
  console.log(solution.map(i => dominoes[i][1]).join(""));
}

function parseOptions() {
  const options = process.argv.slice(2).map(s => parseInt(s, 10)).filter(n => n > 0);
  if (options.length == 0
    || options[0] > 3
    || options[1] == undefined) {
    return undefined;
  }
  const [instance, start_budget, end_budget, incrementer ] = options
  return {
    dominoes: instances[instance - 1],
    instance,
    start_budget: start_budget,
    end_budget: end_budget ?? start_budget,
    incrementer: incrementer ?? 1
  }
}

function processOptions(options) {
  if (options == undefined) {
    console.log("Usage: node pcp.js [instance 1,2,3] [start_budget int] [end_budget int] [incrementer int]");
    return;
  }
  const { dominoes, start_budget, end_budget, incrementer } = options;
  print_solution(
    dominoes,
    iterate_search_space(
      dominoes,
      start_budget,
      end_budget,
      incrementer));
}

const options = parseOptions();
processOptions(parseOptions());


