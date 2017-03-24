var additional_female_names = require('../../libs/lexicon/female.js');
var additional_male_names = require('../../libs/lexicon/male.js');
var nlp = require('../../libs/compromise/nlp_compromise.min.js');
var Custom = require("../custom.js");
var Util = require("../util.js");
var lexicon = nlp.lexicon();

function NamedEntityReplacement() {
    throw new Error("NamedEntityReplacement is a static class!");
}

NamedEntityReplacement.preprocess_string = function (string) {
    var text_nlp = nlp.text(string);
    var input_text = text_nlp.text();
    var source_text = {
        raw: text_nlp.text(),
        normal: text_nlp.normal(),
        terms: text_nlp.terms(),
        nlp_persons_raw: nlp.text(input_text).people(),
        nlp_orgs_raw: nlp.text(input_text).organizations(),
        nlp_locations_raw: nlp.text(input_text).places(),
        nlp_values_raw: nlp.text(input_text).values(),
        nlp_dates_raw: nlp.text(input_text).dates()
    };

    source_text.terms = NamedEntityReplacement.customise_data(source_text.terms);

    return (source_text);
}

NamedEntityReplacement.customise_data = function (source) {

    for (var i = 0; i < source.length; i++) {
        var string = source[i].normal;

        if (Util.contains(additional_male_names, string)) {
            source[i].tag = "MalePerson";
            source[i].pos.Person = true;
            source[i].pos.MalePerson = true;
        } else if (Util.contains(additional_female_names, string)) {
            source[i].tag = "FemalePerson";
            source[i].pos.Person = true;
            source[i].pos.FemalePerson = true;
        }
    }

    return source;
}

NamedEntityReplacement.ext_get_replacement = function (entity, string, type) {
    var term = nlp.text(string).sentences[0].terms[0],
        replacement,
        category,
        full_name = false,
        length = string.split(" ").length;

    if (string == "XXX") {
        return string;
    }

    if (entity == "DATE") {
        return Custom.check_date(string, string, type);
    } else if (entity == "LOCATION") {
        category = "Country";
        var is_city = term.pos.City;

        if (is_city == true) {
            category = "City";
        }

    } else if (entity == "PERSON") {
        full_name = length > 1;

        if (term.pos.FemalePerson == true) {
            category = "FemalePerson";
        } else {
            category = "MalePerson";
        }
    } else if (entity == "MONEY") {
        return Custom.get_numeric(parseInt(string), 1);
    } else if (entity == "ORGANIZATION") {
        category = "Organization";
    } else {
        return string;
    }

    if (Util.term_is_capitalised(string)) {
        replacement = Util.capitalise_string(NamedEntityReplacement.get_replacement(category, 'capitalise', full_name, length));
    } else if (term.is_acronym()) {
        replacement = NamedEntityReplacement.get_replacement(category, 'acronym');
    } else {
        replacement = NamedEntityReplacement.get_replacement(category, 'none');
    }

    return replacement;

}

NamedEntityReplacement.get_replacement = function (category, special_spelling, full_name, length) {
    var alt_array = [];
    var replacer;
    var replacement;

    for (var key in lexicon) {
        var value = lexicon[key];

        if (value == category) {
            alt_array.push(key);
        }
    }

    if (full_name) {
        replacement = Util.shuffle(alt_array)[0];
        var last = replacement;

        for (var i = 1; i < length; i++) {
            var next_name = Util.shuffle(alt_array)[0];

            while (last == next_name) {
                next_name = Util.shuffle(alt_array)[0];
            }

            last = next_name;
            replacement += (" " + next_name);
        }

    } else {
        replacement = Util.shuffle(alt_array)[0];
    }

    if (special_spelling == 'capitalise') {
        replacer = Util.capitalise_string(replacement);
    } else if (special_spelling == 'acronym') {
        replacer = replacement.toUpperCase();
    } else if (special_spelling == 'none') {
        replacer = replacement;
    }
    return replacer;
}

module.exports = NamedEntityReplacement;