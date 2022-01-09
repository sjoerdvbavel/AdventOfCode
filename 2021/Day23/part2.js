const { Console } = require('console');
var fs = require('fs');
const { parse } = require('path');
var path = require('path');
const { off } = require('process');
const { start } = require('repl');
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
{ id: 'A2', coordinate: 15, neighbours: [11, 19] },
{ id: 'B2', coordinate: 16, neighbours: [12, 20] },
{ id: 'C2', coordinate: 17, neighbours: [13, 21] },
{ id: 'D2', coordinate: 18, neighbours: [14, 22] },
{ id: 'A3', coordinate: 19, neighbours: [15, 23] },
{ id: 'B3', coordinate: 20, neighbours: [16, 24] },
{ id: 'C3', coordinate: 21, neighbours: [17, 25] },
{ id: 'D3', coordinate: 22, neighbours: [18, 26] },
{ id: 'A4', coordinate: 23, neighbours: [19] },
{ id: 'B4', coordinate: 24, neighbours: [20] },
{ id: 'C4', coordinate: 25, neighbours: [21] },
{ id: 'D4', coordinate: 26, neighbours: [22] }];



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

//Check whether the spots below a location are a specific letter.
function _checkHome(location, string, letter) {
    for (i = location; i < spots.length; i += 4) {
        if (string[i] != letter) {
            return false;
        }
    }
    return true;
}


function _isValidMove(letter, spot, currentspot, string) {
    //Check whether moves from the hallway go to the home
    if (currentspot < 11 && spot < 11) {
        return false;
    }

    //Check whether the move isn't to an invalid spot.
    if (spot == 2 || spot == 4 || spot == 6 || spot == 8) {
        return false;
    }

    //Check whether the move doesn't remove a pod in it's place:
    if (currentspot >= 11) {
        let supposedLetter = ['A', 'B', 'C', 'D'][(currentspot + 1) % 4];
        if (string[currentspot] == supposedLetter && _checkHome(currentspot, string, supposedLetter)) {
            return false;
        }
    }

    if (spot >= 11) {
        let supposedLetter = ['A', 'B', 'C', 'D'][(spot + 1) % 4];
        //Check whether the move doesn't terminate at the wrong house.
        if (letter != supposedLetter) {
            return false;
        }

        //Check whether the move doesn't block the end of the house.
        // e.g. 11 can't be A if 15 is still '.'
        if (!_checkHome(spot + 4, string, supposedLetter)) {
            return false;
        }
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
                returnlist.push({ value: energy, string: newstring, history: [position.string, ...position.history] });
            }
        }
    }
    return returnlist;
}
function printHistory(position) {
    for (positionstring of position.history.reverse()) {
        console.log(positionstring.substring(0, 11));
        for (i = 11; i < spots.length; i += 4) {
            console.log('  ' + positionstring[i] + ' ' + positionstring[i + 1] + ' ' + positionstring[i + 2] + ' ' + positionstring[i + 3]);
        }
    }
}

//Start execute
//Remove everything not a capital or a '.'.
var startingposition = dataset.replace(/([^\.A-Z])/g, '');
startingposition = startingposition.substring(0, 15) + 'DCBADBAC' + startingposition.substring(15)
var solutionstring = "...........ABCDABCDABCDABCD";

var unexploredpositions = [{ value: 0, string: startingposition, history: [] }];
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
                if (newposition.string == solutionstring) {
                    bestSolution = newposition;
                }
            } else if (shortestpaths[newposition.string] > newposition.value) {
                shortestpaths[newposition.string] = newposition.value;
                newpositions.push(newposition);//If we improve a position we need to improv the follow positions.
                if (newposition.string == solutionstring) {
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
if (shortestpaths[solutionstring]) {
    console.log(`Found a solution with value ${shortestpaths[solutionstring]}.`);
    printHistory(bestSolution);
}