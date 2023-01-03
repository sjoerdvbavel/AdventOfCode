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
        let numbers = line.match(/\d+/g).map(a=> Number(a));
        dataset.push({
            id: numbers[0],
            costs: [[numbers[1], 0, 0],
            [numbers[2], 0, 0],
            [numbers[3], numbers[4], 0],
            [numbers[5], 0, numbers[6]]]
        });
    }

    console.log(dataset.slice(0, 5).map(a=> JSON.stringify(a)));
    return dataset;
}

//Turn a state into a string
function codePath(state){
    return state.robots.join(',') + ',' + state.resources.join(,);
}

//Idea: do some dynamic programming on all states of robot inventory and resources.

//For all states:
// For all recipies
    //if buying this recipy is interesting, i.e.: does not reach a state that's been reached earlier/better (better = same but with more resources) 
        //add to newPaths

//Idea2: explore all interesting paths. Buy every type of robot we gather resources for.
// time,robot1,robot2,robot3,robot4, resource1, resource2, resource3, resource4


//Return a new state with the first opportunity to add a new claybot.
//We assume a wait is needed.
function buildClaybot(state, blueprint){
    let newState = JSON.parse(JSON.stringify(state));
    let cost = blueprint[0][0]
    let waitTime = Math.ceiling((blueprint[0][0] - state.resources[0]) / state.robots[0]);
    newState = gatherResources(newState, waitTime);
}


function wait(state){
    let timeleft = 24 - state.time = state.slice();
    newstate[4]
}

function GetBestPath(blueprint){
    let NewStates = [];
    let initalstate = {time: 0, resources: [0,0,0,0], robots: [1,0,0,0]};
    let maxGeodes = 0;
    let maxGeodesState = {};

    for(NewStates.length != 0){
        let state = NewStates.pop();

        let nextStates = [];
        //Build another claybot at the first chance.

        //If clay is being generated build another obsidianbot at the first chance.
        if(state.robots[1] != 0 ){

        //If obsidian is being generated build another geodebot at the first chance.
        if(state.robots[2] != 0 ){

        //If geodes are being generated just wait it out.
        if(state.robots[3] != 0 ){
            let waitState = wait(state);
            if(waitState.geodes > maxGeodes){
                maxGeodes = waitState.geodes;
                maxGeodesState = waitState;
            }
        }

        NewStates.push
        for(recipes){
            //If following the 
            if()
        }

    }
    
}

function executePart1(dataset) {
    let xlim = dataset[0].length;
    let ylim = dataset.length;
    for (let y = 0; y < ylim; y++) {
        for (let x = 0; x < xlim; x++) {
            //do something
        }
    }
    return -1;
}

function executePart2(dataset) {
    let xlim = dataset[0].length;
    let ylim = dataset.length;
    for (let y = 0; y < ylim; y++) {
        for (let x = 0; x < xlim; x++) {
            //do something
        }
    }
    return -1;
}

function execute() {
    const { performance } = require('perf_hooks');

    let testdata1 = parseData('testdata.txt');
    var starttd1 = performance.now();
    let testresult1 = executePart1(testdata1);
    var endtd1 = performance.now();
    if (testresult1) {
        console.log(`testdata part1: ${testresult1} (${Math.round(endtd1 - starttd1)} ms)`);
    }

    let testdata2 = parseData('testdata.txt');
    var starttd2 = performance.now();
    let testresult2 = executePart2(testdata2);
    var endtd2 = performance.now();
    if (testresult2) {
        console.log(`testdata part2: ${testresult2} (${Math.round(endtd2 - starttd2)} ms)`);
    }

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