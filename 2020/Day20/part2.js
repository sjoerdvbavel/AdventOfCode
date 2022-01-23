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
    return { id: id, block: block, sides: [lines[1], right, lines[size], left], matches: 0, top: 0, right: 0, bottom: 0, left: 0 };
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
                    fillBlockNeighbour(block2, k, block1.id);
                }
            }
        }
    }
}
let idblock2matches = blocks.filter(x => x.matches == 2).map(x => x.id);
let product = idblock2matches.reduce((a, b) => a * b);

console.log('number of blocks with 2 matches: ' + JSON.stringify(idblock2matches) + ' product: ' + product);

function unitTest(array, stringvalue) {
    if (JSON.stringify(array) != stringvalue) {
        console.log(`Test failed ${JSON.stringify(array)} != ${stringvalue}`);
    }
}
function getNextblock(object, direction) {
    if (direction % 4 == 0) {
        return blocks.find(block => block.id == object.right);
    } else if (direction % 4 == 1) {
        return blocks.find(block => block.id == object.down);
    } else if (direction % 4 == 2) {
        return blocks.find(block => block.id == object.left);
    } else if (direction % 4 == 3) {
        return blocks.find(block => block.id == object.left);
    }
}
function rotateBlock(block) {
    let returnblock = [];
    for (let j = 0; j < block.length; j++) {
        let nextrow = block.map(x => x[j]).reverse().join('');
        returnblock.push(nextrow);

    }
    return returnblock;
}
unitTest(rotateBlock(['*...', '....', '....', '....']), '["...*","....","....","...."]');

//Orient the block so that edge is right with the correct orientation.
function orientBlock(block, edge) {
    for (i = 0; i < 4; i++) {
        let blockedge = block.map(x => x[0]).join('');
        let reversedblockedge = blockedge.split('').reverse().join('');
        if (edge == blockedge) {
            return block;
        } else if (edge == reversedblockedge) {
            return block.reverse();
        }
        block = rotateBlock(block);
    }
}

//Add currentblock to the end of the row with the matching edge.
function addBlock(row, currentblock) {
    let rowedge = row.map(x => x.slice(-1)).join('');
    let orientedblock = orientBlock(currentblock, rowedge);
    for (j = 0; j < row.length; j++) {
        row[j] = row[j].substring(0, row[j].length - 1) + orientedblock[j];
    }
    return row;
}

unitTest(addBlock(['.....*', '......', '......', '......'], ['...*', '....', '....', '....']),
    '[".....*...",".........",".........","........."]');
    unitTest(addBlock(['.....*', '......', '......', '......'], ['*...', '....', '....', '....']),
    '[".....*...",".........",".........","........."]');

    unitTest(addBlock(['.....*', '......', '......', '.....*'], ['....', '....', '....', '*..*']),
    '[".....*...",".........",".........",".....*..."]');
//Build the actual image...
//Luckely, there are only blocks with 2, 3 and 4 matches... I'll use every match.

var corners = blocks.filter(x => x.matches == 2);
let edges = blocks.filter(x => x.matches == 3);
let centers = blocks.filter(x => x.matches == 4);
console.log(corners.length + ' ' + edges.length + ' ' + centers.length);


function getBlock(edge, blocklist){
    let regular = blocklist.findIndex(x => x.sides.includes(edge));
    let reversed = blocklist.findIndex(x => x.sides.includes(edge.split('').reverse().join('')));
    return  blocklist.splice(regular?regular:reversed, 1);
}

function getnextRowBlock(toprow, blocklist) {
    let block = getBlock(toprow, blocklist);
    let orientedblock = orientBlock(block);
    return rotateBlock(orientedblock);
}
function getNextBlock(rightrow){
    let block = getBlock(toprow, blocklist);
    return orientBlock(block);
}

function getRightEdge(block){
    return block.map(x => x.slice(-1)).join('');
}

//f generality, i'm down this specific solution. I've peeked and the orientation of the first block has matches on the right and bottom.
//Also, we are using the fact that all matching edges are unique. If pieces match they go together.
let startingblock = corners[0];

let blocklist = blocks.slice();
let startingblockindex = blocklist.findIndex(x => x.id == startingblock.id);
blocklist.splice(startingblockindex, 1);

let nextedge = rotateBlock(rotateBlock(startingblock.block))[0];
let totalblock = [];
for (let k = 0; k < 12; k++) {
    //construct the next row:
    currentrow = getnextRowBlock(nextedge, blocklist);
    nextedge = currentrow[size];
    nextrightedge = getRightEdge(currentrow);
    for (let l = 1; l < 12; l++) {
        nextblock = getNextBlock(nextblock, blocklist);
        let currentrow = addBlock(currentrow, nextblock);
        nextrightedge = getRightEdge(currentrow);
        console.log(`matched block ${nextblock.id}`);
    }
    console.log(`finished row`);
    totalblock = totalblock.slice(0, totalblock.length-1).concat(currentrow);
}


