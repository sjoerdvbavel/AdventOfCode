var input = [1, 12, 2, 3, 1, 1, 2, 3, 1, 3, 4, 3, 1, 5, 0, 3, 2, 1, 10, 19, 2, 9, 19, 23, 1, 9, 23, 27, 2, 27, 9, 31, 1, 31, 5, 35, 2, 35, 9, 39, 1, 39, 10, 43, 2, 43, 13, 47, 1, 47, 6, 51, 2, 51, 10, 55, 1, 9, 55, 59, 2, 6, 59, 63, 1, 63, 6, 67, 1, 67, 10, 71, 1, 71, 10, 75, 2, 9, 75, 79, 1, 5, 79, 83, 2, 9, 83, 87, 1, 87, 9, 91, 2, 91, 13, 95, 1, 95, 9, 99, 1, 99, 6, 103, 2, 103, 6, 107, 1, 107, 5, 111, 1, 13, 111, 115, 2, 115, 6, 119, 1, 119, 5, 123, 1, 2, 123, 127, 1, 6, 127, 0, 99, 2, 14, 0, 0];

function ExecuteStep(array, position) {
    var program = array[position];
    //console.log(array);
    while (array[position] != 99) {

        var program = array[position],
            numberone = array[position + 1],
            numbertwo = array[position + 2],
            spot2change = array[position + 3];
        if (program == 1) {

            array[spot2change] = array[numberone] + array[numbertwo];
            //console.log("Position " + spot2change + " was set to " + array[spot2change] + " ("  + array[numberone] + "+" + array[numbertwo]+") by program " + program);
        } else if (program == 2) {
            array[spot2change] = array[numberone] * array[numbertwo];
            //console.log("Position " + spot2change + " was set to " + array[spot2change] + " ("  + array[numberone] + "*" + array[numbertwo]+") by program " + program);
        } else {
            console.log("Error " + program);
        }
        position += 4;
        //console.log(array);
    }
    return array;
}

function TestValues(i, j){
    var input = [1, 12, 2, 3, 1, 1, 2, 3, 1, 3, 4, 3, 1, 5, 0, 3, 2, 1, 10, 19, 2, 9, 19, 23, 1, 9, 23, 27, 2, 27, 9, 31, 1, 31, 5, 35, 2, 35, 9, 39, 1, 39, 10, 43, 2, 43, 13, 47, 1, 47, 6, 51, 2, 51, 10, 55, 1, 9, 55, 59, 2, 6, 59, 63, 1, 63, 6, 67, 1, 67, 10, 71, 1, 71, 10, 75, 2, 9, 75, 79, 1, 5, 79, 83, 2, 9, 83, 87, 1, 87, 9, 91, 2, 91, 13, 95, 1, 95, 9, 99, 1, 99, 6, 103, 2, 103, 6, 107, 1, 107, 5, 111, 1, 13, 111, 115, 2, 115, 6, 119, 1, 119, 5, 123, 1, 2, 123, 127, 1, 6, 127, 0, 99, 2, 14, 0, 0];
    input[1] = i;
    input[2] = j;

    return ExecuteStep(input, 0)[0];
}

var i,
    j;
for (i = 0; i <= 99; i++) {
    for (j = 0; j <= 99; j++) {
        if (TestValues(i, j) == 19690720) {
            console.log("Value found!, noun = " + i + " verb = " + j)
        }
    }
}