var NER = require('./ner.js');

function Client() {
    throw new Error('Replacer is a static class!');
}

Client.replace_combined = function (string_input, type) {
    NER.get_entities(string_input.replace('"', ''), type);
}

module.exports = Client;