var object0 = {tekopen: ['kaas']};
var object1 = {tekopen: ['groente']};
var object2 = {boodschappenlijst: [object1], prev: object0};

object2.prev.tekopen.push('brood');
object2.prev = object1;
object2.prev.tekopen.push('chocoladerozijnen');

console.log(object0.tekopen.join(' '));
console.log(object1.tekopen.join(' '));
