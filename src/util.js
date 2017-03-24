function Util() {
    throw new Error('Util is a static class!');
}

Util.contains = function (source, text) {

    for (var i = 0; i < source.length; i++) {
        var current = source[i];

        if (text.toLowerCase() == current.toLowerCase()) {
            return true;
        }

    }

    return false;
}

Util.inArray = function (element, array) {

    for (var i = 0; i < array.length; i++) {
        if (element.includes(array[i])) {
            return true;
        }
    }

    return false;
}

Util.ident_inArray = function (element, array) {

    for (var i = 0; i < array.length; i++) {
        if (element == array[i]) {
            return true;
        }
    }

    return false;
}

Util.shuffle = function (array) {
    var newarr = [];
    var currentIndex = array.length,
        temporaryValue,
        randomIndex;

    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        newarr[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return newarr;
}

Util.capitalise_string = function (stringinput) {
    var string_old = stringinput;
    var new_string = "";

    if (stringinput) {
        var names = stringinput.split(" ");

        if (names.length > 1) {

            for (var i = 0; i < names.length; i++) {
                new_string += names[i][0].toUpperCase() + names[i].slice(1).toLowerCase() + " ";
            }

            new_string = new_string.substring(0, new_string.length - 1);
        } else {
            new_string = string_old[0].toUpperCase() + string_old.slice(1).toLowerCase();
        }

        return new_string;
    } else {
        return stringinput;
    }
}

Util.term_is_capitalised = function (stringinput) {
    if (stringinput[0] == stringinput[0].toUpperCase()) {
        return true;
    } else {
        return false;
    }
}

Util.get_term_beginning = function (stringinput) {
    var punctuation = ['[', '.', ',', '/', '#', '!', '$', '%', '&', '*', ';', ':', '{', '}', '=', '-', '_', '`', '~', '(', ')', ']'];
    var first_char = stringinput[0];
    var terminator;
    if (Util.inArray(first_char, punctuation) == true) {
        terminator = first_char;
    } else {
        terminator = '';
    }

    return terminator;
}

Util.get_term_terminator = function (stringinput) {
    var punctuation = ['[', '.', ',', '/', '#', '!', '$', '%', '&', '*', ';', ':', '{', '}', '=', '-', '_', '`', '~', '(', ')', ']'];
    var last_char = stringinput[stringinput.length - 1];
    var terminator;
    if (Util.inArray(last_char, punctuation) == true) {
        terminator = last_char;
    } else {
        terminator = '';
    }

    return terminator;
}

Util.remove_duplicates = function (array) {
    var set = [];

    for (var i = 0; i < array.length; i++) {
        if (!Util.ident_inArray(array[i], set)) {
            set.push(array[i]);
        }
    }

    return set;
}

Util.remove_term_terminator = function (stringinput) {
    var punctuation = ['[', '.', ',', '/', '#', '!', '$', '%', '&', '*', ';', ':', '{', '}', '=', '-', '_', '`', '~', '(', ')', ']'];
    var last_char = stringinput[stringinput.length - 1];
    var first_char = stringinput[0];

    if (Util.inArray(last_char, punctuation) == true) {
        stringinput = stringinput.substring(0, stringinput.length - 1);
    }

    if (Util.inArray(first_char, punctuation) == true) {
        stringinput = stringinput.substring(1);
    }

    return stringinput;
}

module.exports = Util;