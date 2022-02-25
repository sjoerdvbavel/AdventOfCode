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
// function allSets(items, weights) {
//     if (weights.length == 0) {
//         return [[]];
//     }
//     let solutionSet = [];
//     for (let itemindex in items) {
//         if (items[itemindex] == weights[0]) {
//             let subsolutionSet = allSets(arrayWithoutElementAtIndex(items, itemindex), weights.slice(1));
//             for (set of subsolutionSet) {
//                 solutionSet.push([[items[itemindex]]].concat(set));
//             }
//             // returnset = returnset.concat(setsnewbins);
//         } else if (items[itemindex] < weights[0]) {
//             let newweights = weights.slice();
//             newweights[0] -= items[itemindex];
//             let setstoadd = allSets(arrayWithoutElementAtIndex(items, itemindex), newweights);
//             for (set of setstoadd) {
//                 set[0].push(items[itemindex]);
//             }
//             solutionSet = solutionSet.concat(setstoadd);
//         }
//     }
//     return solutionSet;
// }
// unitTest(allSets([10], [10]), '[[[10]]]');
// unitTest(allSets([10, 10], [10, 10]), '[[[10],[10]],[[10],[10]]]');
// unitTest(allSets([1, 2, 8, 9], [10, 10]),
//     '[[[9,1],[8,2]],[[9,1],[2,8]],[[8,2],[9,1]],[[8,2],[1,9]],[[2,8],[9,1]],[[2,8],[1,9]],[[1,9],[8,2]],[[1,9],[2,8]]]');

function getSetsWithSum(items, value) {
    if (value == 0) {
        return [[]];
    }
    let solutionSet = [];
    for (let itemindex in items) {
        if (items[itemindex] == value) {
            solutionSet.push([items[itemindex]]);
        } else if (items[itemindex] < value) {
            let partialSolutions = getSetsWithSum(items.slice(itemindex+1), value - items[itemindex]);
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
        if (items[itemindex] < sum) {
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
unitTest(hasSum([1, 2, 8, 9], 12), 'false');


//Returns whether items can be divided into 2 subsets with value as a sum.
// \exists a,b \subset items: sum(a) == sum(b) == value;
function hasValidDivision(items, value) {
    if (items.reduce((a, b) => a + b) != 2 * value) {
        return false;
    }
    return hasSum(items, value);
}

unitTest(hasValidDivision([5, 5], 5), 'true');
unitTest(hasValidDivision([3, 8, 9], 10), 'false');
unitTest(hasValidDivision([1, 2, 8, 9], 10), 'true');
unitTest(hasValidDivision([11, 8, 3, 3, 3, 3, 3, 3, 3], 20), 'true');

function getQuantumEntanglement(set) {
    return set.reduce((a, b) => a * b, 1);
}

function executePart1(dataset) {
    let packageweight = dataset.reduce((a, b) => a + b) / 3;
    let bestsolution = [];
    let amountofPackagesInFront = Infinity;
    let smallestQuantumEntanglement = Infinity;
    let sets = getSetsWithSum(dataset.sort(), packageweight);

    console.log(`found: ${sets.length} sets`);
    for (set of sets) {
        otherItems = dataset.filter(n => !set.includes(n));
        if (hasValidDivision(otherItems, packageweight)) {
            if ((set.length < amountofPackagesInFront)
                || (set.length == amountofPackagesInFront && getQuantumEntanglement(set) < smallestQuantumEntanglement)) {
                amountofPackagesInFront = set.length;
                smallestQuantumEntanglement = getQuantumEntanglement(set);
                bestsolution = set;
            }
        }
    }
    console.log(`${amountofPackagesInFront} ${JSON.stringify(bestsolution)}`);
    return smallestQuantumEntanglement;
}

function executePart2(dataset) {

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