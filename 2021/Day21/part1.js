const { Console } = require('console');
var fs = require('fs');
const { parse } = require('path');
var path = require('path');
var filePath = path.join(__dirname, 'data.txt');
var dataset = fs.readFileSync(filePath).toString().split('\r\n').map(x => parseInt(x.split(' ')[4], 10));

var scores = [0, 0];
var playerpositions = dataset;
var dicestatus = 1;


function turn() {
    let throwplayer1 = 3 * (dicestatus % 100) + 3;
    playerpositions[0] = ((playerpositions[0] + throwplayer1-1) % 10)+1;
    dicestatus += 3;
    scores[0] += playerpositions[0];
    if(scores[0]>= 1000){
        return -1;
    }
    let throwplayer2 = 3 * (dicestatus % 100) + 3;
    playerpositions[1] = ((playerpositions[1] + throwplayer2-1) % 10)+1;
    dicestatus += 3;
    scores[1] += playerpositions[1];
}
var turns = 0;
while (Math.max(...scores) < 1000) {
    turn();
    turns++;
}
var dicethrows = dicestatus -1;
var losingscore = Math.min(...scores);
console.log(`Game ended after ${turns} turns and the dice was thrown ${dicethrows} times. Losing player had ${losingscore} points.  Product: ${losingscore*dicethrows}.`);