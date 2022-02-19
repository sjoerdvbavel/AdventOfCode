function unitTest(array, stringvalue) {
    if (JSON.stringify(array) != stringvalue) {
        console.log(`Test failed ${JSON.stringify(array)} != ${stringvalue}`);
    }
}

function parseData(filename) {
    var fs = require('fs');
    var path = require('path');
    var filePath = path.join(__dirname, filename);
    return parseInt(fs.readFileSync(filePath).toString());
}

function executePart1(dataset) {
    
    //Calc all houses until N
    let N = Math.pow(10, 7);
    let houses = new Array(N).fill(0);
    for(let i = 1; i < N; i++){
        let nexthouse = i;
        while(nexthouse < N){
            houses[nexthouse] += 10*i
            nexthouse += i;
        }
        if(houses[i]>= dataset){
            return i;
        }
        // console.log(`Finished house ${i}, housevalue = ${houses[i]}`);
    }   
    return -1;
}

function executePart2(dataset) {

    //Calc all houses until N
    let N = Math.pow(10, 7);
    let houses = new Array(N).fill(0);
    for(let i = 1; i < N; i++){
        let nexthouse = i;
        for(let j = 0; j < 50; j++){
            houses[nexthouse] += 11*i
            nexthouse += i;
        }
        if(houses[i]>= dataset){
            return i;
        }
        // console.log(`Finished house ${i}, housevalue = ${houses[i]}`);
    }   
    return -1;
}

function execute(){ 
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