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
    if (curr - i > 0) {
        return curr - i;
    } else {
        return curr - i + 9;//Should be enough...
    }
}


function printCups(cups, currentcup, offset) {
    let firstcup = currentcup;
    let nextcup = firstcup;
    let cupsarray = [nextcup == currentcup ? `(${nextcup.id})` : `${nextcup.id}`];
    while (nextcup.next != firstcup) {
        nextcup = nextcup.next;
        cupsarray.push(nextcup == currentcup ? `(${nextcup.id})` : ` ${nextcup.id}`);
    }
    offsetmod = offset % cupsarray.length;
    cupsstring = cupsarray.slice(cupsarray.length - offsetmod, cupsarray.length).concat(cupsarray.slice(0, cupsarray.length - offsetmod)).join(' ');
    console.log(`cups: ${cupsstring}`)
}

function playGame(startingcups, NumberOfMoves, logsteps) {
    //buildcupobjects
    let firstcup = { id: startingcups[0] };
    var cupobjects = [];
    cupobjects.push(firstcup);
    for (cupnumber = 1; cupnumber < startingcups.length; cupnumber++) {
        let newcup = { id: startingcups[cupnumber] };
        cupobjects.push(newcup);
    }
    let nextcup = cupobjects[0];
    for (cupobject of cupobjects.reverse()) {
        cupobject.next = nextcup;
        nextcup = cupobject;
    }
    //Link the cups to the lower cup.
    cupobjects.sort((a, b) => parseInt(b.id, 10) - parseInt(a.id, 10));
    for (cupindex in cupobjects) {
        cupobjects[cupindex].lower = cupobjects[(cupindex + 1) % cupobjects.length];
    }
    let currentcup = firstcup;
    for (let i = 0; i < NumberOfMoves; i++) {
        if (logsteps && i <= 10) {
            console.log(`-- move ${i + 1} --`)
            printCups(cupobjects, currentcup, i);
        }
        let pickedupcups = [];
        let cup = currentcup.next;
        for (let pickupcups = 0; pickupcups < 3; pickupcups++) {
            pickedupcups.push(cup)
            cup = cup.next;
        }
        currentcup.next = cup;
        //Get the destinationcup.
        let destinationcup = currentcup.lower;
        while (pickedupcups.includes(destinationcup)) {
            destinationcup = destinationcup.lower;
        }

        //Place the pickedupcups.
        let oldnext = destinationcup.next;
        destinationcup.next = pickedupcups[0];
        pickedupcups[pickedupcups.length - 1].next = oldnext;

        //Set the next currentcup
        currentcup = currentcup.next;
        if (logsteps && i <= 10) {
            console.log(`pick up: ${pickedupcups.map(x => x.id).join(',')}`);
            console.log(`destination: ${destinationcup.id}`);
        }
    }


    return cupobjects;
}

function executePart1(dataset) {
    let result = playGame(dataset, 100, true);
    firstcup = result[0];
    nextcup = firstcup;
    let finalcuporder = [nextcup.id];
    while (nextcup.next != firstcup) {
        nextcup = nextcup.next;
        finalcuporder.push(nextcup.id)
    }
    let loc = finalcuporder.findIndex(x => x == 1);
    return finalcuporder.slice(loc + 1, finalcuporder.length).concat(finalcuporder.slice(0, loc)).join('');
}

function executePart2(dataset) {
    let nmbrcups = 1000000;
    let nmbrmoves = 10000000;
    let totaldataset = dataset.concat(Array.from(Array(nmbrcups + 1).keys()).slice(dataset.length + 1, nmbrcups + 1));
    let result = playGame(totaldataset, nmbrmoves, false);

    let loc = result.findIndex(x => x.id == 1);
    nextno = result[loc].next;
    nextno2 = nextno.next;
    console.log(`next: ${nextno.id}, next2: ${nextno2.id}`);
    return nextno.id * nextno2.id;
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