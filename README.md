# PCP solver

Small javascript doodle to find solutions to some
[pcp](https://en.wikipedia.org/wiki/Post_correspondence_problem) instances.

## Usage

Run using the CLI:

```bash
./bin/pcp [options]
```

### Options

- `-d, --dominos string[]` - Dominos in format "top,bottom" separated by spaces
- `-r, --read file` - Read dominos from a file (whitespace separated)
- `-b, --budget range` - Budget range. Examples: "200" for single value, "200..210" for range with step 1, "200..210:2" for custom step
- `-e, --explore indices...` - Start with specific domino indices (1-based)
- `-x, --reverse` - Iterate over dominos in reverse order
- `-v, --verbose` - Verbose output
- `-h, --help` - Display usage guide

### Examples

```bash
# Using stdin
node pcp.js --budget 200..210:2

# Inline dominos
./bin/pcp --dominos 11101,0110 110,1 1,1011 --budget 302

# From file
./bin/pcp --read instance_2.txt --budget 200..210 --reverse

# With explore
./bin/pcp --dominos 000,0 0,111 11,0 10,100 --budget 202 --reverse --explore 4 2
```

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
