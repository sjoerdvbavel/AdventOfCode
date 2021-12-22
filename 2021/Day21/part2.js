const { Console } = require('console');
var fs = require('fs');
const { parse } = require('path');
var path = require('path');
var filePath = path.join(__dirname, 'data.txt');
var dataset = fs.readFileSync(filePath).toString().split('\r\n').map(x => parseInt(x.split(' ')[4], 10));

var playerpositions = dataset;

// function turn() {
//     let throwplayer1 = 3 * (dicestatus % 100) + 3;
//     playerpositions[0] = ((playerpositions[0] + throwplayer1 - 1) % 10) + 1;
//     dicestatus += 3;
//     scores[0] += playerpositions[0];
//     if (scores[0] >= 1000) {
//         return -1;
//     }
//     let throwplayer2 = 3 * (dicestatus % 100) + 3;
//     playerpositions[1] = ((playerpositions[1] + throwplayer2 - 1) % 10) + 1;
//     dicestatus += 3;
//     scores[1] += playerpositions[1];
// }
// var turns = 0;
// while (Math.max(...scores) < 1000) {
//     turn();
//     turns++;
// }
// var dicethrows = dicestatus - 1;
// var losingscore = Math.min(...scores);
// console.log(`Game ended after ${turns} turns and the dice was thrown ${dicethrows} times. Losing player had ${losingscore} points.  Product: ${losingscore * dicethrows}.`);

var maxscore = 21;
var scores = [0, 0];
var waystothrow = [0, 0, 0, 1, 3, 6, 7, 6, 3, 1];
var playerpositions = dataset;
var startinggame = {
    player1position: playerpositions[0],
    player2position: playerpositions[1], player1score: 0, player2score: 0, gamefinished: false, score: 0
}; //the book that contains all relevant universes.
var universebook = {};
universebook[JSON.stringify(startinggame)] = 1;

function _getUniverseString(throw1, throw2, universeobject) {
    let newuniverseobject = JSON.parse(JSON.stringify(universeobject));
    newuniverseobject.player1position = ((newuniverseobject.player1position + throw1 - 1) % 10) + 1;
    newuniverseobject.player1score += newuniverseobject.player1position;
    if (newuniverseobject.player1score >= maxscore) {
        newuniverseobject.gamefinished = true;
        return JSON.stringify(newuniverseobject);
    }
    newuniverseobject.player2position = ((newuniverseobject.player2position + throw2 - 1) % 10) + 1;
    newuniverseobject.player2score += newuniverseobject.player2position;
    newuniverseobject.score = newuniverseobject.player1score * newuniverseobject.player2score;
    if (newuniverseobject.player2score >= maxscore) {
        newuniverseobject.gamefinished = true;
    }
    return JSON.stringify(newuniverseobject);
}

//Given a string that contains a universe and how many occurances it has, this function updates universebook.
function getNextUniverses(string, occurances) {
    let object = JSON.parse(string);
    for (throw1 of [3, 4, 5, 6, 7, 8, 9]) {
        for (throw2 of [3, 4, 5, 6, 7, 8, 9]) {
            let newuniverse = _getUniverseString(throw1, throw2, object);
            let numberofOccurancesGivenDice = occurances * waystothrow[throw1] * waystothrow[throw2];
            if (universebook[newuniverse]) {
                universebook[newuniverse] += numberofOccurancesGivenDice;
            } else {
                universebook[newuniverse] = numberofOccurancesGivenDice;
            }
        }
    }
}

var hasunfinishedgames = true;
while (hasunfinishedgames) {
    let relevantkeys = Object.keys(universebook).filter(x => !JSON.parse(x).gamefinished && universebook[x] != 0);
    if (relevantkeys.length != 0) {
        for(key of relevantkeys){
        // let nextgame = relevantkeys.sort((a, b) => JSON.parse(b).score - JSON.parse(a).score).pop();//This is rather ineffecient but care.
        getNextUniverses(key, universebook[key]);
        universebook[key] = 0;
        }
    } else {
        hasunfinishedgames = false;
    }

}

//Aggregate the results
var totalgames = Object.values(universebook).reduce((a, b) => a + b);
var player1games = Object.keys(universebook).filter(x => JSON.parse(x).player1score >= 21)
var numberplayer1games = 0;
for (let game of player1games) {
    numberplayer1games += universebook[game];
}
var player2games = Object.keys(universebook).filter(x => JSON.parse(x).player2score >= 21)
var numberplayer2games = 0;
for (let game of player2games) {
    numberplayer2games += universebook[game];
}
console.log(`Number of games where player 1 won: ${numberplayer1games}, games where player 2 won: ${numberplayer2games}. Total: ${totalgames}`);