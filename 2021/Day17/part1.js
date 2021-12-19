var fs = require('fs');
var path = require('path');
const { off } = require('process');
var filePath = path.join(__dirname, 'data.txt');
var dataset = fs.readFileSync(filePath).toString().match(/(\-*\d+)/g).map(x => parseInt(x, 10));
var xrange = [dataset[0], dataset[1]];
var yrange = [dataset[2], dataset[3]];


//Assume xtraj > 0.
function calculateSteps(xtraj, ytraj) {
    let velocity = [xtraj, ytraj];
    let loc = [0, 0];
    let maxy = 0;

    while (loc[0] <= xrange[1] && loc[1] >= yrange[0]) {
        loc[0] += velocity[0];
        loc[1] += velocity[1];
        velocity[0] = Math.max(0, velocity[0] - 1);
        velocity[1] = velocity[1] - 1;

        //Update maxy:
        maxy = Math.max(loc[1], maxy);

        if (loc[0] >= xrange[0] && loc[0] <= xrange[1] && loc[1] >= yrange[0] && loc[1] <= yrange[1]) {
            return { reached: true, startvelocity: [xtraj, ytraj], maxy: maxy };
        }

    }
    return {reached: false, startvelocity: [xtraj, ytraj], maxy: maxy};
}

var n = 1000;
var outcomes = [];
for(x = 1; x < n; x++){
    for(y = -n; y < n; y++){
        outcomes.push(calculateSteps(x,y));
    }
}
var validoutcomes = outcomes.filter(x => x.reached);
var bestoutcomes = validoutcomes.sort((a,b) => b.maxy - a.maxy);
console.log(bestoutcomes.slice(0,10));
console.log(`Valid directions: ${validoutcomes.length}`);