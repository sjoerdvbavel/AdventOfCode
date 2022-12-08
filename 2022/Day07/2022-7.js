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

    let dataset = { commands: rawDataSet, queries: [] };
    let pwd = '';
    let output = [];
    for (line of rawDataSet) {
        let parts = line.split(' ');
        if (parts[0] == '$') {
            if (output.length != 0) {
                dataset.queries.push({
                    pwd: pwd,
                    files: output
                })
                output = [];
            }
            if (line == '$ cd /') {
                pwd = ''
            } else if (line == '$ cd ..') {
                pwd = pwd.split('/').slice(0, -1).join('/');
            } else if (line != '$ ls') {// line == '$ cd x; 
                pwd = pwd + '/' + parts[2];
            }
        } else {
            if (parts[0] == 'dir') {
                output.push({ isDir: true, name: parts[1] });
            } else {
                output.push({ isDir: false, size: Number(parts[0]), name: parts[1] });
            }
        }
    }
    if (output.length != 0) {
        dataset.queries.push({
            pwd: pwd,
            files: output
        })
    }
    return dataset;
}
function traverseTree(dataset, pwd, allFolders) {
    let Totalsize = 0;
    query = dataset.queries.find(a => a.pwd == pwd);
    if (query == undefined) {
        console.log(`No query found for ${pwd}`);
    }
    for (item of query.files) {
        if (item.isDir) {
            Totalsize += traverseTree(dataset, pwd + '/' + item.name, allFolders);
        } else {
            Totalsize += item.size;
        }
    }
    allFolders.push({ name: pwd, size: Totalsize });
    // console.log(`Folder ${pwd} size ${Totalsize} ${Totalsize <= 100000}`);
    return Totalsize;
}

function executePart1(dataset) {
    let allFolders = [];
    traverseTree(dataset, '', allFolders);
    let answer = 0;
    let smallFolders = allFolders.filter(a=> a.size < 100000);
    for(folder of smallFolders){
        answer += folder.size;
    }
    return answer;
}

function executePart2(dataset) {
    let allFolders = [];
    let totalsize = traverseTree(dataset, '', allFolders);
    let unusedSpace = 70000000 - totalsize;
    let spaceToClear = 30000000 - unusedSpace;
    let FoldersLargeEnough = allFolders.filter(a=> a.size > spaceToClear);
    return Math.min(...FoldersLargeEnough.map(a => a.size));
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