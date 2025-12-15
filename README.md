# PCP solver

Small javascript doodle to find solutions to some pcp instances.

## Usage

Run using nodejs:

`node pcp.js [instance] [start_budget] [[end_budget] [incrementer]]`

With:

- `[instance]` in 1, 2, 3
- `[start_budget]` non-negative number
- `[end_budget]` non-negative number greater than [start_budget]
- `[incrementer]` non-negative number

## Project structure

Linting and formatting via npm modules Prettier and Eslint

```bash
npm install
npm run lint
npm run format
```

## TODO

No solution for instance 2 is found. Is there a way to improve the code,
such that some heuristic can abort the search tree faster, or that it can
proof that no solution exists?
