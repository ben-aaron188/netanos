var Util = require('../util.js');
var NamedEntityReplacement = require('./namedEntity.js');

// var this.entity_count = [0, 0, 0, 0, 0, 0, 0];

function Partial() {
    this.entity_count = [0, 0, 0, 0, 0, 0, 0];
}

Partial.reset = function () {
    this.entity_count = [0, 0, 0, 0, 0, 0, 0];
}

Partial.partial_replacement = function (original, data, replacements, limitations, entities) {
    var prep = NamedEntityReplacement.preprocess_string(original);
    var replaced = [];

    for (var i = 0; i < prep.terms.length; i++) {
        var el = prep.terms[i],
            entity = -1;

        if (el.pos.Date && limitations.date) {
            entity = "DATE";
        } else if (el.pos.Value) {
            entity = "VALUE";
        } else if (el.pos.Organization && limitations.organization) {
            entity = "ORGANIZATION";
        } else if (el.pos.Place && limitations.location) {
            entity = "LOCATION";
        } else if (el.pos.Person && el.pos.Pronoun !== true && limitations.person) {
            entity = "PERSON";
        }

        if (entity != -1) {
            replacements.push(
                {
                    index: original.indexOf(el.text),
                    original: Util.remove_term_terminator(el.text),
                    entity: entity
                }
            );
        }
    }

    replacements = Partial.sort(Partial.toSet(replacements));

    for (var i = 0; i < replacements.length; i++) {
        var current = replacements[i];
        var entity_regex = new RegExp(Partial.remove_invalid_chars(current.original), 'g');

        if (current.original != "a") {
            var replacer = Partial.ner_replace_unnamed("", current.entity);

            replaced.push(current.original + " => " + replacer);
            original = original.replace(entity_regex, replacer);
        }
    }

    return Partial.replace_capital_firsts(original, limitations, entities);
}

Partial.remove_invalid_chars = function (string) {
    var invalid_chars = /[°"§%()\[\]{}=\\?´`'#<>|,;.:+_-]+/g;
    return string.replace(invalid_chars, "");
}

Partial.replace_capital_firsts = function (output, limitations, entities) {
    var split = output.split(" "),
        adj_string = output,
        replacement;

    for (var i = 1; i < split.length; i++) {
        if (split[i].length > 0) {
            if (Util.is_letter(split[i][0])) {
                var valid_limitation = true;
                var raw_split = Util.remove_term_terminator(split[i]);

                if (!limitations.person && entities.PERSON.indexOf(raw_split) != -1
                    || !limitations.location && entities.LOCATION.indexOf(raw_split) != -1
                    || !limitations.organization && entities.ORGANIZATION.indexOf(raw_split) != -1
                ) {
                    valid_limitation = false;
                }

                if (valid_limitation) {
                    if (split[i][0] === split[i][0].toUpperCase() && split[i][0] !== "[" && split[i - 1][split[i - 1].length - 1] != ".") {
                        if (split[i][split[i].length - 1] == ".") {
                            if (isNaN(split[i].substring(0, [split[i].length - 1]))) {
                                if (limitations.other) {
                                    this.entity_count[5]++;
                                    replacement = "[OTHER_" + this.entity_count[5] + "]";
                                    var clean_replacement = Partial.remove_invalid_chars(split[i]);

                                    if (clean_replacement != "") {
                                        adj_string = adj_string.replace(new RegExp(clean_replacement, 'g'), replacement);
                                    }
                                }
                            } else if (limitations.numeric) {
                                this.entity_count[6]++;
                                replacement = "[NUMERIC_" + this.entity_count[6] + "]";
                                var clean_replacement = Partial.remove_invalid_chars(split[i]);

                                if (clean_replacement != "") {
                                    adj_string = adj_string.replace(new RegExp(clean_replacement, 'g'), replacement);
                                }
                            }
                        } else {
                            if (isNaN(split[i])) {
                                if (limitations.other) {
                                    this.entity_count[5]++;
                                    replacement = "[OTHER_" + this.entity_count[5] + "]";
                                    var clean_replacement = Partial.remove_invalid_chars(split[i]);

                                    if (clean_replacement != "") {
                                        // adj_string = adj_string.replace(new RegExp(clean_replacement, 'g'), replacement);
                                        adj_string = Util.replace(adj_string, clean_replacement, replacement);
                                    }
                                }
                            } else if (limitations.numeric) {
                                this.entity_count[6]++;
                                replacement = "[NUMERIC_" + this.entity_count[6] + "]";
                                var clean_replacement = Partial.remove_invalid_chars(split[i]);

                                if (clean_replacement != "") {
                                    // adj_string = adj_string.replace(new RegExp(clean_replacement, 'g'), replacement);
                                    adj_string = Util.replace(adj_string, clean_replacement, replacement);
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    return adj_string;
}

Partial.toSet = function (replacements) {
    var ripped = [];

    for (var i = 0; i < replacements.length; i++) {
        var current = replacements[i],
            duplicate = false;

        for (var j = 0; j < ripped.length; j++) {
            if (Util.remove_term_terminator(current.original).toLowerCase() == Util.remove_term_terminator(ripped[j].original).toLowerCase()) {
                duplicate = true;
            }
        }

        if (!duplicate) {
            ripped.push(current);
        }

    }

    return ripped;
}

Partial.ner_replace_unnamed = function (entity, property) {

    if (property == "DATE") {
        this.entity_count[0]++;

        return "[DATE/TIME_" + this.entity_count[0] + "]";
    } else if (property == "VALUE") {
        this.entity_count[1]++;

        return "[NUMBER_" + this.entity_count[1] + "]";
    } else if (property == "PERSON") {
        this.entity_count[4]++;

        return "[PERSON_" + this.entity_count[4] + "]";
    } else if (property == "ORGANIZATION") {
        this.entity_count[2]++;

        return "[COMPANY_" + this.entity_count[2] + "]";
    } else if (property == "LOCATION") {
        this.entity_count[3]++;

        return "[LOCATION_" + this.entity_count[3] + "]";
    } else {
        return entity;
    }
}

Partial.sort = function (array) {
    for (var i = 1; i < array.length; i++) {
        for (var j = i - 1; j >= 0; j--) {
            if (array[j].index > array[j + 1].index) {
                var a = array[j];
                array[j] = array[j + 1];
                array[j + 1] = a;
            }
        }
    }

    return array;
}

module.exports = Partial;