var test = [
    'tqokmfejs',
    'esqtbknfoj',
    'efsjackiqouyptr',
    'kfjsnotqe',
    'qskoxwtjef'
];

function CountCommonUniqChars(persons) {
    var commonAnswers = persons.pop().split('');
    for (currentperson of persons) {
        var KeepAnswers = [];
        for (Answer of commonAnswers) {
            if (currentperson.includes(Answer)) {
                KeepAnswers.push(Answer);
            }
        }
        commonAnswers = KeepAnswers;
    }
    return commonAnswers.length;
}

console.log(CountCommonUniqChars(test));