var nlp = require('../libs/compromise/nlp_compromise.min.js');
var Util = require('./util.js');
var weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var units = ["km", "mi", "metres", "miles", "kilometres", "seconds"];
var abbrev = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
var irreplacables = ["first", "one", "hour", "hours", "minutes", "seconds", "millisceconds", "weeks", "days", "months", "night", "now", "this month", "billion", "million", "thousand", "year"];


function Custom() {
    throw new Error('Custom is a static class!');
}

Custom.check_date = function (date, replacement, type) {
    date = Util.remove_term_terminator(date);

    if (type == 1) {
        return "XXX";
    } else if (Custom.not_replacable(date)) {
        return date;
    } else if (Custom.is_numeric_date(date)) {
        return Custom.return_numeric_date(date);
    } else if (Custom.is_numeric(date)) {
        return Custom.create_numeric(date);
    } else if (Custom.is_weekday_abbrev(date)) {
        return Custom.return_weekday_abbrev(date);
    } else if (Custom.has_numeric(date)) {
        return Custom.return_numeric(date);
    } else if (Custom.is_weekday(date)) {
        return Custom.return_weekday(date);
    } else if (Custom.is_ordinal(date)) {
        return Custom.return_ordinal(date);
    } else if (Custom.is_unit(date)) {
        return Custom.return_unit(date);
    }

    return replacement;
}

Custom.is_unit = function (date) {
    var unit;

    for (var i = 0; i < units.length; i++) {
        if (date.indexOf(units[i]) != -1) {
            unit = date.indexOf(units[i]);

            if (!isNaN(date.substring(0, unit)) && (units[i].length + date.substring(0, unit).length) == date.length) {
                return true;
            }
        }
    }

    return false;
}

Custom.return_unit = function (date) {
    var unit,
        unit_idx;

    for (var i = 0; i < units.length; i++) {
        if (date.indexOf(units[i]) != -1) {
            unit_idx = date.indexOf(units[i]);
            unit = units[i];

            break;
        }
    }

    return Custom.return_numeric(date.substring(0, unit_idx)) + unit;
}

Custom.is_weekday_abbrev = function (date) {

    for (var i = 0; i < abbrev.length; i++) {
        if (date.toLowerCase() == abbrev[i]) {
            return true;
        }
    }

    return false;
}

Custom.return_weekday_abbrev = function (date) {
    var index = Math.floor(Math.random() * abbrev.length);
    var new_abbrev = abbrev[index];

    if (date.toLowerCase() == new_abbrev) {
        return Custom.return_weekday_abbrev(date);
    } else {
        if (date.toLowerCase() != date) {
            var first = new_abbrev.substring(0, 1).toUpperCase();
            new_abbrev = first + new_abbrev.substring(1);
        }

        return new_abbrev;
    }


}

Custom.capitalise_array_entries = function () {
    var capitalised = [];

    for (var i = 0; i < irreplacables.length; i++) {
        capitalised.push(irreplacables[i][0].toUpperCase() + irreplacables[i].slice(1).toLowerCase())
    }

    return capitalised;
}

Custom.not_replacable = function (date) {
    var upper_irreplacables = Custom.capitalise_array_entries();

    if (Util.ident_inArray(date, irreplacables) || Util.ident_inArray(date, upper_irreplacables)) {
        return true;
    } else {
        return false;
    }
}

Custom.is_numeric = function (date) {
    return date.split(" ").length == 1 && !isNaN(nlp.value(date).number) && nlp.value(date).number != "" && !Custom.is_weekday(date) && !Custom.is_ordinal(date);
}

Custom.create_numeric = function (date) {
    var number = nlp.value(date).number;

    if (number == 1) {
        return date;
    } else {
        return Custom.get_numeric(number, 2);
    }
}

Custom.has_numeric = function (date) {
    var split = date.split(" ");

    for (var i = 0; i < split.length; i++) {

        if (!isNaN(split[i]) || (!isNaN(nlp.value(split[i]).number) && nlp.value(split[i]).number != "")) {
            return true;
        }

    }

    return false;
}

