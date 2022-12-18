function IntCodeProgram(array, inputs, verbose) {
    function getDigit(number, digit) {
        let attempt = (number + '').split('').reverse()[digit];
        return Number(attempt ? attempt : 0);
    }
    var position = 0;
    var outputs = [];
    var steps = 0;
    // console.log(array);
    verbose && console.log(`Started program ${array} with input ${inputs}`);
    while (steps < 500) {
        var program = array[position],
            opcode = program % 100,
            OpmodeA = getDigit(program, 4),
            OpmodeB = getDigit(program, 3),
            OpmodeC = getDigit(program, 2),
            parOne = OpmodeC ? array[position + 1] : array[array[position + 1]],
            adressOne = array[position + 1];
            parTwo = OpmodeB ? array[position + 2] : array[array[position + 2]],
            //parThree = OpmodeA ? array[position + 3] : array[array[position + 3]],
            adressThree = array[position + 3];
        verbose && console.log(`${position} ${program}  values: ${parOne}(${OpmodeC}, ${array[position + 1]}) ${parTwo}(${OpmodeB}, ${array[position + 2]})`);
        if (opcode == 1) {
            array[adressThree] = parOne + parTwo;
            verbose && console.log(`wrote sum ${array[adressThree]} to ${adressThree}`);
            position += 4;
        } else if (opcode == 2) {
            array[adressThree] = parOne * parTwo;
            verbose && console.log(`wrote product ${array[adressThree]} to ${adressThree}`);
            position += 4;
        } else if (opcode == 3) {
            array[adressOne] = inputs.shift();
            position += 2;
            verbose && console.log(`wrote input ${array[adressOne]} to ${adressOne}`);
        } else if (opcode == 4) {
            outputs.push(parOne);
            verbose && console.log(`Output ${parOne} from ${position + 1}`);
            position += 2;
        } else if (opcode == 5) {
            if(parOne != 0){
                position = parTwo;
                verbose && console.log(`Set position to  ${parOne}`);
            } else{
                position += 3;
                verbose && console.log(`Skipped jump-if-true, value ${parOne}`);
            }
        }else if (opcode == 6) {
            if(parOne == 0){
                position = parTwo;
                verbose && console.log(`Set position to  ${parTwo}`);
            } else{
                position += 3;
                verbose && console.log(`Skipped jump-if-false, value ${parOne}`);
            }
        } else if (opcode == 7) {
            array[adressThree] = parOne < parTwo?1:0;
            verbose && console.log(`wrote less than ${array[adressThree]}(${parOne} < ${parTwo}) to ${adressThree}`);
            position += 4;
        }else if (opcode == 8) {
            array[adressThree] = parOne == parTwo?1:0;
            verbose && console.log(`wrote ${array[adressThree]} (${parOne} == ${parTwo}) to ${adressThree}`);
            position += 4;
        } else if (opcode == 99) {
            verbose && console.log(`Exited 99`);
            return { outputs: outputs, finalState: array };
        } else {
            console.log("Error " + opcode);
            return { outputs: outputs, finalState: array };
        }
        steps++;
    }
    console.log('Timeout');
    return 'timeout';
}

module.exports = IntCodeProgram