const { reverse } = require('dns');
var fs = require('fs');
var path = require('path');
const { hasUncaughtExceptionCaptureCallback } = require('process');
var filePath = path.join(__dirname, 'data.txt');
var dataSet = fs.readFileSync(filePath).toString().split("\r\n\r\n");

var size = dataSet[1].split('\r\n')[1].length;
var sides = ['top', 'left', 'down', 'right'];
//Parse the string into a block.
// id, the id
// block, the raw block
// sides, the sides. Ordered like:
//          0
//        4   1
//          3

function parseBlock(string) {
    var lines = string.split('\r\n');
    var block = lines.slice(1);

    var id = parseInt(lines[0].substring(5, 9), 10);
    var left = block.map(x => x[0]).join('');
    var right = block.map(x => x[size - 1]).join('');
    return { id: id, block: block, sides: [lines[1], right, lines[size], left], matches: 0, top: 0, right: 0, down: 0, left: 0 };
}

var blocks = dataSet.map(parseBlock);
console.log(blocks.length);

//Do 2 strings of length size match or are each others reverse?
function sidesMatch(string1, string2) {
    if (string1 == string2) {
        return true;
    }
    for (let i = 0; i < size; i++) {
        if (string1[i] != string2[size - i - 1]) {
            return false;
        }
    }
    return true;
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
let idblock2matches = blocks.filter(x => x.matches == 2).map(x => x.id);
let product = idblock2matches.reduce((a, b) => a * b);

console.log('number of blocks with 2 matches: ' + JSON.stringify(idblock2matches) + ' product: ' + product);

var corners = blocks.filter(x => x.matches == 2);
let edges = blocks.filter(x => x.matches == 3);
let centers = blocks.filter(x => x.matches == 4);
console.log(corners.length + ' ' + edges.length + ' ' + centers.length + ' ' + blocks.length);

function rotateBlock(block) {
    let returnblock = [];
    for (let j = 0; j < block.length; j++) {
        let nextrow = block.map(x => x[j]).reverse().join('');
        returnblock.push(nextrow);

    }
    return returnblock;
}
function unitTest(array, stringvalue) {
    if (JSON.stringify(array) != stringvalue) {
        console.log(`Test failed ${JSON.stringify(array)} != ${stringvalue}`);
    }
}
unitTest(rotateBlock(['*...', '....', '....', '....']), '["...*","....","....","...."]');


function RotatePuzzlePiece(block) {
    let newblock = JSON.parse(JSON.stringify(block));
    a = newblock.top;
    newblock.top = newblock.right;
    newblock.right = newblock.down;
    newblock.down = newblock.left;
    newblock.left = a;
    newblock.block = rotateBlock(newblock.block);
    return newblock;
}

function getPuzzlePieceByID(id) {
    return blocks.find(x => x.id == id);
}
let startingblock = corners[0];

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

// Attempt no 2:

// I have 'blocks' with coordinates, let's make this puzzle.
let puzzle = [];
puzzlesize = Math.sqrt(blocks.length);
for (i = 0; i <= puzzlesize+1; i++) {
    puzzle.push(new Array(puzzlesize+1).fill(0));
}
puzzle[1][1] = startingblock.id;
for (let i = 1; i <= puzzlesize; i++) {
    for (let j = 1; j <= puzzlesize; j++) {
        let piece = getPuzzlePieceByID(puzzle[i][j]);
        let rotatedPiece = orientPuzzlePiece(piece, puzzle[i - 1][j], puzzle[i][j - 1]);
        puzzle[i+1][j] = rotatedPiece[0];
        puzzle[i][j+1] = rotatedPiece[1];
    }
}

for(row of puzzle){
    console.log(row.join(', '));
}

