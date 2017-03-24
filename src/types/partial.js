var Util = require('../util.js');
var NamedEntityReplacement = require('./namedEntity.js');
var entity_count = [0, 0, 0, 0, 0, 0, 0];

function Partial() {
    throw new Error('Partial is a static class!');
}

Partial.partial_replacement = function (original, data, replacements) {
    var prep = NamedEntityReplacement.preprocess_string(original);
    var replaced = [];

    for (var i = 0; i < prep.terms.length; i++) {
        var el = prep.terms[i],
            entity = -1;

        if (el.pos.Date) {
            entity = "DATE";
        } else if (el.pos.Value) {
            entity = "VALUE";
        } else if (el.pos.Organization) {
            entity = "ORGANIZATION";
        } else if (el.pos.Place) {
            entity = "LOCATION";
        } else if (el.pos.Person && el.pos.Pronoun !== true) {
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
        var entity_regex = new RegExp(current.original, 'g');

        if (current.original != "a") {
            var replacer = Partial.ner_replace_unnamed("", current.entity);

            replaced.push(current.original + " => " + replacer);
            original = original.replace(entity_regex, replacer);
        }
    }

    console.log(Partial.replace_capital_firsts(original));
}

Partial.replace_capital_firsts = function (output) {
    var split = output.split(" "),
        adj_string = output,
        replacement;

    for (var i = 1; i < split.length; i++) {

        if (split[i].length > 0) {
            if (split[i][0] === split[i][0].toUpperCase() && split[i][0] !== "[" && split[i - 1][split[i - 1].length - 1] != ".") {


                if (split[i][split[i].length - 1] == ".") {
                    if (isNaN(split[i].substring(0, [split[i].length - 1]))) {
                        entity_count[5]++;
                        replacement = "[OTHER_" + entity_count[5] + "]";
                    } else {
                        entity_count[6]++;
                        replacement = "[NUMERIC_" + entity_count[6] + "]";
                    }

                    adj_string = adj_string.replace(new RegExp(split[i].substring(0, split[i].length - 1), 'g'), replacement);
                } else {
                    if (isNaN(split[i])) {
                        entity_count[5]++;
                        replacement = "[OTHER_" + entity_count[5] + "]";
                    } else {
                        entity_count[6]++;
                        replacement = "[NUMERIC_" + entity_count[6] + "]";
                    }

                    adj_string = adj_string.replace(new RegExp(split[i], 'g'), replacement);
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
        entity_count[0]++;

        return "[DATE/TIME_" + entity_count[0] + "]";
    } else if (property == "VALUE") {
        entity_count[1]++;

        return "[NUMBER_" + entity_count[1] + "]";
    } else if (property == "PERSON") {
        entity_count[4]++;

        return "[PERSON_" + entity_count[4] + "]";
    } else if (property == "ORGANIZATION") {
        entity_count[2]++;

        return "[COMPANY_" + entity_count[2] + "]";
    } else if (property == "LOCATION") {
        entity_count[3]++;

        return "[LOCATION_" + entity_count[3] + "]";
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