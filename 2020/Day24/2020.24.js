const { FORMERR } = require('dns');

function unitTest(array, stringvalue) {
    if (JSON.stringify(array) != stringvalue) {
        console.log(`Test failed ${JSON.stringify(array)} != ${stringvalue}`);
    }
}

function parseData(filename) {
    var fs = require('fs');
    var path = require('path');
    var filePath = path.join(__dirname, filename);
    var rawDataSet = fs.readFileSync(filePath).toString().split("\r\n");

    let dataset = [];
    for (line of rawDataSet) {
        instructions = line.match(/(e|se|sw|w|nw|ne)/gm);
        dataset.push(instructions);
    }

    return dataset;
}

//       /   \   /   \
//      /     \ /     \
//     | -1, 1  | 1,1  |
//     |     nw|     ne|
//   /   \   /   \   /   \
//  /     \ /     \ /     \
// | -2,0  |  0,0  |  2,0  |
// |      w|       |      e|
//  \     / \     / \     /
//   \   /   \   /   \   /
//     | -1,-1 |  1,-1 |
//     |     sw|     se|
//      \     / \     /
//       \   /   \   /

function walk(instructions) {
    x = 0;
    y = 0;
    for (step of instructions) {
        if (step == 'nw') {
            x = x - 1;
            y = y + 1;
        } else if (step == 'ne') {
            x = x + 1;
            y = y + 1;
        } else if (step == 'w') {
            x = x - 2;
        } else if (step == 'e') {
            x = x + 2;
        } else if (step == 'sw') {
            x = x - 1;
            y = y - 1;
        } else if (step == 'se') {
            x = x + 1;
            y = y - 1;
        } else {
            console.log(`Invalid instruction ${step}`);
        }
    }
    return [x, y];
}

function countGrid(grid) {
    return grid.reduce((a, b) => a + b.reduce((a, b) => a + b, 0), 0)
}

function countNeighbours(grid, x, y) {
    let nb = 0;
    if (grid[y + 1][x - 1] == 1) {
        nb++;
    }
    if (grid[y + 1][x + 1] == 1) {
        nb++;
    }
    if (grid[y-2][x] == 1) {
        nb++;
    }
    if (grid[y + 2][x] == 1) {
        nb++;
    }
    if (grid[y - 1][x - 1] == 1) {
        nb++;
    }
    if (grid[y - 1][x + 1] == 1) {
        nb++;
    }
    return nb;
}

function nextGen(grid) {
    N = 300;
    newgrid = [];
    for (i = 0; i < 2 * N; i++) {
        newgrid.push(new Array(2 * N).fill(0));
    }
    for (y = 2; y < 2 * N - 2; y++) {
        for (x = 2; x < 2 * N - 2; x++) {
            let count = countNeighbours(grid, x, y);
            if (grid[y][x] == 1 && (count == 1 || count == 2)) {
                newgrid[y][x] = 1;
                // console.log(`${x},${y} remains black, nb ${count}`)
            } else if (grid[y][x] == 0 && count == 2) {
                newgrid[y][x] = 1;
                // console.log(`${x},${y} is turned black, nb ${count}`)
            } else if (grid[y][x] == 1) {
                // console.log(`${x},${y} is turned white, nb ${count}`)
            }
        }
    }
    return newgrid;
}
function getGridEdges(grid) {
    let minx = grid.length;
    let maxx = 0;
    let miny = grid.length;
    let maxy = 0;
    for (y in grid) {
        for (x in grid[y]) {
            if (grid[y][x] == 1) {
                if (x > maxx) {
                    maxx = parseInt(x, 10)+1;
                }
                if (x < minx) {
                    minx = parseInt(x, 10)-1;
                }
                if (y > maxy) {
                    maxy = parseInt(y, 10)+1;
                }
                if (y < miny) {
                    miny = parseInt(y, 10)-1;
                }
            }
        }
    }
    return [miny, maxy, minx, maxx];
}
function printGrid(grid) {
    newgrid = nextGen(grid)
    edges = getGridEdges(grid);
    for (let y = edges[0]-2; y < edges[1]+2; y++) {
        row = [];
        for (let x = edges[2]-2; x < edges[3]+2; x++) {
            value = grid[y][x];
            newvalue = newgrid[y][x];
            nb = countNeighbours(grid, x, y);
            string = value != 0?'#':nb!=0?nb:' ';
            string = newvalue != 0?`(${string})`:` ${string} `;
            row.push(string);
        }
        console.log(row.join(''));
    }
}

function executePart1(dataset) {
    N = 50;
    grid = [];
    for (i = -N; i < N; i++) {
        grid.push(new Array(2 * N).fill(0));
    }

    for (instructionset of dataset) {
        newloc = walk(instructionset);
        grid[newloc[0] + N][newloc[1] + N] = grid[newloc[0] + N][newloc[1] + N] == 0 ? 1 : 0;
        // console.log(`Turned ${newloc.join(',')} to ${grid[newloc[0]+N][newloc[1]+N]}`);
    }

    return countGrid(grid);
}

function executePart2(dataset) {
    N = 300; //bit overkill #whocarez.
    grid = [];
    for (i = -N; i < N; i++) {
        grid.push(new Array(2 * N).fill(0));
    }

    for (instructionset of dataset) {
        newloc = walk(instructionset);
        grid[newloc[0] + N][newloc[1] + N] = grid[newloc[0] + N][newloc[1] + N] == 0 ? 1 : 0;
        // console.log(`Turned ${newloc.join(',')} to ${grid[newloc[0]+N][newloc[1]+N]}`);
    }
    // printGrid(grid);
    for (gen = 1; gen <= 100; gen++) {
        grid = nextGen(grid);
        if (gen < 10 || gen % 10 == 0) {
            // console.log(`Day ${gen}: ${countGrid(grid)}`);
            // printGrid(grid);
        }
    }
    return countGrid(grid);
}

function execute() {
    let testdata1 = parseData('testdata.txt');
    let testresult1 = executePart1(testdata1);
    if (testresult1) {
        console.log(`testdata part1: ${testresult1}`);
    }
    let testdata2 = parseData('testdata.txt');
    let testresult2 = executePart2(testdata2);
    if (testresult2) {
        console.log(`testdata part2: ${testresult2}`);
    }
    let realdata1 = parseData('data.txt');
    let result1 = executePart1(realdata1);
    if (result1) {
        console.log(`part1: ${result1}`);
    }
    let realdata2 = parseData('data.txt');
    let result2 = executePart2(realdata2);
    if (testresult2) {
        console.log(`part2: ${result2}`);
    }
}

execute();