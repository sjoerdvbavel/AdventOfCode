var fs = require('fs');
var path = require('path');
var filePath = path.join(__dirname, 'data.txt');
var dataset = fs.readFileSync(filePath).toString().split("\r\n\r\n");

//Parse the input.
var numbers = dataset[0].split(',');
var boards = dataset.slice(1).map(y => y.split("\r\n").map(x => x.split(' ').filter(x => x != '')));

function hasbingo(board, list) {
    let onlist = board.slice().map(x => x.map(y => list.includes(y)));
    for (i = 0; i < 4; i++) {
        if (onlist[i][0] && onlist[i][1] && onlist[i][2] && onlist[i][3] && onlist[i][4]) {
            return true;
        } else if (onlist[0][i] && onlist[1][i] && onlist[2][i] && onlist[3][i] && onlist[4][i]) {
            return true;
        }
    }
    return false;
}

//Get the sum of the numbers remaining on the board.
function getUnmarkedSum(board, list) {
    numberlist = board.reduce((a, b) => a.concat(b))
    remainder = numberlist.filter(ar => !list.find(rm => (rm === ar)));
    return remainder.reduce((x, y) => parseInt(x, 10) + parseInt(y, 10), 0);
}

let notfoundyet = true
for (j = 4; j < numbers.length; j++) {
    for (board of boards) {
        if (hasbingo(board, numbers.slice(0, j))) {
            if (notfoundyet) {
                let sum = getUnmarkedSum(board, numbers.slice(0, j));
                console.log('win on board: ' + JSON.stringify(board));
                console.log('list: ' + numbers.slice(0, j));
                console.log('last number ' + numbers[j - 1] + ' sum ' + sum);
                console.log('sum*lastnumber = ' + numbers[j - 1] * sum);
                notfoundyet = false;
            }
        }
    }
}