function unitTest(array, stringvalue) {
    if (JSON.stringify(array) != stringvalue) {
        console.log(`Test failed ${JSON.stringify(array)} != ${stringvalue}`);
    }
}

function parseData(filename) {
    var fs = require('fs');
    var path = require('path');
    var filePath = path.join(__dirname, filename);
    // return JSON.parse(fs.readFileSync(filePath).toString());
    return -1;
}

function executeFight(player, monster) {
    if (monster.armor - player.damage >= 0 && player.armor - monster.damage >= 0) {
        return false;
    }
    while (true) {
        monster.hitpoints = monster.hitpoints - player.damage + monster.armor;
        if (monster.hitpoints <= 0) {
            return true;
        }
        player.hitpoints = player.hitpoints - monster.damage + player.armor;
        if (player.hitpoints <= 0) {
            return false;
        }
    }
}

function executePart1(dataset) {
    // let monster = {'hitpoints': 103, 'damage': 9, 'armor': 2 };
    unitTest(executeFight({ 'hitpoints': 88, 'damage': 5, 'armor': 5 }, { 'hitpoints': 12, 'damage': 7, 'armor': 2 }), 'true');
    let weapons = [['nothing', 0, 0, 0], ['Dagger', 8, 4, 0], ['Shortsword', 10, 5, 0], ['Warhammer', 25, 6, 0], ['Longsword', 40, 7, 0], ['Greataxe', 74, 8, 0]];
    let armors = [['nothing', 0, 0, 0], ['Leather', 13, 0, 1], ['Chainmail', 31, 0, 2], ['Splintmail', 53, 0, 3], ['Bandedmail', 75, 0, 4], ['Platemail', 102, 0, 5]];
    let rings = [['nothing', 0, 0, 0], ['nothing', 0, 0, 0], ['Damage +1', 25, 1, 0], ['Damage +2', 50, 2, 0], ['Damage +3', 100, 3, 0], ['Defense +1', 20, 0, 1], ['Defense +2', 40, 0, 2], ['Defense +3', 80, 0, 3]];
    let lowestcost = Infinity;
    let bestloadout = [];
    for (let weapon of weapons) {
        for (let armor of armors) {
            for (ring1index in rings) {
                let ring1 = rings[ring1index];
                let otherrings = rings.slice(0, ring1index).concat(rings.slice(ring1index + 1, rings.length));
                for (let ring2 of otherrings) {
                    let cost = weapon[1] + armor[1] + ring1[1] + ring2[1];
                    let attack = weapon[2] + ring1[2] + ring2[2];
                    let defence = armor[3] + ring1[3] + ring2[3];
                    if (executeFight({ 'hitpoints': 100, 'damage': attack, 'armor': defence }, { 'hitpoints': 103, 'damage': 9, 'armor': 2 })) {
                        if (cost < lowestcost) {
                            lowestcost = cost;
                            bestloadout = [weapon, armor, ring1, ring2];
                        }
                        // console.log(`Won battle ${lowestcost} ${JSON.stringify(bestloadout)}`);
                    }
                }
            }
        }
    }
    console.log(`Finished ${JSON.stringify(bestloadout)}`);
    return lowestcost;
}

function executePart2(dataset) {
    // let monster = {'hitpoints': 103, 'damage': 9, 'armor': 2 };
    unitTest(executeFight({ 'hitpoints': 88, 'damage': 5, 'armor': 5 }, { 'hitpoints': 12, 'damage': 7, 'armor': 2 }), 'true');
    let weapons = [['Dagger', 8, 4, 0], ['Shortsword', 10, 5, 0], ['Warhammer', 25, 6, 0], ['Longsword', 40, 7, 0], ['Greataxe', 74, 8, 0]];
    let armors = [['nothing', 0, 0, 0], ['Leather', 13, 0, 1], ['Chainmail', 31, 0, 2], ['Splintmail', 53, 0, 3], ['Bandedmail', 75, 0, 4], ['Platemail', 102, 0, 5]];
    let rings = [['nothing', 0, 0, 0], ['nothing', 0, 0, 0], ['Damage +1', 25, 1, 0], ['Damage +2', 50, 2, 0], ['Damage +3', 100, 3, 0], ['Defense +1', 20, 0, 1], ['Defense +2', 40, 0, 2], ['Defense +3', 80, 0, 3]];
    let highestcost = -Infinity;
    let bestloadout = [];
    for (let weapon of weapons) {
        for (let armor of armors) {
            for (ring1index in rings) {
                let ring1 = rings[ring1index];
                let otherrings = rings.slice(0, ring1index).concat(rings.slice(ring1index + 1, rings.length));
                for (let ring2 of otherrings) {
                    let cost = weapon[1] + armor[1] + ring1[1] + ring2[1];
                    let attack = weapon[2] + ring1[2] + ring2[2];
                    let defence = armor[3] + ring1[3] + ring2[3];
                    if (!executeFight({ 'hitpoints': 100, 'damage': attack, 'armor': defence }, { 'hitpoints': 103, 'damage': 9, 'armor': 2 })) {
                        if (cost > highestcost) {
                            highestcost = cost;
                            bestloadout = [weapon, armor, ring1, ring2];
                        }
                        // console.log(`lost battle ${cost} ${JSON.stringify([weapon, armor, ring1, ring2])}`);
                    }
                }
            }
        }
    }
    console.log(`Finished ${JSON.stringify(bestloadout)}`);
    return highestcost;
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

    let realdata1 = parseData('data.txt');
    var startd1 = performance.now();
    let result1 = executePart1(realdata1);
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