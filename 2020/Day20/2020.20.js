const { FORMERR } = require('dns');


function parseBlock(string) {
    let lines = string.split('\r\n');
    let block = lines.slice(1);
    let size = block.length;
    let id = parseInt(lines[0].substring(5, 9), 10);
    let left = block.map(x => x[0]).join('');
    let right = block.map(x => x[size - 1]).join('');
    return { id: id, block: block, sides: [lines[1], right, lines[size], left], matches: 0, top: 0, right: 0, down: 0, left: 0 };
}

function unitTest(array, stringvalue) {
    if (JSON.stringify(array) != stringvalue) {
        console.log(`Test failed ${JSON.stringify(array)} != ${stringvalue}`);
    }
}

function reverseString(string) {
    return string.split('').reverse().join('');
}

//Do 2 strings of length size match or are each others reverse?
function sidesMatch(string1, string2) {
    if (string1 == string2) {
        return true;
    } else if (string1 == reverseString(string2)) {
        return true;
    } else {
        return false;
    }
}

function fillBlockNeighbour(block1, direction, id) {
    if (direction == 0) {
        block1.top = id;
    } else if (direction == 1) {
        block1.left = id;
    } else if (direction == 2) {
        block1.down = id;
    } else if (direction == 3) {
        block1.right = id;
    }
}

function parseData(filename) {
    var fs = require('fs');
    var path = require('path');
    var filePath = path.join(__dirname, filename);
    var rawDataSet = fs.readFileSync(filePath).toString().split("\r\n\r\n");
    var blocks = rawDataSet.map(parseBlock);

    //We loop over all pairs of blocks.
    for (let i = 0; i < blocks.length; i++) {
        let block1 = blocks[i];
        for (let j = i + 1; j < blocks.length; j++) {
            let block2 = blocks[j];
            for (let k = 0; k < 4; k++) {
                for (let l = 0; l < 4; l++) {
                    if (sidesMatch(block1.sides[k], block2.sides[l])) {
                        // console.log(`Block ${block1.id}.${sides[k]} and block ${block2.id}.${sides[l]} match`);
                        block1.matches++;
                        block2.matches++;
                        fillBlockNeighbour(block1, k, block2.id);
                        fillBlockNeighbour(block2, l, block1.id);
                    }
                }
            }
        }
    }
    return blocks;
}

//Functions part2:

function getPuzzlePieceByID(id, dataset) {
    return dataset.find(x => x.id == id);
}

function orientPuzzlePiece(block, topnb, leftnb) {
    if (block.top == topnb && block.left == leftnb) {
        return [block.down, block.right];
    } else if (block.top == topnb && block.right == leftnb) {
        return [block.down, block.left];
    } else if (block.right == topnb && block.top == leftnb) {
        return [block.left, block.down];
    } else if (block.right == topnb && block.down == leftnb) {
        return [block.left, block.top];
    } else if (block.down == topnb && block.left == leftnb) {
        return [block.top, block.right];
    } else if (block.down == topnb && block.right == leftnb) {
        return [block.top, block.left];
    } else if (block.left == topnb && block.top == leftnb) {
        return [block.right, block.down];
    } else if (block.left == topnb && block.down == leftnb) {
        return [block.right, block.top];
    } else {
        console.log(`error, invalid block searched ${block.id} ${topnb} ${leftnb}`);
        console.log(JSON.stringify(block));
    }
}

function solvePuzzle(dataset) {
    let puzzle = [];
    puzzlesize = Math.sqrt(dataset.length);
    for (i = 0; i < puzzlesize; i++) {
        puzzle.push(new Array(puzzlesize).fill(0));
    }
    //Start with a random corner.
    puzzle[0][0] = dataset.filter(x => x.matches == 2)[0].id;
    for (let i = 0; i < puzzlesize; i++) {
        for (let j = 0; j < puzzlesize; j++) {
            let piece = getPuzzlePieceByID(puzzle[i][j], dataset);
            let top = puzzle[i - 1]?.[j] ? puzzle[i - 1][j] : 0;
            let left = puzzle[i][j - 1] ? puzzle[i][j - 1] : 0;
            let rotatedPiece = orientPuzzlePiece(piece, top, left);
            if (i + 1 < puzzlesize) puzzle[i + 1][j] = rotatedPiece[0];
            if (j + 1 < puzzlesize) puzzle[i][j + 1] = rotatedPiece[1];
        }
    }
    return puzzle;
}
//Add currentblock to the end of the row with the matching edge.
function addBlock(row, currentblock) {
    for (j = 0; j < row.length; j++) {
        row[j] = row[j].substring(0, row[j].length - 1) + currentblock[j];
    }
    return row;
}

function getRightEdge(block) {
    return block.map(x => x.slice(-1)).join('');
}

function rotateBlock(block) {
    let returnblock = [];
    for (let j = 0; j < block[0].length; j++) {
        let nextrow = block.map(x => x[j]).reverse().join('');
        returnblock.push(nextrow);
    }
    return returnblock;
}
unitTest(rotateBlock(['*...', '....', '....', '....']), '["...*","....","....","...."]');


