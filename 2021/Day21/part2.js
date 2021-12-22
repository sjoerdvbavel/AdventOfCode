const { Console } = require('console');
var fs = require('fs');
const { parse } = require('path');
var path = require('path');
var filePath = path.join(__dirname, 'data.txt');
var dataset = fs.readFileSync(filePath).toString().split('\r\n').map(x => parseInt(x.split(' ')[4], 10));


var maxscore = 21;
//Ways to throw 3 3-sided dice to get the indexvalue, e.g waystothrow[3] == 1;
var waystothrow = [0, 0, 0, 1, 3, 6, 7, 6, 3, 1];

var startinggame = {
    player1position: dataset[0],
    player2position: dataset[1],
    player1score: 0,
    player2score: 0,
    gamefinished: false
};
var universebook = {};//the book that contains all relevant universes.
universebook[JSON.stringify(startinggame)] = 1;

//Execute the throw of player1.
function _executePlayer1(throw1, universeobject) {
    let newuniverseobject = JSON.parse(JSON.stringify(universeobject));
    newuniverseobject.player1position = ((newuniverseobject.player1position + throw1 - 1) % 10) + 1;
    newuniverseobject.player1score += newuniverseobject.player1position;
    if (newuniverseobject.player1score >= maxscore) {
        newuniverseobject.gamefinished = true;
    }
    return newuniverseobject;
}
//Execute the throw of player2.
function _executePlayer2(throw2, universeobject) {
    let newuniverseobject = JSON.parse(JSON.stringify(universeobject));
    newuniverseobject.player2position = ((newuniverseobject.player2position + throw2 - 1) % 10) + 1;
    newuniverseobject.player2score += newuniverseobject.player2position;
    if (newuniverseobject.player2score >= maxscore) {
        newuniverseobject.gamefinished = true;
    }
    return newuniverseobject;
}

//Given a string that contains a universe and how many occurances it has, this function updates universebook.
function getNextUniverses(string, occurances) {
    let object = JSON.parse(string);
    for (let throw1 of [3, 4, 5, 6, 7, 8, 9]) {
        let newuniverse = _executePlayer1(throw1, object);
        if (newuniverse.gamefinished) {//If player1 finishes player2 doesn't get to play.
            let numberofOccurancesGivenDice = occurances * waystothrow[throw1];
            let universestring = JSON.stringify(newuniverse);
            if (universebook[universestring]) {
                universebook[universestring] += numberofOccurancesGivenDice;
            } else {
                universebook[universestring] = numberofOccurancesGivenDice;
            }
        } else {
            for (let throw2 of [3, 4, 5, 6, 7, 8, 9]) {
                let newnewuniverse = _executePlayer2(throw2, newuniverse);
                let numberofOccurancesGivenDice = occurances * waystothrow[throw1] * waystothrow[throw2];
                let universestring = JSON.stringify(newnewuniverse);
                if (universebook[universestring]) {
                    universebook[universestring] += numberofOccurancesGivenDice;
                } else {
                    universebook[universestring] = numberofOccurancesGivenDice;
                }
            }
        }
    }
}

var hasunfinishedgames = true;
while (hasunfinishedgames) {
    let relevantkeys = Object.keys(universebook).filter(x => !JSON.parse(x).gamefinished && universebook[x] != 0);
    //We do all turn x situation at the same time, this means we possibly do a situation twice but it is more efficient than filtering every turn.
    if (relevantkeys.length != 0) {
        for (key of relevantkeys) {
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