var fs = require('fs');
var path = require('path');
const { off } = require('process');
var filePath = path.join(__dirname, 'data.txt');
var dataset = fs.readFileSync(filePath).toString().split('\r\n');




function parsePacket(object) {
    let binarystring = object.
        binarystring;
    let returnobject = object;
    returnobject.version = parseInt(binarystring.substring(0, 3), 2);
    returnobject.id = parseInt(binarystring.substring(3, 6), 2);
    let cursor = 6;//start of the packets.
    if (returnobject.id === 4) {
        let binrep = binarystring.substring(cursor + 1, cursor + 5);
        while (binarystring[cursor] == '1') {
            cursor += 5;
            binrep += binarystring.substring(cursor + 1, cursor + 5);
        }
        cursor += 5;
        returnobject.value = parseInt(binrep, 2);
        console.log(`string ${object.string} version ${returnobject.version} id ${returnobject.id} value ${returnobject.value}`);
        console.log(`binstring ${object.binarystring}`);
        return [returnobject, binarystring.substring(cursor)];
    } else {
        let lengthID = binarystring[6];
        returnobject.I = lengthID;
        let L = '';
        let subpackages = [];
        let remainderstring = '';
        if (lengthID === '0') {
            L = parseInt(binarystring.substring(7, 22), 2);
            returnobject.L = L;
            cursor = 22;//End of the 22 bits of information.
            remainderstring = binarystring.substring(cursor, cursor + L);
            cursor += L;
            while (remainderstring.length >= 11) {//11 is the smallest packet, 3 version, 3 id, 5 bits literal value.
                let result = parsePacket({ binarystring: remainderstring });
                subpackages.push(result[0]);
                remainderstring = result[1];
            }
            remainderstring = binarystring.substring(cursor);
        } else { //LengthID = 1, L is number of packages.
            L = parseInt(binarystring.substring(7, 18), 2);
            returnobject.L = L;
            cursor = 18;//End of the 11 bits of iformation.
            remainderstring = binarystring.substring(cursor);
            while (subpackages.length < L) {
                let result = parsePacket({ binarystring: remainderstring });
                subpackages.push(result[0]);
                remainderstring = result[1];
            }
        }
        returnobject.subpackages = subpackages;
        console.log(`string ${object.string} version ${returnobject.version} id ${returnobject.id} L ${L} subpackages ${subpackages.length}`);
        console.log(`binstring ${object.binarystring}`);
        return [returnobject, remainderstring];
    }

}

//Parse a single binary character to a 4 character string.
function ParseBinaryCharacter(string) {
    var binarystring = parseInt(string, 16).toString(2);
    //Add leading zeroes:
    let leadingdigit = parseInt(string[0], 16)
    if (leadingdigit < 2) {
        return '000' + binarystring;;
    } else if (leadingdigit < 4) {
        return '00' + binarystring;
    } else if (leadingdigit < 8) {
        return '0' + binarystring;
    } else {
        return binarystring;
    }
}
//Parse a hex string into binary.
function ParseBinary(string) {
    return string.split('').map(ParseBinaryCharacter).join('');
}

var datasetobjects = dataset.map((x) => {
    return { binarystring: ParseBinary(x), string: x };
});
var packets = datasetobjects.map(x => parsePacket(x)[0]);

function calcSumVersionsPacket(packet) {
    let total = packet.version;
    if (packet.subpackages) {
        for (subpacket of packet.subpackages) {
            total += calcSumVersionsPacket(subpacket);
        }
    }
    return total;
}
console.log(packets.reduce((a, b) => a + `${b.string} ${calcSumVersionsPacket(b)} \n`, ''));

//Part 2 we calculate all values in packets.

function CalcOutcomePacket(packet) {
    //Calculate the value of the subpackets.
    let outcomes = [];
    if (packet.subpackages) {
        for (let i in packet.subpackages) {
            packet.subpackages[i] = CalcOutcomePacket(packet.subpackages[i]);
            outcomes.push(packet.subpackages[i].value);
        }
    }
    if (packet.id == 0) {
        let result = outcomes.reduce((a, b) => a + b, 0);
        packet.value = result;
    } else if (packet.id == 1) {
        let result = outcomes.reduce((a, b) => a * b, 1);
        packet.value = result;
    } else if (packet.id == 2) {
        let result = Math.min(...outcomes);
        packet.value = result;
    } else if (packet.id == 3) {
        let result = Math.max(...outcomes);
        packet.value = result;
    } else if (packet.id == 4) {
        //Previously calculated.
    } else if (packet.id == 5) {
        let result = outcomes[0] > outcomes[1] ? 1 : 0;
        packet.value = result;
    } else if (packet.id == 6) {
        let result = outcomes[0] < outcomes[1] ? 1 : 0;
        packet.value = result;
    } else if (packet.id == 7) {
        let result = outcomes[0] == outcomes[1] ? 1 : 0;
        packet.value = result;
    }
    return packet;
}
updatedpackets = packets.map(CalcOutcomePacket);
console.log(updatedpackets.reduce((a, b) => a + `${b.string} ${b.value} \n`, ''));
"a";