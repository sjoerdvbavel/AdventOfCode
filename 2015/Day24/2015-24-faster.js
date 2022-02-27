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
        dataset.push(parseInt(line));
    }

    return dataset;
}
const arrayWithoutElementAtIndex = function (arr, index) {
    return arr.slice(0, index).concat(arr.slice(parseInt(index) + 1));
}
function getSetsWithSum(items, value) {
    if (value == 0) {
        return [[]];
    }
    let solutionSet = [];
    for (let itemindex in items) {
        if (items[itemindex] == value) {
            solutionSet.push([items[itemindex]]);
        } else if (items[itemindex] < value) {
            let partialSolutions = getSetsWithSum(items.slice(parseInt(itemindex) + 1), value - items[itemindex]);
            for (set of partialSolutions) {
                solutionSet.push([items[itemindex], ...set])
            }
        }
    }
    return solutionSet;
}
unitTest(getSetsWithSum([10], 0), '[[]]');
unitTest(getSetsWithSum([10], 10), '[[10]]');
unitTest(getSetsWithSum([10, 8, 2], 10), '[[10],[8,2]]');
unitTest(getSetsWithSum([1, 2, 8, 9], 10), '[[9,1],[8,2]]');


function hasSum(items, sum) {
    if (sum == 0) {
        return true;
    }
    for (let itemindex in items) {
        if (items[itemindex] <= sum) {
            let hasSolution = hasSum(arrayWithoutElementAtIndex(items, itemindex), sum - items[itemindex]);
            if (hasSolution) {
                return true;
            }
        }
    }
    return false;
}
unitTest(hasSum([10], 0), 'true');
unitTest(hasSum([10, 2, 8], 10), 'true');
unitTest(hasSum([9, 8, 2, 1], 12), 'true');


//Returns whether items can be divided into 2 subsets with value as a sum.
// \exists a,b \subset items: sum(a) == sum(b) == value;
function hasValidDivision(items, value) {
    if (items.reduce((a, b) => a + b, 0) != 2 * value) {
        return false;
    }
    return hasSum(items, value);
}

unitTest(hasValidDivision([5, 5], 5), 'true');
unitTest(hasValidDivision([3, 8, 9], 10), 'false');
unitTest(hasValidDivision([9, 8, 2, 1], 10), 'true');
unitTest(hasValidDivision([11, 8, 3, 3, 3, 3, 3, 3, 3], 20), 'true');

function hasValidThreeWayDivision(items, value) {
    if (items.reduce((a, b) => a + b, 0) != 3 * value) {
        return false;
    }
    let setswithsum = getSetsWithSum(items, value);
    for (set of setswithsum) {
        let otherItems = items.filter(n => !set.includes(n));
        if (hasValidDivision(otherItems, value)) {
            return true;
        }
    }
    return false;
}
// unitTest(hasValidThreeWayDivision([5, 5, 5], 5), 'true');
unitTest(hasValidThreeWayDivision([10, 9, 8, 3], 10), 'false');
unitTest(hasValidThreeWayDivision([10, 9, 8, 2, 1], 10), 'true');
unitTest(hasValidThreeWayDivision([20, 11, 8, 3, 3, 3, 3, 3, 3, 3], 20), 'true');
unitTest(hasValidThreeWayDivision([1, 2, 3, 5, 7, 8, 9, 10], 15), 'true');





function getQuantumEntanglement(set) {
    return set.reduce((a, b) => a * b, 1);
}


//Return whether set A and set B overlap.
function noOverlap(setA, setB) {
    return setA.filter(n => !setB.includes(n)) != 0;
}

function Intersect(a, b) {
    return a.filter(value => b.includes(value));
}


function hasNOtherNodes(nodeSet, size, graph) {
    if (size == 0) {
        return true;
    }
    let commonNBset = nodeSet.map(x => graph[x]).reduce((a, b) => Intersect(a, b), Object.keys(graph));
    for (node of commonNBset) {
        if (hasNOtherNodes([node, ...nodeSet], size - 1, graph)) {
            return true;
        }
    }
    return false;
}
function findBestQuantumEntanglement(numberofSets, dataset) {
    let packageweight = dataset.reduce((a, b) => a + b) / numberofSets;

    //Get all sets with sum packageweight.
    let sets = getSetsWithSum(dataset.sort(), packageweight);
    console.log(`found: ${sets.length} sets`);

    //Build a graph. Nodes are linked if the sets don't overlap.
    let setstrings = sets.map(x => JSON.stringify(x));
    let graph = {};
    for (setstring of setstrings) {
        graph[setstring] = [];
    }
    for (setA of sets) {
        for (setB of sets) {
            if (setA !== setB) {
                if (noOverlap(setA, setB)) {
                    graph[JSON.stringify(setA)].push(JSON.stringify(setB));
                    graph[JSON.stringify(setB)].push(JSON.stringify(setA));
                }
            }
        }
    }
    console.log(`Finished building graph`);
    //Filter only nodes where 3 other non-overlapping nodes can be found.
    let validsetstrings = setstrings.filter(x => hasNOtherNodes([x], numberofSets - 1, graph));
    console.log(`Finished filtering graph`);
    //Find the string with the lowest NB and quantum entanglement.
    let bestsolution = [];
    let amountofPackagesInFront = Infinity;
    let smallestQuantumEntanglement = Infinity;

    for (let string of validsetstrings) {
        let set = JSON.parse(string);
        if ((set.length < amountofPackagesInFront)
            || (set.length == amountofPackagesInFront && getQuantumEntanglement(set) < smallestQuantumEntanglement)) {
            amountofPackagesInFront = set.length;
            smallestQuantumEntanglement = getQuantumEntanglement(set);
            bestsolution = set;
        }
    }

    console.log(`${amountofPackagesInFront} ${JSON.stringify(bestsolution)}`);
    return smallestQuantumEntanglement;
}
function executePart1(dataset) {
    let numberofSets = 3
    return findBestQuantumEntanglement(numberofSets, dataset);
}

function executePart2(dataset) {
    let numberofSets = 4
    return findBestQuantumEntanglement(numberofSets, dataset);
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