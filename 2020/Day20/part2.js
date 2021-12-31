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


//Let's define a set of orientations:
// 0 up
// 1 left
// 2 down
// 3 right
// 4 upf
// 5 leftf
// 6 downf
// 7 rightf
// So up is regular, upf is regular but flipped (mirrored). The rest follows.

//orient our block:
function orientBlock(object, orientation) {
    let oldblock = object.block;
    if (orientation == 0) {//no twist
        return oldblock;
    }
    let newblock = object;
    let dim;
    for (let j = 0; j < oldblock.length; j++) {
        if (orientation == 1) {//90 degrees clockwise
            let left = oldblock.map(x => x[j]).join('');
            newblock.push(left);
        } else if (orientation == 2) { //180 deg clockwise.
            newblock.push(oldblock[size - j].split('').reverse().join(''));
        } else {// 3, 270 degrees clockwise.
            let right = oldblock.map(x => x[size - j]).reverse().join('');
            newblock.push(right);
        }
    }
    let newobject = {id: oldblock, };
    if (orientation == 1) {//90 degrees clockwise
        newobject.top = oldblock.left;
        newobject.right = oldblock.top;
        newobject.down = oldblock.right;
        newobject.left = oldblock.down;
        newobject.sides = [oldblock.sides[3], oldblock.sides[0],oldblock.sides[1],oldblock.sides[2]];
    } else if (orientation == 2) { //180 deg clockwise.
        newobject.top = oldblock.bottom;
        newobject.right = oldblock.left;
        newobject.down = oldblock.top;
        newobject.left = oldblock.rightdown;
        newobject.sides = [oldblock.sides[2], oldblock.sides[3],oldblock.sides[0],oldblock.sides[1]];    
    } else {// 3, 270 degrees clockwise.
        newobject.top = oldblock.right;
        newobject.right = oldblock.down;
        newobject.down = oldblock.right;
        newobject.left = oldblock.down;
        newobject.sides = [oldblock.sides[3], oldblock.sides[0],oldblock.sides[1],oldblock.sides[2]];
    }
    return newblock;
}

function flipBlock(block) {
    return block.reverse();
}

// Determine the orientation and flip of the block to make the left edge the matching edge.
function getOrientation(object, matchingEdge) {
    let reverseEdge = matchingEdge.split('').reverse().join('');

    if (object.edge[3] == matchingEdge) {//matching edge is left edge.
        return [0, false];
    } else if (object.edge[2] == matchingEdge) {//matching edge is top edge.
        return [1, false];
    } else if (object.edge[1] == matchingEdge) {//matching edge is right edge.
        return [2, false];
    } else if (object.edge[4] == matchingEdge) {//matching edge is bottom edge.
        return [3, false];
    } else if (object.edge[0] == reverseEdge) {//matching edge is left edge and is reversed.
        return [0, true];
    } else if (object.edge[3] == reverseEdge) {//matching edge is top edge and is reversed.
        return [0, true];
    } else if (object.edge[2] == reverseEdge) {//matching edge is right edge and is reversed.
        return [1, true];
    } else if (object.edge[1] == reverseEdge) {//matching edge is bottom edge and is reversed.
        return [0, true];
    } else{
        console.log(`Found invalid object/rotation combo. ${object.id} edge: ${matchingEdge}.`);
    }
}

function getOrientationCorner(object) {
    let reverseEdge = matchingEdge.split('').reverse().join('');

    if (object.left != 0 && object.top != 0) {//matching edge is left edge.
        return [0, false];
    } else if (object.top != 0 && object.right != 0) {//matching edge is top edge.
        return [1, false];
    } else if (object.right != 0 && object.down != 0) {//matching edge is right edge.
        return [2, false];
    } else if (object.down != 0 && object.left != 0) {//matching edge is bottom edge.
        return [3, false];
    } else if (object.left != 0 && object.down != 0) {//matching edge is left edge and is reversed.
        return [0, true];
    } else if (object.top != 0 && object.left != 0) {//matching edge is top edge and is reversed.
        return [0, true];
    } else if (object.right != 0 && object.top != 0) {//matching edge is right edge and is reversed.
        return [1, true];
    } else if (object.down != 0 && object.right != 0) {//matching edge is bottom edge and is reversed.
        return [0, true];
    } else{
        console.log(`Found invalid object/rotation combo. ${object.id} edge: ${matchingEdge}.`);
    }
}

function getNextblock(object, direction) {
    if (direction%4 == 0) {
        return blocks.find(block => block.id == object.right);
    } else if (direction%4 == 1) {
        return blocks.find(block => block.id == object.down);
    } else if (direction%4 == 2) {
        return blocks.find(block => block.id == object.left);
    } else if (direction%4 == 3) {
        return blocks.find(block => block.id == object.left);
    }
}

//Build the actual image...
//Luckely, there are only blocks with 2, 3 and 4 matches... I'll use every match.

let corners = blocks.filter(x => x.matches == 2);
let edges = blocks.filter(x => x.matches == 3);
let centers = blocks.filter(x => x.matches == 4);
console.log(corners.length + ' ' + edges.length + ' ' + centers.length);


//f generality, i'm down this specific solution. I've peeked and the orientation of the first block has matches on the right and bottom.
var startingblock = corners[0];

//Orient the startingblock:
if(startingblock.top == 0 && startingblock.left == 0){
    //Do nothing.
} else if(startingblock.left == 0 && startingblock.down == 0){
    startingblock = orientBlock(startingblock, 3);
}
let lastblock = startingblock;
let firstblock = startingblock;
totalblock = [];
for (let k = 0; k < 12; k++) {
    //construct the next row:
    firstblock = getNextblock(firstblock, 2);
    let currentrow = firstblock.block;
    let nextblock = getNextblock(firstblock, 1)
    for (let l = 1; l < 12; l++) {
        let nextblock = getNextblock(nextblock, 1)
        for (let m = 0; m < dim; m++) {
            currentrow[m] = currentrow[m].concat(nextblock[m]);
        }
    }
    totalblock = totalblock.concat(currentrow);
}