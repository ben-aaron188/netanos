var NER = require('./src/ner.js');
var NonContext = require('./src/types/noncontext.js');

function Cocopta() {
    throw new Error('Cocopta is a static class!');
}

Cocopta.anon = function (string_input, callback) {
    NER.get_entities(string_input.replace('"', ''), 2).then(function (str) {
        callback(str);
    });
};

Cocopta.ner = function (string_input, callback) {
    NER.get_entities(string_input.replace('"', ''), 0).then(function (str) {
        callback(str);
    });
};

Cocopta.noncontext = function (string_input) {
    return NonContext.anon(string_input);
};

Cocopta.combined = function (string_input, callback) {
    NER.get_entities(Mock.mock(string_input).replace('"', ''), 1).then(function (str) {
        callback(str);
    });
};

module.exports = Cocopta;
