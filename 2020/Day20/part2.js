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
    let lines = string.split('\r\n');
    let block = lines.slice(1);

    let id = parseInt(lines[0].substring(5, 9), 10);
    let left = block.map(x => x[0]).join('');
    let right = block.map(x => x[size - 1]).join('');
    return { id: id, block: block, sides: [lines[1], right, lines[size], left], matches: 0, top:0, right:0, bottom:0, left:0};
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

function fillBlockNeighbour(block1, direction, id){
    if(direction == 0){
        block1.top = id;
    } else if(direction == 1){
        block1.left = id;
    } else if(direction == 2){
        block1.down = id;
    } else if(direction == 3){
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
                }
            }
        }
    }
}
let idblock2matches = blocks.filter(x => x.matches == 2).map(x => x.id);
let product = idblock2matches.reduce((a, b) => a * b);

console.log('number of blocks with 2 matches: ' + JSON.stringify(idblock2matches) + ' product: ' + product);

//Build the actual image...
//Luckely, there are only blocks with 2, 3 and 4 matches... I'll use every match.

let corners = blocks.filter(x => x.matches == 2);
let edges = blocks.filter(x => x.matches == 3);
let centers = blocks.filter(x => x.matches == 4);
console.log(corners.length + ' ' + edges.length + ' ' + centers.length);

let startingblock = corners[0];

let startofrow = startingblock;

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

let sortedblockids = []
let sortedblockorientations = []

//orient our first block:

//f generality, i'm down this specific solution. I've peeked and the orientation of the first block is 

//construct the first row:

