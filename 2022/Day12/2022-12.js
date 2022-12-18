//helper class for PriorityQueue
class Node {
    constructor(val, priority) {
        this.val = val;
        this.priority = priority;
    }
}

class PriorityQueue {
    constructor() {
        this.values = [];
    }
    enqueue(val, priority) {
        let newNode = new Node(val, priority);
        this.values.push(newNode);
        this.bubbleUp();
    }
    bubbleUp() {
        let idx = this.values.length - 1;
        const element = this.values[idx];
        while (idx > 0) {
            let parentIdx = Math.floor((idx - 1) / 2);
            let parent = this.values[parentIdx];
            if (element.priority >= parent.priority) break;
            this.values[parentIdx] = element;
            this.values[idx] = parent;
            idx = parentIdx;
        }
    }
    dequeue() {
        const min = this.values[0];
        const end = this.values.pop();
        if (this.values.length > 0) {
            this.values[0] = end;
            this.sinkDown();
        }
        return min;
    }
    sinkDown() {
        let idx = 0;
        const length = this.values.length;
        const element = this.values[0];
        while (true) {
            let leftChildIdx = 2 * idx + 1;
            let rightChildIdx = 2 * idx + 2;
            let leftChild, rightChild;
            let swap = null;

            if (leftChildIdx < length) {
                leftChild = this.values[leftChildIdx];
                if (leftChild.priority < element.priority) {
                    swap = leftChildIdx;
                }
            }
            if (rightChildIdx < length) {
                rightChild = this.values[rightChildIdx];
                if (
                    (swap === null && rightChild.priority < element.priority) ||
                    (swap !== null && rightChild.priority < leftChild.priority)
                ) {
                    swap = rightChildIdx;
                }
            }
            if (swap === null) break;
            this.values[idx] = this.values[swap];
            this.values[swap] = element;
            idx = swap;
        }
    }
}


class WeightedGraph {
    constructor() {
        this.adjacencyList = {};
    }
    addVertex(vertex) {
        if (!this.adjacencyList[vertex]) this.adjacencyList[vertex] = [];
    }
    addEdge(vertex1, vertex2, weight) {
        this.adjacencyList[vertex1].push({ node: vertex2, weight });
        // this.adjacencyList[vertex2].push({ node: vertex1, weight });
    }
    Dijkstra(start, finish) {
        const nodes = new PriorityQueue();
        const distances = {};
        const previous = {};
        let path = []; //to return at end
        let smallest;
        //build up initial state
        for (let vertex in this.adjacencyList) {
            if (vertex === start) {
                distances[vertex] = 0;
                nodes.enqueue(vertex, 0);
            } else {
                distances[vertex] = Infinity;
                nodes.enqueue(vertex, Infinity);
            }
            previous[vertex] = null;
        }
        // as long as there is something to visit
        while (nodes.values.length) {
            smallest = nodes.dequeue().val;
            if (smallest === finish) {
                //WE ARE DONE
                //BUILD UP PATH TO RETURN AT END
                while (previous[smallest]) {
                    path.push(smallest);
                    smallest = previous[smallest];
                }
                break;
            }
            if (smallest || distances[smallest] !== Infinity) {
                for (let neighbor in this.adjacencyList[smallest]) {
                    //find neighboring node
                    let nextNode = this.adjacencyList[smallest][neighbor];
                    //calculate new distance to neighboring node
                    let candidate = distances[smallest] + nextNode.weight;
                    let nextNeighbor = nextNode.node;
                    if (candidate < distances[nextNeighbor]) {
                        //updating new smallest distance to neighbor
                        distances[nextNeighbor] = candidate;
                        //updating previous - How we got to neighbor
                        previous[nextNeighbor] = smallest;
                        //enqueue in priority queue with new priority
                        nodes.enqueue(nextNeighbor, candidate);
                    }
                }
            }
        }
        return {path: path.concat(smallest).reverse(), dist: distances};
    }
}

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
    return rawDataSet;
}

