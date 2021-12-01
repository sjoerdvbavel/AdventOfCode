var fs = require('fs');
var path = require('path');
var filePath = path.join(__dirname, 'data.txt');
var array = fs.readFileSync(filePath).toString().split("\r\n");

var timestamp = parseInt(array[0]);
var buslines = array[1].split(',').filter(n => n != 'x').map(n => parseInt(n, 10));

console.log(timestamp);
console.log(buslines);

var timeslots = [];

// Make an array from timestamp to timestamp + a busline
for (var i = timestamp; i < timestamp + buslines[0]; i++) {
    timeslots[i] = 0;
}

// Add available buslines to the timeslots.
for (line of buslines) {
    for (var i = timestamp; i < timestamp + buslines[0]; i++) {
        if (i % line == 0) {
            timeslots[i] = line;
        }
    }
}
// print the first available timestamp.
for (var i = timestamp; i < timestamp + buslines[0]; i++) {
    if (timeslots[i] != 0) {
        console.log("Busline " + timeslots[i] + " leaves in " + (i - timestamp) + " (Value: " + (i - timestamp) * timeslots[i] + ")");
        break;
    }
}