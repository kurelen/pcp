# PCP solver

Small javascript doodle to find solutions to some
[pcp](https://en.wikipedia.org/wiki/Post_correspondence_problem) instances.

## Usage

Run using nodejs:

`node pcp.js [instance] [start_budget] [[end_budget] [incrementer] [explore]]`

With:

- `[instance]` in 1, 2, 3
- `[start_budget]` non-negative number
- `[end_budget]` non-negative number greater than [start_budget]
- `[incrementer]` non-negative number
- `[explore]` indices of dominos

For example `node pcp.js 1 100 300 50 2 2` searches in instance `1` starting with
budget `100`, going up to budget `300` increasing by `50`, and exploring the
search space by requiring a solution to start with `2,2`.

## Project structure

Linting and formatting via npm modules Prettier and Eslint

```bash
npm install
npm run lint
npm run format
```

To find solutions to the instances:

```bash
npm run i1
npm run i2
npm run i3
```

## To do

The solution to instance 2 was found by luck, rearranging the dominos was necessary
and implementing the explore flag, as well as starting it not with the (0,000) one.
The solution was found due to the lucky guess of budget 220.

Is there a way to improve the code such that it reasons about some dominos
configurations?
