const { Console } = require('console');
var fs = require('fs');
const { parse } = require('path');
var path = require('path');
const { off } = require('process');
var filePath = path.join(__dirname, 'testdata.txt');
var dataset = fs.readFileSync(filePath).toString();



// #################
// #01. 2. 3. 4. 56#
// ###A1#B1#C1#D1###
//   #A2#B2#C2#D2#
//   #############
var spots = [{ id: '0', coordinate: 0, neighbours: [1] },
{ id: '1', coordinate: 1, neighbours: [0, 2, 7] },
{ id: '2', coordinate: 2, neighbours: [1, 3, 7, 9] },
{ id: '3', coordinate: 3, neighbours: [1, 3, 9, 11] },
{ id: '4', coordinate: 4, neighbours: [3, 5, 11, 13] },
{ id: '5', coordinate: 5, neighbours: [4, 6, 13] },
{ id: '6', coordinate: 6, neighbours: [5] },
{ id: 'A1', coordinate: 7, neighbours: [1, 2, 8] },
{ id: 'A2', coordinate: 8, neighbours: [7] },
{ id: 'B1', coordinate: 9, neighbours: [2, 3, 10] },
{ id: 'B2', coordinate: 10, neighbours: [9] },
{ id: 'C1', coordinate: 11, neighbours: [3, 4, 12] },
{ id: 'C2', coordinate: 12, neighbours: [11] },
{ id: 'D1', coordinate: 13, neighbours: [4, 5, 14] },
{ id: 'D2', coordinate: 14, neighbours: [13] }];


function isMoveValid(letter, spot, currentspot) {
    if (spot == 7 || spot == 8) {
        return letter == 'A' || currentspot == 8;
    } else if (spot == 9 || spot == 10) {
        return letter == 'B' || currentspot == 10;
    } else if (spot == 11 || spot == 12) {
        return letter == 'C' || currentspot == 12;
    } else if (spot == 13 || spot == 14) {
        return letter == 'D' || currentspot == 14;
    }
    return true;
}
//Calculate how many steps there are between spot1 and spot2.
// - We know the graph is connected.
function getSteps(spot1, spot2) {
    if (spot1 != spot2) {
        let steps = 1;
        let traversedGraph = new Set([spot1]);
        let nblist = spots[spot1].neighbours;
        while (!traversedGraph.has(spot2)) {
            let newnblist = new Set();
            for (item of nblist) {
                if (item == spot2) {
                    return steps;
                }
                traversedGraph.add(item);
                //Add the neighbours of item to newnblist for the next gen.
                spots[item].neighbours.map(item => newnblist.add(item));
            }
            //After all nbs are explored we take a step and explore the neighbours' neighbours.
            steps++;
            nblist = newnblist;
        }
    } else {
        return 0;
    }
}
// Return how much energy it takes to get from spot1 to spot2 with character.
function getEnergy(spot1, spot2, character) {
    let steps = getSteps(spot1, spot2);
    if (character == 'A') {
        return steps;
    } else if (character == 'B') {
        return 10 * steps;
    } else if (character == 'C') {
        return 100 * steps;
    } else if (character == 'D') {
        return 1000 * steps;
    }
}

// Return a list of all locations where the character can come.
// No character other than 
function getValidLocations(cursor, string) {
    let character = string[cursor];
    let newlist = new Set([cursor]);
    let oldlist = new Set();
    //We keep adding neighbours of neighbours till the list no longer grows.
    while (oldlist.size != newlist.size) {
        oldlist = newlist;
        for (item of oldlist.values()) {
            for (let neighbour of spots[item].neighbours) {
                if (isMoveValid(character, neighbour, cursor) && string[neighbour] == '.') {
                    newlist.add(neighbour);
                }
            }
        }
    }
    return newlist.values();
}
function setCharAt(str,index,chr) {
    if(index > str.length-1) return str;
    return str.substring(0,index) + chr + str.substring(index+1);
}

function GetValidMoves(position) {
    let returnlist = [];
    for (let cursor = 0; cursor < position.string.length; cursor++) {
        let character = position.string[cursor];
        if (character != '.') {
            let locationlist = getValidLocations(cursor, position.string);
            for (location of locationlist) {
                let energy = position.value + getEnergy(cursor, location, character);
                //Build the new string
                let newstring = position.string;
                newstring = setCharAt(newstring, location, character);
                newstring = setCharAt(newstring, cursor, '.');
                returnlist.push({ value: energy, string: newstring });
            }
        }
    }
    return returnlist;
}


//Start execute
//Remove everything not a capital or a '.' and we remove 5 dots.
var startingposition = dataset.replace(/([^\.A-Z])/g, '').substring(5);
var positions = [{ value: 0, string: startingposition }];
while (true) {
    let newpositions = [];
    for (position of positions) {
        let newpositionslist = GetValidMoves(position);
        newpositions = newpositions.concat(newpositionslist);
    }
    positions = newpositions.sort((a,b)=> a.value - b.value);
    let result = positions.find(item => item.string == "...........AABBCCDD");
    if(result != undefined){
        console.log(`Found a solution with value ${result.value}.`);
        break;
    }
}