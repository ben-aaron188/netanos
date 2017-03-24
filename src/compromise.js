var NamedEntityReplacement = require('./types/namedEntity.js');
var nlp = require('../libs/compromise/nlp_compromise.min.js');
var Custom = require('./custom.js');
var Util = require('./util.js');
var temp_replacers = [];
var replaced_arr = [];
var replacements = [];
var replaced_multi_names = [];

function Compromise() {
    throw new Error('Compromise is a static class!');
}

Compromise.add_replaced_items = function (replaced) {
    for (var i = 0; i < replaced.length; i++) {
        replacements.push(replaced[i]);
    }
}

Compromise.get_unique_replacement = function (el, bool, type) {
    Compromise.generate_replacement(el, bool, type);

    if (Util.ident_inArray(el.replacement, replacements)) {
        Compromise.generate_replacement(el, bool, type);
    }

    replacements.push(el.replacement);
}

Compromise.smart_name_rep = function (data, entity, replacement) {
    return Custom.smart_name_rep(data, entity, replacement);
}

Compromise.replace_multi_names = function (data) {
    var entities = [];

    for (var i = 0; i < replaced_multi_names.length; i++) {
        var current = replaced_multi_names[i];
        var res = Compromise.smart_name_rep(data, current.or, current.rep);

        data = res.data;

        if (res.entities) {
            for (var i = 0; i < res.entities.length; i++) {
                entities.push(res.entities[i]);
            }
        }
    }

    return {
        data: data,
        entities: entities
    };

}

Compromise.fine_tuning = function (data, used_orgs, used_locations, used_persons, used_dates, replaced_ner, type) {
    var replaced = "";
    var entities = [];
    var prep = NamedEntityReplacement.preprocess_string(data);
    Compromise.add_replaced_items(replaced_ner);

    for (var i = 0; i < prep.terms.length; i++) {
        var el = prep.terms[i];

        if (el.text == "XXX") {
            replaced += el.whitespace.preceding + el.text + el.whitespace.trailing;
        } else if (el.pos.Date || el.pos.Value && !Util.inArray(el.text, used_dates)) {
            Compromise.get_unique_replacement(el, true, type);
            replaced += el.whitespace.preceding + Util.get_term_beginning(el.text) + Custom.check_date(el.text, el.replacement, type) + Util.get_term_terminator(el.text) + el.whitespace.trailing;
            Compromise.add_to_temp(el.normal, el.replacement);

            entities.push(el.text + " => " + el.replacement);
        } else if (el.pos.Organization && !Util.inArray(el.text, used_orgs)) {
            Compromise.get_unique_replacement(el, false, type);
            replaced += el.whitespace.preceding + Util.get_term_beginning(el.text) + el.replacement + Util.get_term_terminator(el.text) + el.whitespace.trailing;
            Compromise.add_to_temp(el.normal, el.replacement);

            entities.push(el.text + " => " + el.replacement);
        } else if (el.pos.Place && !Util.inArray(el.text, used_locations)) {
            Compromise.get_unique_replacement(el, false, type);
            replaced += el.whitespace.preceding + Util.get_term_beginning(el.text) + el.replacement + Util.get_term_terminator(el.text) + el.whitespace.trailing;
            Compromise.add_to_temp(el.normal, el.replacement);

            entities.push(el.text + " => " + el.replacement);
        } else if (el.pos.Person && el.pos.Pronoun !== true && !Util.inArray(el.text, used_persons)) {
            Compromise.get_unique_replacement(el, false, type);
            replaced += el.whitespace.preceding + Util.get_term_beginning(el.text) + el.replacement + Util.get_term_terminator(el.text) + el.whitespace.trailing;
            Compromise.add_to_temp(el.normal, el.replacement);

            if (el.replacement.split(" ").length > 1) {
                replaced_multi_names.push({or: el.text, rep: el.replacement});
            }

            entities.push(el.text + " => " + el.replacement);
        } else {
            replaced += el.whitespace.preceding + el.text + el.whitespace.trailing;
        }
    }

    var fin = Compromise.replace_multi_names(replaced);

    if (fin.entities) {
        for (var i = 0; i < fin.entities.length; i++) {
            entities.push(fin.entities[i]);
        }
    }

    return {
        replaced: fin.data,
        entities: Util.remove_duplicates(entities)
    };
}

Compromise.generate_replacement = function (el, is_date, type) {

    if (type == 1) {
        el.replacement = "XXX";
    } else {
        if (is_date) {
            Compromise.define_replacement(el);
            el.replacement = Custom.check_date(el.text, el.replacement, type);
        } else {
            Compromise.define_replacement(el);
            if (el.replacement.toLowerCase() == el.text.toLowerCase()) {
                Compromise.generate_replacement(el, is_date);
            }
        }
    }
}

Compromise.define_replacement = function (term_object) {
    var category = term_object.tag;
    var length = term_object.text.split(" ").length;
    var full_name = term_object.text.split(" ").length >= 2;

    if (full_name) {
        var first = term_object.text.substring(0, term_object.text.indexOf(" "));

        category = nlp.text(first).sentences[0].terms[0].tag;
    }

    if (Util.ident_inArray(term_object.normal, replaced_arr) == false) {
        if (Util.term_is_capitalised(term_object.text)) {
            term_object.replacement = NamedEntityReplacement.get_replacement(category, 'capitalise', full_name, length);
        } else if (term_object.is_acronym()) {
            term_object.replacement = NamedEntityReplacement.get_replacement(category, 'acronym', full_name, length);
        } else {
            term_object.replacement = NamedEntityReplacement.get_replacement(category, 'none', full_name, length);
        }
    } else {
        var selected_from_object = temp_replacers.filter(function (x) {
            return x.original === term_object.normal;
        });

        term_object.replacement = selected_from_object[0].replacement;
    }
}

Compromise.add_to_temp = function (original, replacement) {
    var temp_obj = {
        original: original,
        replacement: replacement
    };

    temp_replacers.push(temp_obj);
    replaced_arr.push(temp_obj.original);
}

module.exports = Compromise;
