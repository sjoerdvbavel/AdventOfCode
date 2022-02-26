function unitTest(array, stringvalue) {
    if (JSON.stringify(array) != stringvalue) {
        console.log(`Test failed ${JSON.stringify(array)} != ${stringvalue}`);
    }
}

function parseData(filename) {
    var fs = require('fs');
    var path = require('path');
    var filePath = path.join(__dirname, filename);
    var rawDataSet = fs.readFileSync(filePath).toString().split("\r\n");

    let dataset = [];
    for (line of rawDataSet) {

        dataset.push({});
    }

    return dataset;
}
function getMoves(state) {
    let returnmoves = [];

    if (state.PlayerMana >= 53) {
        returnmoves.push('mm');
    }
    if (state.PlayerMana >= 73) {
        returnmoves.push('drain');
    }
    if (state.PlayerMana >= 113 && state.Shield <= 1) {
        returnmoves.push('shield');
    }
    if (state.PlayerMana >= 173 && state.Poison <= 1) {
        returnmoves.push('poison');
    }
    if (state.PlayerMana >= 229 && state.Recharge <= 1) {
        returnmoves.push('recharge');
    }
    return returnmoves;
}

var globalbest = Infinity;

function executeSpells(state){
        //spell effects
        if (state.Poison > 0) {
            state.MonsterHP -= 3;
        }
        if (state.Recharge > 0) {
            state.PlayerMana += 101;
        }
        //Reduce endurance
        state.Shield = Math.max(0, state.Shield - 1);
        state.Poison = Math.max(0, state.Poison - 1);
        state.Recharge = Math.max(0, state.Recharge - 1);
}

function executeMove(move, state) {
    state.Move++;
    state.PlayerHP--;
    executeSpells(state);
    //Execute move
    if (move == 'mm') {
        //     Magic Missile costs 53 mana. It instantly does 4 damage.
        state.PlayerMana -= 53;
        state.ManaSpend += 53;
        state.MonsterHP -= 4;
    } else if (move == 'drain') {
        // Drain costs 73 mana. It instantly does 2 damage and heals you for 2 hit points.
        state.PlayerMana -= 73;
        state.ManaSpend += 73;
        state.MonsterHP -= 2;
        state.PlayerHP += 2;
    } else if (move == 'shield') {
        // Shield costs 113 mana. It starts an effect that lasts for 6 turns. While it is active, your armor is increased by 7.
        state.PlayerMana -= 113;
        state.ManaSpend += 113;
        state.Shield = 6;

    } else if (move == 'poison') {
        // Poison costs 173 mana. It starts an effect that lasts for 6 turns. At the start of each turn while it is active, it deals the boss 3 damage.
        state.PlayerMana -= 173;
        state.ManaSpend += 173;
        state.Poison = 6;

    } else if (move == 'recharge') {
        // Recharge costs 229 mana. It starts an effect that lasts for 5 turns. At the start of each turn while it is active, it gives you 101 new mana.
        state.PlayerMana -= 229;
        state.ManaSpend += 229;
        state.Recharge = 5;
    }
    //Monsters turn
    if (state.Shield > 0) {
        state.PlayerHP -= 9 - 7;
    } else {
        state.PlayerHP -= 9;
    }
    executeSpells(state);

    let gameEnded = state.PlayerHP <= 1 || state.MonsterHP <= 0
    let playerWon = state.MonsterHP <= 0
    state.History[state.Move] = `Move ${state.Move}: ${move} player ${state.PlayerHP}/${state.PlayerMana} (hp/mana) Monster: ${state.MonsterHP} (mana spend:${state.ManaSpend})`
    return [gameEnded, playerWon, state.ManaSpend, state];
}

function clone(state) {
    return JSON.parse(JSON.stringify(state));
}

function exploreGame(state) {
    // if (state.Move > 26) {
    //     return Infinity;
    // }
    let moves = getMoves(state);
    let minmana = Infinity;
    for (move of moves) {
        let stateclone = clone(state);
        let result = executeMove(move, stateclone);
        let newstate = result[3];
        if (result[0]) {//Game finished
            if (result[1]) {//Player won
                // console.log(`Player won, move ${newstate.Move} mana spend ${newstate.ManaSpend}`);
                minmana = result[2] < minmana ? result[2] : minmana;
                if (result[2] < globalbest) {
                    globalbest = result[2];
                    best = newstate.History;
                }
            }
        } else {
            if (newstate.ManaSpend <= globalbest) {
                let exploreresult = exploreGame(newstate);
                minmana = exploreresult < minmana ? exploreresult : minmana;
            }
        }
    }
    return minmana;
}

function executePart1() {
    let initialState = {
        PlayerHP: 50,
        PlayerMana: 500,
        MonsterHP: 58,
        MonsterDamage: 9,
        ManaSpend: 0,
        Shield: 0,
        Recharge: 0,
        Poison: 0,
        Move: 0,
        History: {},
    };
    let bestgame = exploreGame(initialState)
    console.log(JSON.stringify(best));
    return bestgame;
}

function executePart2(dataset) {

    return -1;
}

function execute() {
    const { performance } = require('perf_hooks');

    // let testdata1 = parseData('testdata.txt');
    // var starttd1 = performance.now();
    // let testresult1 = executePart1(testdata1);
    // var endtd1 = performance.now();
    // if (testresult1) {
    //     console.log(`testdata part1: ${testresult1} (${Math.round(endtd1 - starttd1)} ms)`);
    // }

    // let testdata2 = parseData('testdata.txt');
    // var starttd2 = performance.now();
    // let testresult2 = executePart2(testdata2);
    // var endtd2 = performance.now();
    // if (testresult2) {
    //     console.log(`testdata part2: ${testresult2} (${Math.round(endtd2 - starttd2)} ms)`);
    // }

    // let realdata1 = parseData('data.txt');
    var startd1 = performance.now();
    let result1 = executePart1();
    var endd1 = performance.now();
    if (result1) {
        console.log(`part1: ${result1} (${Math.round(endd1 - startd1)} ms)`);
    }

    let realdata2 = parseData('data.txt');
    var startd2 = performance.now();
    let result2 = executePart2(realdata2);
    var endd2 = performance.now();
    if (result2) {
        console.log(`part2: ${result2} (${Math.round(endd2 - startd2)} ms)`);
    }
}

execute();