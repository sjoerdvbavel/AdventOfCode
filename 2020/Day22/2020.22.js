function parseData(filename) {
    var fs = require('fs');
    var path = require('path');
    var filePath = path.join(__dirname, filename);
    var rawDataSet = fs.readFileSync(filePath).toString().split("\r\n\r\n");

    let dataset = [];
    for (player of rawDataSet) {
        let splits = player.split('\r\n');;
        let cards = splits.slice(1, splits.length).map(x => parseInt(x, 10));
        dataset.push(cards);
    }

    return dataset;
}

function playgame(dataset) {
    let player1 = dataset[0];
    let player2 = dataset[1];
    while (player1.length != 0 && player2.length != 0) {
        card1 = player1.shift();
        card2 = player2.shift();
        if (card1 >= card2) {
            player1.push(card1);
            player1.push(card2);
        } else {
            player2.push(card2);
            player2.push(card1);
        }
    }
    return [player1, player2];
}

function calculateScore(deck) {
    let worth = 1;
    let score = 0;
    for (card of deck.reverse()) {
        score += worth * card;
        worth++;
    }
    return score;
}

function recursiveCombat(decks) {
    let player1 = decks[0].slice();
    let player2 = decks[1].slice();
    var previousdecks = new Set();

    while (player1.length != 0 && player2.length != 0) {
        let stringeddecks = JSON.stringify([player1,player2]);
        if (previousdecks.has(stringeddecks)){
            return { winner: 1, decks: [[1], []] };//Return a mockdeck
        } else {
            previousdecks = previousdecks.add(stringeddecks);
        }
        let card1 = player1.shift();
        let card2 = player2.shift();
        let roundwinner1 = true;
        if (card1 <= player1.length && card2 <= player2.length) {
            let recursivegame = recursiveCombat(
                [player1.slice(0, card1), player2.slice(0, card2)]
            );
            roundwinner1 = recursivegame.winner == 1;
        } else {
            roundwinner1 = card1 >= card2;
        }
        if (roundwinner1) {
            player1.push(card1);
            player1.push(card2);
        } else {
            player2.push(card2);
            player2.push(card1);
        }
    }
    return { winner: player1.length == 0 ? 2 : 1, decks: [player1, player2] };
}

function executePart1(dataset) {
    let finishedgame = playgame(dataset);
    if (finishedgame[0].length == 0) {
        return calculateScore(finishedgame[1]);
    } else {
        return calculateScore(finishedgame[0]);
    }
}

function executePart2(dataset) {
    let finishedgame = recursiveCombat(dataset);
    if (finishedgame.winner == 1) {
        return calculateScore(finishedgame.decks[0]);
    } else {
        return calculateScore(finishedgame.decks[1]);
    }
}

function execute() {
    let testdata1 = parseData('testdata.txt');
    let testresult1 = executePart1(testdata1);
    if (testresult1) {
        console.log(`testdata part1: ${testresult1}`);
    }
    let testdata2 = parseData('testdata.txt');
    let testresult2 = executePart2(testdata2);
    if (testresult2) {
        console.log(`testdata part2: ${testresult2}`);
    }
    let realdata1 = parseData('data.txt');
    let result1 = executePart1(realdata1);
    if (result1) {
        console.log(`part1: ${result1}`);
    }
    let realdata2 = parseData('data.txt');
    let result2 = executePart2(realdata2);
    if (testresult2) {
        console.log(`part2: ${result2}`);
    }
}

execute();