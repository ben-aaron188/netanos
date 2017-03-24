var Client = require('./src/client.js');
var Mock = require('./src/types/mock.js');

function Cocopta() {
    throw new Error('Cocopta is a static class!');
}

Cocopta.ner = function (string_input) {
    Client.replace_combined(string_input, 0);
}

Cocopta.partial = function (string_input) {
    Client.replace_combined(string_input, 2);
}

Cocopta.alt = function (string_input) {
    Mock.log_mock(string_input);
}

Cocopta.ult = function (string_input) {
    Client.replace_combined(Mock.mock(string_input), 1);
}

module.exports = Cocopta;


