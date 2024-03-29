const { Console } = require('console');
var fs = require('fs');
const { parse } = require('path');
var path = require('path');
const { off } = require('process');
var filePath = path.join(__dirname, 'data.txt');
var dataset = fs.readFileSync(filePath).toString();



// ##################
// #012 34 56 78 910#
// ###A1#B1#C1#D1####
//   #A2#B2#C2#D2#
//   #############
var spots = [{ id: '0', coordinate: 0, neighbours: [1] },
{ id: '1', coordinate: 1, neighbours: [0, 2] },
{ id: '2', coordinate: 2, neighbours: [1, 3, 11] },
{ id: '3', coordinate: 3, neighbours: [2, 4] },
{ id: '4', coordinate: 4, neighbours: [3, 5, 12] },
{ id: '5', coordinate: 5, neighbours: [4, 6] },
{ id: '6', coordinate: 6, neighbours: [5, 7, 13] },
{ id: '7', coordinate: 7, neighbours: [6, 8] },
{ id: '8', coordinate: 8, neighbours: [7, 9, 14] },
{ id: '9', coordinate: 9, neighbours: [8, 10] },
{ id: '10', coordinate: 10, neighbours: [9] },
{ id: 'A1', coordinate: 11, neighbours: [2, 15] },
{ id: 'B1', coordinate: 12, neighbours: [4, 16] },
{ id: 'C1', coordinate: 13, neighbours: [6, 17] },
{ id: 'D1', coordinate: 14, neighbours: [8, 18] },
{ id: 'A2', coordinate: 15, neighbours: [11] },
{ id: 'B2', coordinate: 16, neighbours: [12] },
{ id: 'C2', coordinate: 17, neighbours: [13] },
{ id: 'D2', coordinate: 18, neighbours: [14] }];



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

function _isValidMove(letter, spot, currentspot, string) {
    //Check whether meves from the hallway go to the home
    if (currentspot < 11 && spot < 11) {
        return false;
    }

    //Check whether the move isn't to an invalid spot.
    if (spot == 2 || spot == 4 || spot == 6 || spot == 8) {
        return false;
    }

    //Check whether the move doesn't remove a pod in it's place:
    if (currentspot == 11 && letter == 'A' && string[15] == 'A') {
        return false;
    } else if (currentspot == 12 && letter == 'B' && string[16] == 'B') {
        return false;
    } else if (currentspot == 13 && letter == 'C' && string[17] == 'C') {
        return false;
    } else if (currentspot == 14 && letter == 'D' && string[18] == 'D') {
        return false;
    }else if (currentspot == 14 && letter == 'D' && string[18] == 'D') {
        return false;
    }else if (currentspot == 15 && letter == 'A') {
        return false;
    }else if (currentspot == 16 && letter == 'B') {
        return false;
    }else if (currentspot == 17 && letter == 'C') {
        return false;
    }else if (currentspot == 18 && letter == 'D') {
        return false;
    }

    //Check whether the move doesn't block the end of the house.
    if (spot == 11 && string[15] != 'A') {
        return false;
    } else if (spot == 12 && string[16] != 'B') {
        return false;
    } else if (spot == 13 && string[17] != 'C') {
        return false;
    } else if (spot == 14 && string[18] != 'D') {
        return false;
    }

    //Check whether the move doesn't terminate at the wrong house.
    if (spot == 11 || spot == 15) {
        return letter == 'A';
    } else if (spot == 12 || spot == 16) {
        return letter == 'B';
    } else if (spot == 13 || spot == 17) {
        return letter == 'C';
    } else if (spot == 14 || spot == 18) {
        return letter == 'D';
    }
    return true;
}

// Return a list of all locations where the character can come.
// No character other than 
function getValidLocations(cursor, string) {
    let character = string[cursor];
    let newsteplist = new Set([cursor]);
    let oldsteplist = new Set();
    let validmovelist = new Set();
    //We keep adding neighbours of neighbours till the list no longer grows.
    while (oldsteplist.size != newsteplist.size) {
        oldsteplist = new Set(newsteplist);
        for (item of oldsteplist.values()) {
            for (let neighbour of spots[item].neighbours) {
                if (string[neighbour] == '.') {
                    newsteplist.add(neighbour);
                }
                if (_isValidMove(character, neighbour, cursor, string) && string[neighbour] == '.') {
                    validmovelist.add(neighbour);
                }
            }
        }
    }
    return Array.from(validmovelist);
}

function setCharAt(str, index, chr) {
    if (index > str.length - 1) return str;
    return str.substring(0, index) + chr + str.substring(index + 1);
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
                returnlist.push({ value: energy, string: newstring, history: [position.string, ...position.history]});
            }
        }
    }
    return returnlist;
}
function printHistory(position){
    for(positionstring of position.history.reverse()){
        console.log(positionstring.substring(0,11));
        console.log('  ' + positionstring[11] + ' ' + positionstring[12]+ ' ' + positionstring[13]+ ' ' + positionstring[14]);
        console.log('  ' + positionstring[15] + ' ' + positionstring[16]+ ' ' + positionstring[17]+ ' ' + positionstring[18]);
    }
}

//Start execute
//Remove everything not a capital or a '.'.
var startingposition = dataset.replace(/([^\.A-Z])/g, '');
var unexploredpositions = [{ value: 0, string: startingposition, history: []}];
var shortestpaths = { startingposition: 0 }
var bestSolution = {};
while (unexploredpositions.length != 0) {
    let newunexploredpositions = [];
    for (let position of unexploredpositions) {
        let newpositions = [];
        let newpositionslist = GetValidMoves(position);
        for (let newposition of newpositionslist) {
            if (!shortestpaths[newposition.string]) {
                shortestpaths[newposition.string] = newposition.value;
                newpositions.push(newposition);
                if(newposition.string == "...........ABCDABCD"){
                    bestSolution = newposition;
                }
            } else if (shortestpaths[newposition.string] > newposition.value) {
                shortestpaths[newposition.string] = newposition.value;
                newpositions.push(newposition);//If we improve a position we need to improv the follow positions.
                if(newposition.string == "...........ABCDABCD"){
                    bestSolution = newposition;
                }
            }
        }
        newunexploredpositions = newunexploredpositions.concat(newpositions);

    }
    unexploredpositions = newunexploredpositions;
    console.log('finished move');
}
console.log('finished.');
if (shortestpaths["...........ABCDABCD"]) {
    console.log(`Found a solution with value ${shortestpaths["...........ABCDABCD"]}.`);
    printHistory(bestSolution);
}