Custom.return_numeric = function (date) {
    var split = date.split(" ");

    for (var i = 0; i < split.length; i++) {
        var current = split[i];
        var numeric = nlp.value(current).number;

        if (!isNaN(parseInt(current)) || (!isNaN(numeric) && numeric != "")) {
            var origin = split[i];
            var replaced = Custom.get_numeric(numeric, 1);
            split[i] = replaced;

            if (split.length > 1 && i < split.length - 1) {
                var next = split[i + 1];

                if (replaced == 1) {
                    if (isNaN(parseInt(split[i + 1]))) {

                        if (next.substring(next.length - 1) == "s") {
                            if (next.substring(next.length - 3) == "ies") {
                                split[i + 1] = next.substring(0, next.length - 3) + "y";
                            } else {
                                split[i + 1] = next.substring(0, next.length - 1);
                            }
                        }
                    }
                } else if (parseInt(origin) == 1 || numeric == 1) {
                    split[i + 1] = nlp.noun(next).pluralize();
                }
            }
        }
    }

    return split.join().replace(/,/g, " ");
}

Custom.get_numeric = function (number, pl) {
    var numeric;

    if (number < 10) {
        numeric = Math.floor(Math.random() * 10) + pl;
    } else if (number < 100) {
        numeric = Math.floor(Math.random() * 100) + 1;
    } else if (number < 500) {
        numeric = Math.floor(Math.random() * 500) + 1;
    } else if (number < 1000) {
        numeric = Math.floor(Math.random() * 1000) + 1;
    } else {
        if (number < 2100) {
            if (number > parseInt(new Date().getFullYear())) {
                numeric = number + Math.floor(Math.random() * 10) + 1;
            } else {
                numeric = number - Math.floor(Math.random() * 5) + 1;
            }
        } else {
            numeric = Math.floor(Math.random() * 10000) + 1;
        }
    }

    if (numeric == number) {
        return Custom.get_numeric(number, pl);
    } else {
        return numeric;
    }

}

Custom.is_weekday = function (date) {

    for (var i = 0; i < weekdays.length; i++) {
        if (weekdays[i].toLowerCase() == date.toLowerCase() || (weekdays[i].toLowerCase() == date.substring(0, date.length - 1).toLowerCase() && date.substring(date.length - 1) == "s")) {
            return true;
        }
    }

    return false;
}

Custom.return_weekday = function (date) {
    var weekday = weekdays[Math.floor(Math.random() * weekdays.length)];

    if (weekday.toLowerCase() == date.toLowerCase()) {
        return Custom.return_weekday(date);
    } else if (date.substring(date.length - 1) == "s") {
        return weekday + "s";
    } else {
        return weekday;
    }
}

Custom.is_numeric_date = function (date) {

    if (date.length < 8 || Custom.not_valid(date)) {
        return false;
    } else {
        try {
            Date.parse(date);
        } catch (e) {
            if (Util.inArray(date, months) == true) {
                return true;
            } else {
                return false;
            }
        }

        return true;
    }

}

Custom.get_month = function () {
    var random = Math.floor(Math.random() * months.length);

    return months[random];
}

Custom.return_numeric_date = function (date) {
    var separator = Custom.get_separator(date);
    var new_date;

    if (separator == "none") {
        new_date = Custom.get_month() + " " + Custom.get_number(30) + " " + Custom.get_year(date, separator);
    } else if (separator == ".") {
        new_date = "" + Custom.get_number(30) + separator + Custom.get_number(12) + separator + Custom.get_year(date, separator);
    } else {
        new_date = "" + Custom.get_number(12) + separator + Custom.get_number(30) + separator + Custom.get_year(date, separator);
    }

    if (new_date == date) {
        return Custom.return_numeric_date(date);
    } else {
        return new_date;
    }
}

Custom.get_number = function (limit) {
    var number = Math.floor(Math.random() * limit) + 1;

    if (number < 10) {
        return "0" + number;
    } else {
        return number;
    }

}