//Orient the block so that edge matches with the right side of block
function orientBlock(block, edge) {
    for (i = 0; i < 4; i++) {
        let blockedge = block.map(x => x[0]).join('');
        if (edge == blockedge) {
            return block;
        } else if (edge == reverseString(blockedge)) {
            return block.reverse();
        }
        block = rotateBlock(block);
    }
    console.log(`Unable to orient block ${block.id} to edge ${edge}`);
}
function trimBlock(block) {
    let trimblock = [];
    for (let y = 1; y < block.length - 1; y++)
        trimblock.push(block[y].substring(1, block[y].length - 1));
    return trimblock;
}

function OrientBlockTop(block, topedge) {
    for (i = 0; i < 4; i++) {
        let blockedge = block[0];
        if (topedge == blockedge) {
            return block;
        } else if (topedge == reverseString(blockedge)) {
            return block.map(x => reverseString(x));
        }
        block = rotateBlock(block);
    }
    console.log(`Unable to orient block ${block.id} to edge ${edge}`);
}
function mergeBlocks(array) {
    let totalblock = [];
    for (row of array) {
        let rowblock = new Array(row[0].length).fill('');
        for (block of row) {
            for (line in block) {
                rowblock[line] += block[line];
            }
        }
        totalblock = totalblock.concat(rowblock);
    }
    return totalblock;
}

function buildField(dataset, solution) {
    let totalblock = [];
    let orientedpieces = [];
    for (i = 0; i < solution.length; i++) {
        orientedpieces.push(new Array(solution[0].length).fill(0));
    }

    let nexttopedge = getPuzzlePieceByID(solution[0][0], dataset).sides[2];//I've peeked this, works for td and d.
    for (let k = 0; k < solution.length; k++) {
        //construct the next row:
        rowstarter = getPuzzlePieceByID(solution[0][k], dataset).block;
        currentrow = OrientBlockTop(rowstarter, nexttopedge);
        orientedpieces[k][0] = trimBlock(currentrow);
        nexttopedge = currentrow[currentrow.length - 1];
        for (let l = 1; l < solution[0].length; l++) {
            nextblock = getPuzzlePieceByID(solution[l][k], dataset).block;
            let rowedge = currentrow.map(x => x.slice(-1)).join('');
            let orientedblock = orientBlock(nextblock, rowedge);
            orientedpieces[k][l] = trimBlock(orientedblock);
            currentrow = addBlock(currentrow, orientedblock);
        }
        totalblock = totalblock.slice(0, totalblock.length - 1).concat(currentrow.slice());
    }
    return mergeBlocks(orientedpieces);
}

function checkSnake(snakeimage, field, x, y) {
    for (row = 0; row < snakeimage.length; row++) {
        for (char = 0; char < snakeimage[row].length; char++) {
            let snakechar = snakeimage[row][char];
            if (snakechar == '#' && field[y + row][x + char] == '.') {
                return false;
            }
        }
    }
    return true;
}

function setChar(string, index, newchar) {
    return string.substring(0, index) + newchar + string.substring(index + 1, string.length);
}

function drawSnake(snakeimage, field, x, y) {
    for (row = 0; row < snakeimage.length; row++) {
        for (char = 0; char < snakeimage[row].length; char++) {
            let snakechar = snakeimage[row][char];
            if (snakechar == '#') {
                field[y + row] = setChar(field[y + row], x + char, 'O');
            }
        }
    }
    return field;
}


function findSnakes(field) {
    // ..................#.
    // #....##....##....###
    // .#..#..#..#..#..#...
    let snake = ['..................#.', '#....##....##....###', '.#..#..#..#..#..#...'];
    let foundsnake = false;
    for (let flip = 0; flip < 2;flip++) {
        for (let rot = 0; rot < 4; rot++) {
            for (y = 0; y < field.length - snake.length; y++) {
                for (x = 0; x < field[0].length - snake[0].length; x++) {
                    if (checkSnake(snake, field, x, y)) {
                        field = drawSnake(snake, field, x, y);
                        // console.log(`Found snake at ${x}, ${y}`);
                        foundsnake = true;
                    }
                }
            }
            if (foundsnake) {
                return field;
            }
            field = rotateBlock(field);
        }
        field = field.map(x => reverseString(x));
    }
    console.log(`No snakes found`);
}

function countWater(field){
    return JSON.stringify(field).match(/(\#)/g).length;
}

function executePart1(dataset) {
    let idblock2matches = dataset.filter(x => x.matches == 2).map(x => x.id);
    let product = idblock2matches.reduce((a, b) => a * b);
    // console.log('number of blocks with 2 matches: ' + JSON.stringify(idblock2matches) + ' product: ' + product);
    return product;
}

function executePart2(dataset) {
    solution = solvePuzzle(dataset);
    field = buildField(dataset, solution);
    fieldWithSnakes = findSnakes(field.slice());

    // for (row of fieldWithSnakes) {
    //     console.log(row);
    // }

    return countWater(fieldWithSnakes);
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