function close(a, b) {
    if (a == 'S' || b == 'S') return a == 'a' || b == 'a';
    if (a == 'E' || b == 'E') return a == 'z' || b == 'z'|| a == 'y'|| b == 'y';
    return b.charCodeAt(0) - a.charCodeAt(0) <= 1;
}
unitTest(close('a', 'b'), 'true');
unitTest(close('b', 'c'), 'true');
unitTest(close('c', 'a'), 'true');
unitTest(close('l', 'm'), 'true');
unitTest(close('a', 'c'), 'false');
unitTest(close('a', 'S'), 'true');
unitTest(close('b', 'S'), 'false');
unitTest(close('z', 'E'), 'true');
unitTest(close('y', 'E'), 'false');
function buildGraph(set) {
    let xlim = set[0].length;
    let ylim = set.length;
    // let graph = [];
    var graph = new WeightedGraph();

    for (let y = 0; y < ylim; y++) {
        for (let x = 0; x < xlim; x++) {
            // graph.push({ value: set[y][x], x: x, y: y, nb: [], start: set[y][x] == 'S', end: set[y][x] == 'E' });
            graph.addVertex(genStr(x,y,set));
        }
    }

    for (let y = 0; y < ylim; y++) {
        for (let x = 0; x < xlim; x++) {
            let curr = set[y][x];
            let nb = [];
            // if (y > 1 && close(graph[y - 1][x].value, curr.value)) curr.nb.push(graph[y - 1][x]);
            // if (x > 1 && close(graph[y][x - 1].value, curr.value)) curr.nb.push(graph[y][x - 1]);
            // if (y < ylim - 1 && close(graph[y + 1][x].value, curr.value)) curr.nb.push(graph[y + 1][x]);
            // if (x < xlim - 1 && close(graph[y][x + 1].value, curr.value)) curr.nb.push(graph[y][x + 1]);
            // if (y > 1 && close(set[y - 1][x], curr)) graph.addEdge(x + ',' + (y - 1), x + ',' + y, 1);;
            // if (x > 1 && close(set[y][x - 1], curr)) graph.addEdge((x - 1) + ',' + y, x + ',' + y, 1);
            if (y >= 1 && close(curr, set[y - 1][x])) graph.addEdge(genStr(x, y, set), genStr(x, (y - 1), set), 1);
            if (x >= 1 && close(curr, set[y][x - 1])) graph.addEdge(genStr(x, y, set), genStr((x - 1), y, set), 1);
            if (y < ylim - 1 && close(curr, set[y + 1][x])) graph.addEdge(genStr(x, y, set), genStr(x, (y + 1), set), 1);
            if (x < xlim - 1 && close(curr, set[y][x + 1])) graph.addEdge(genStr(x, y, set), genStr((x + 1), y, set), 1);
        }
    }
    return graph;
}

function genStr(x, y, set) {
    return '(' + x + ', ' + y + " - " + set[y][x] + ')';
};

function executePart1(dataset, altStart) {
    let graph = buildGraph(dataset);
    let start = '';
    let end = '';
    for (let y = 0; y < dataset.length; y++) {
        for (let x = 0; x < dataset[0].length; x++) {
            if (dataset[y][x] == 'S') start = genStr(x,y,dataset);
            if (dataset[y][x] == 'E') end = genStr(x,y,dataset);
        }
    }
    let result = graph.Dijkstra(altStart?altStart:start, end);
    // console.log(`start: ${start} end: ${end}`);
    // console.log(result.path.join());
    // for (let y = 0; y < dataset.length; y++) {
    //     let str = '';
    //     for (let x = 0; x < dataset[0].length; x++) {
    //         str += !result.path.some(a => a == genStr(x,y,dataset))?dataset[y][x]:' ';
    //     }
    //     console.log(str);
    // }
    return result.path.length - 1;
}

function executePart2(dataset) {
    let min = Infinity;
    let minStr = [];
    for (let y = 0; y < dataset.length; y++) {
        for (let x = 0; x < dataset[0].length; x++) {
            if (dataset[y][x] == 'a'){
                let str = genStr(x,y,dataset);
                let candidate = executePart1(dataset, str);
                if(candidate < min && candidate != 0){
                    min = candidate;
                    minStr = str
                }
                // candidate == 0 || console.log(`${str} ${candidate}`);
            }
        }
    }
    console.log(minStr);
    return min;
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