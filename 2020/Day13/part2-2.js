var crt = require('nodejs-chinese-remainder');

//Attempt number 2, now with chinese remain theorem!


n = [19,  37,  883,  23,  13,  17,  797,  41,  29];
a = [0,  13,  19,  27,  32,  36,  50,  60,  79];

product = n.reduce((a,b)=>a*b);
CapticalN = n.map(i => product/i);


//this function applies the euclidean algoritme to get s_i
function ExtendedGCD(n, CapticalN){
    
}

console.log( 'Suppose we have a system of congruences: ' );
console.log( '   x = 5 mod4' );
console.log( '   x = 3 mod5' );
console.log( '   x = 7 mod11' );
console.log( '  The solution is: ' + crt([5,3,7], [4,5,11]));

function egcd(a,b) {
    if (a < b) [a,b] = [b, a];
    let s = 0, old_s = 1;
    let t = 1, old_t = 0;
    let r = b, old_r = a;
    while (r != 0) {
        let q = Math.floor(old_r/r);
        [r, old_r] = [old_r - q*r, r];
        [s, old_s] = [old_s - q*s, s];
        [t, old_t] = [old_t - q*t, t];
    }
    return {s:s, r:r};
}