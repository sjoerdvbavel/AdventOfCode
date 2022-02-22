const { isGeneratorFunction } = require('util/types');

function unitTest(array, stringvalue) {
    if (JSON.stringify(array) != stringvalue) {
        console.log(`Test failed ${JSON.stringify(array)} != ${stringvalue}`);
    }
}

function parseData(filename) {
    var fs = require('fs');
    var path = require('path');
    var filePath = path.join(__dirname, filename);
    var rawDataSet = fs.readFileSync(filePath).toString().split("\r\n\r\n");

    let rules = [];
    for (line of rawDataSet[0].split("\r\n")) {
        let splits = line.split(' => ');
        // rules.push({replace:splits[0].toLowerCase(), by: splits[1].toLowerCase() });
        rules.push({ replace: splits[0], by: splits[1] });
    }

    return [rules, rawDataSet[1]];
}

//Expand the rules so can do multiple steps in one...
function expandRules(root, rules){

}

function reduceMolecule(molecule, rules) {
    for (rule of rules) {
        let finds = [...molecule.matchAll(new RegExp(rule.by, 'g'))].map(a => a.index)
        for (find of finds.reverse()) {
            let pre = molecule.substring(0, find);
            let post = molecule.substring(find + rule.by.length, molecule.length);
            molecule = pre + rule.replace + post
        }
    }
    return molecule;
}

function executePart1(dataset) {
    let rules = dataset[0];
    let startingMol = dataset[1];
    let newMols = new Set();

    for (rule of rules) {
        finds = [...startingMol.matchAll(new RegExp(rule.replace, 'g'))].map(a => a.index)
        for (find of finds) {
            let pre = startingMol.substring(0, find);
            let post = startingMol.substring(find + rule.replace.length, startingMol.length);
            newMols.add((pre + rule.by + post));
        }
    }
    // console.log(JSON.stringify(Array.from(newMols).slice(0,5)));
    return newMols.size;
}


function removeCa(molecule, CaRules){
    
    for (rule of CaRules) {
        let finds = [...molecule.matchAll(new RegExp(rule.by, 'g'))].map(a => a.index)
        for (find of finds) {
            let pre = molecule.substring(0, find);
            let post = molecule.substring(find + rule.by.length, molecule.length);
            let newword = pre + rule.replace + post
            set.add((newword));
        }
    }
}


function executePart2(dataset) {
    let rules = dataset[0];
    let destination = 'e';
    // let rules = expandRules('e', firstrules);
    //A set with reached stuff
    let reachedMolecules = new Set();
    reachedMolecules.add(dataset[1]);
    //A set with stuff to explore
    let MoleculesToExplore = new Set();
    MoleculesToExplore.add(dataset[1]);

    let generation = 0;
    let newmolecule = reduceMolecule(dataset[1], rules.slice(0, 39));

    console.log(newmolecule);

    while (true) {
        let results = new Set();
        for (molecule of MoleculesToExplore) {
        }
        generation++;

        MoleculesToExplore = new Set();
        for (item of results) {
            if(item == destination){
                return generation;
            } else if (!reachedMolecules.has(item) && item.search('e') == -1) {
                reachedMolecules.add(item);
                MoleculesToExplore.add(item);
            } else {
                console.log(`skipped ${item}`);
            }
        }

        // if(generation < 5){
        console.log(`Guus' request: ${generation} ${MoleculesToExplore.size}`);
        // }
        if (reachedMolecules.has(destination)) {
            return generation;
        } else if (reachedMolecules.size == 0) {
            return -2;
        }
    }
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