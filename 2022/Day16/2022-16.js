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
        let splits = line.split(' ');
        let rate = Number(splits[4].match(/\d+/)[0]);
        let connections = splits.slice(9).map(a => a.substring(0, 2));
        dataset.push({ id: splits[1], rate: rate, nb: [], connections: connections });
    }
    for (node of dataset) {
        for (connection of node.connections) {
            node.nb.push(dataset.find(a => a.id == connection))
        }
    }
    // console.log(dataset.slice(0, 5));
    return dataset;
}

function buildMatrix(graph) {
    let n = graph.length;
    let ids = graph.map(a => a.id);
    let matrix = [];
    for (let x = 0; x < n; x++) {
        let row = [];
        for (let y = 0; y < n; y++) {
            if (x != y) {
                row.push(Infinity);
            } else {
                row.push(0);
            }
        }
        matrix.push(row);
    }
    //Badly implemented dijkstra's
    while (matrix.flat().includes(Infinity)) {
        for (nodeXIndex in graph) {
            let nodeX = graph[nodeXIndex];
            for (nodeYIndex in graph) {
                let nodeY = graph[nodeYIndex];
                dist = matrix[nodeYIndex][nodeXIndex]
                if (dist < Infinity) {
                    for (node of nodeX.nb) {
                        let nodeIndex = ids.findIndex(a => a == node.id);
                        if (matrix[nodeYIndex][nodeIndex] > dist + 1) matrix[nodeYIndex][nodeIndex] = dist + 1;
                    }
                }
            }
        }
    }
    return matrix;
}


function calcTotalflow(order, rates, matrix) {
    let location = 0;//Location of AA in both sets
    let timeLeft = 30;
    let totalFlow = 0;
    for (valve of order) {
        timeLeft -= matrix[location][valve];//Move to vale
        timeLeft--; //Open valve
        if (timeLeft >= 0) {// to be safe
            totalFlow += rates[valve] * timeLeft;
        }
    }
    return totalFlow;
}

function GenerateOrders(array){
    // console.log(array);
    if(array.length == 1) return [array];
    let orders = [];
    for(itemIndex in array){
        let otherItems = array.slice(0, itemIndex).concat(array.slice(itemIndex+1));
        let newOrders = GenerateOrders(otherItems)
        let item = array[itemIndex]
        for(let newOrder of newOrders){
            otherItems.unshift(item);
        }
        orders = orders.concat(newOrders);
    }
    return orders;
}
unitTest(GenerateOrders([1,2,3]).length, 6);
function executePart1(dataset) {
    let matrix = buildMatrix(dataset);
    let interestingValves = dataset.filter(a => a.rate != 0);
    let valvesIndexes = interestingValves.map(a => dataset.findIndex(b => b.id == a.id));
    let rates = dataset.map(a=> a.rate);

    let maxFlow = 0;
    let maxFlowOrder = [];
    let orders = GenerateOrders(valvesIndexes) 
    console.log(`Generated order of ${valvesIndexes.length} items and got ${orders.length} orders`);
    for(order of orders){
        let flow = calcTotalflow(order, rates, matrix);
        if(flow > maxFlow){
            maxFlow = flow;
            maxFlowOrder = order;
        }
    }
    console.log(`${maxFlow} ${maxFlowOrder.map(a=> dataset[a].id)}`);
    // for (rowIndex in matrix) {
    //     console.log(`${dataset[rowIndex].id} ${matrix[rowIndex]}`);
    // }
    // for (rowIndex in dataset) {
    //     if (dataset[rowIndex].rate != 0) console.log(`${dataset[rowIndex].id} ${dataset[rowIndex].rate}`);
    // }
    return maxFlow;
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