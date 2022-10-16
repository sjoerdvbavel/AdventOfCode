const { count } = require('console');

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
        dataset.push(line.split(')'));
    }
    const unique = [...new Set(dataset.flat())];
    return { nodes: unique, edges: dataset };
}

function recursiveCountChildren(node, graph) {
    let childrenList = graph.edges.filter(x => x[0] == node);
    let count = 1;
    for (child of childrenList) {
        count += recursiveCountChildren(child[1], graph);
    }
    console.log(`node ` + node + ' has ' + count + ' children.');
    return count;
}
function recursiveCountOrbits(countObject, graph, currentNode, dist){
    let childrenList = graph.edges.filter(x => x[0] == currentNode);
    for (child of childrenList) {
        countObject[child[1]] = dist+1;
        recursiveCountOrbits(countObject, graph, child[1], dist+1);
    }
    // console.log(`node ` + currentNode + ' has ' + dist + '  orbits.');
}

function executePart1(dataset) {
    let countObject = {}
    //Initialize the nodes
    for(node of dataset.nodes){
        countObject[node] = 0;
    }
    //We use the fact that the graph is a tree and just fill all children directly recursively.
    recursiveCountOrbits(countObject, dataset, 'COM', 0);
    return Object.values(countObject).reduce((a,b)=>a +b, 0);
}
//We now need to look both directions
function recursiveCountOrbitsFlipped(countObject, graph, currentNode, dist){
    let childrenList = graph.edges.filter(x => x[0] == currentNode);
    for (child of childrenList) {
        if(dist + 1 < countObject[child[1]]){
            countObject[child[1]] = dist+1;
            recursiveCountOrbitsFlipped(countObject, graph, child[1], dist+1);
        }
    }
    let reversechildrenList = graph.edges.filter(x => x[1] == currentNode);
    for (child of reversechildrenList) {
        if(dist + 1 < countObject[child[0]]){
            countObject[child[0]] = dist+1;
            recursiveCountOrbitsFlipped(countObject, graph, child[0], dist+1);
        }
    }
    // console.log(`node ` + currentNode + ' has ' + dist + '  orbits.');
}

function executePart2(dataset) {
    let countObject = {}
    //Initialize the nodes
    for(node of dataset.nodes){
        countObject[node] = Infinity;
    }
    countObject['SAN'] = 0;
    //Generate the graph from santa's perspective
    recursiveCountOrbitsFlipped(countObject, dataset, 'SAN', 0);
    return countObject['YOU'] - 2;
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

    let testdata2 = parseData('testdata2.txt');
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