Custom.get_year = function (date, separator) {
    var present = new Date();
    var year;

    if (separator == "none") {
        year = date.substring(date.length - 4);
    } else {
        year = date.substring(date.lastIndexOf(separator) + 1, date.length);
    }

    var diff = new Date(date).getTime() - present.getTime();

    if (diff < 0) {
        return parseInt(year) + Math.floor(Math.random() * (parseInt(year) - parseInt(present.getFullYear()))) + 1;
    } else {
        return parseInt(year) - Math.floor(Math.random() * (parseInt(year) - parseInt(present.getFullYear()))) + 1;
    }
}

Custom.not_valid = function (date) {
    var count = 0;

    if (isNaN(date.substring(date.length - 4))) {
        return true;
    }

    if (date.includes("/")) {
        count++;
    }
    if (date.includes(".")) {
        count++;
    }
    if (date.includes("-")) {
        count++;
    }
    if (Custom.includes_month(date) && date.split(" ").length < 5) {
        count++;
    }

    return count != 1;
}

Custom.includes_month = function (date) {

    for (var i = 0; i < months.length; i++) {
        if (date.includes(months[i]) || date.includes(months[i].toLowerCase())) {
            return true;
        }
    }

    return false;
}

Custom.get_separator = function (string) {
    if (string.includes("/")) {
        return "/";
    } else if (string.includes(".")) {
        return ".";
    } else if (string.includes("-")) {
        return "-";
    } else {
        return "none";
    }
}

Custom.is_ordinal = function (string) {
    var number = string.substring(string.length - 3, string.length - 2);
    var value = null,
        value_comp;

    if (isNaN(string) && !isNaN(string.substring(0, string.length - 2))) {
        value = parseInt(number);
        value_comp = parseInt(string.substring(0, string.length - 2));
    } else if (!isNaN(nlp.value(string).number)) {
        value_comp = nlp.value(string).number;
        value = value_comp % 10;
    }

    if (value != null) {

        if ((value_comp == 11 || value_comp == 12 || value_comp == 13) && string.substring(string.length - 2) == "th") {
            return true;
        }

        if (
            (value == 1 && string.substring(string.length - 2) == "st") ||
            (value == 2 && string.substring(string.length - 2) == "nd") ||
            (value == 3 && string.substring(string.length - 2) == "rd") ||
            ((value == 0 || value > 3) && string.substring(string.length - 2) == "th")
        ) {
            return true;
        }
    }

    return false;
}

Custom.return_ordinal = function (string) {
    var value = string.substring(0, string.length - 2);
    var ordinal;

    if (isNaN(value)) {
        value = nlp.value(string).number;
    }

    ordinal = Custom.get_numeric(value, 1);

    switch (ordinal % 10) {
        case 1:
            ordinal += "st";
            break;
        case 2:
            ordinal += "nd";
            break;
        case 3:
            ordinal += "rd";
            break;
        default:
            ordinal += "th";
            break;
    }

    if (parseInt(ordinal.substring(0, ordinal.length - 2)) == value) {
        return Custom.return_ordinal(string);
    } else {
        if (ordinal == "11st") {
            return "11th";
        } else if (ordinal == "12nd") {
            return "12th";
        } else if (ordinal == "13rd") {
            return "13th";
        } else {
            return ordinal;
        }
    }
}

Custom.smart_name_rep = function (data, entity, replacement) {
    var names = entity.split(" ");
    var entities = [];
    entity = new RegExp(entity.replace(/\s+/g, '\\s+'));

    if (names.length > 1 && data.indexOf(entity) == -1) {
        var re_names = replacement.split(" ");
        var or_last = Util.remove_term_terminator(names[names.length - 1]);
        var re_last = Util.remove_term_terminator(re_names[re_names.length - 1]);

        if (data.indexOf(or_last) != -1) {
            data = data.replace(entity, replacement);
            entities.push(entity + " => " + replacement);
            entities.push(or_last + " => " + re_last);

            return {
                data: data.replace(new RegExp(or_last, 'gi'), re_last),
                entities: entities,
                re_last: re_last
            };
        }
    }

    return {
        data: data,
        entities: null
    };
}

module.exports = Custom;