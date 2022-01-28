const { start } = require('repl');
const { fileURLToPath } = require('url');

function parseData(filename) {
    var fs = require('fs');
    var path = require('path');
    var filePath = path.join(__dirname, filename);
    var rawDataSet = fs.readFileSync(filePath).toString();

    return rawDataSet.split('').map(x => parseInt(x, 10));
}
function SplitCups(cups, value) {
    if (value + 3 < cups.length) {
        return [cups.slice(value, value + 3), cups.slice(0, value).concat(cups.slice(value + 3, cups.length))];
    } else {
        let a = (value + 3) % cups.length;
        return [cups.slice(value, cups.length).concat(cups.slice(0, a)), cups.slice(a, value)];
    }
}

function nextCup(curr, i) {
    if(curr - i > 0){
        return curr - i;
    } else{
        return curr - i + 9;//Should be enough...
    }
}

function playGame(startingcups, logsteps) {
    //buildcupobjects
    let firstcup = {id: startingcups[0]};
    let prev = firstcup;
    cupobjects.push(firstcup);
    var cupobjects = [];
    for(cupnumber = 1; cupnumber< startingcups.length; cupnumber++){
        let newcup = {id: startingcups[cupnumber], prev:prev};
        prev = newcup;
        cupobjects.push(newcup);
    }
    firstcup[prev] = prev;

    //Link the cups to the lower cup.
    cupobjects.sort((a,b) => a.id - b.id);
    for(cupindex in cupobjects){
        cupobjects[cupindex].lower = cupobjects[(cupindex+1)%cupindex.length];
    }

    
    let currentcup = 0;


    for (let i = 0; i < 10; i++) {
        let currentvalue = cups[currentcup];
        let splitcups = SplitCups(cups, currentcup + 1);
        let destinationcup = splitcups[1].findIndex(x => x == nextCup(currentvalue, 1) );
        let j = 1;
        while (destinationcup == -1) {
            destinationcup = splitcups[1].findIndex(x => x == nextCup(currentvalue, j));
            j++;
        }
        if (logsteps) {
            console.log(`-- move ${i+1} --`)
            console.log(`cups: ${cups.join(' ')}`)
            console.log(`Current: ${currentvalue} pick up: ${splitcups[0].join(',')} dest: ${splitcups[1][destinationcup]}`);
        }
        cups = splitcups[1].slice(0, destinationcup + 1)
            .concat(splitcups[0])
            .concat(splitcups[1].slice(destinationcup + 1, splitcups[1].length));
        currentcup = currentcup+1%cups.length;

    }
    return cups;
}

function executePart1(dataset) {
    let result = playGame(dataset, true);
    let loc = result.findIndex(x => x == 1);
    return result.slice(loc, result.length).concat(result.slice(0, loc));
}

function executePart2(dataset) {

    return -1;
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
    // let realdata1 = parseData('data.txt');
    // let result1 = executePart1(realdata1);
    // if (result1) {
    //     console.log(`part1: ${result1}`);
    // }
    // let realdata2 = parseData('data.txt');
    // let result2 = executePart2(realdata2);
    // if (testresult2) {
    //     console.log(`part2: ${result2}`);
    // }
}

execute();