var fs = require('fs');
var path = require('path');
const { Console } = require('console');
var filePath = path.join(__dirname, 'testdata3.txt');
var array = fs.readFileSync(filePath).toString().split("\r\n");

var path1 = array[0].split(',');
var path2 = array[1];

function ParseInstruction(startx, starty, direction, distance){

}

function TurnPathIntoPointSet(path, startx, starty){
    var set = [];


    for(var i = 0; i < path.length; i++){
        var instruction = path[i],
            direction = instruction.slice(1),
            distance = instruction.slice(-1);
        if(direction == U){
            xstep = 0;
            ystep = 1;
        } else if(direction == R){
            xstep = 1;
            ystep = 0;
        } else if(direction == D){
            xstep = 0;
            ystep = -1;
        } else if(direction == L){
            xstep = -1;
            ystep = 0;
        }
        
        for(var i = 0; i < distance; i++){
            startx += xstep;
            stary += ystep;
            set.push(startx + ',' + starty);
        }
    }
    return set;

}

var set1 = TurnPathIntoPointSet(path1, 0, 0);
var set2 = TurnPathIntoPointSet(path2, 0, 0);


//take the intersection between the points.
intersection = set1.filter(n => set2.includes(n));

sortedintersection = intersection.sort(function(a,b){
    let asplit = a.split(',').parseint(10);
    let bsplit = b.split(',').parseint(10);
    return a[0]-b[0] + a[1]-b[1];
} );

console.log(sortedintersection);

