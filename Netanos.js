var NER = require('./src/ner.js');
var NonContext = require('./src/types/noncontext.js');

function Netanos() {
    throw new Error('Netanos is a static class!');
}

Netanos.anon = function (string_input, callback) {
    NER.get_entities(string_input.replace('"', ''), 2).then(function (str) {
        callback(str);
    });
};

Netanos.ner = function (string_input, callback) {
    NER.get_entities(string_input.replace('"', ''), 0).then(function (str) {
        callback(str);
    });
};

Netanos.noncontext = function (string_input) {
    return NonContext.anon(string_input);
};

Netanos.combined = function (string_input, callback) {
    NER.get_entities(NonContext.anon(string_input), 1).then(function (str) {
        callback(str);
    });
};

module.exports = Netanos;
