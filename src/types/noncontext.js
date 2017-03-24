function NonContext() {
    throw new Error('NonContext is a static class!');
}

NonContext.anon = function (data) {
    data = data.replace(/['"]+/g, '');

    var elements = data.match(/\S+/g);

    for (var i = 0; i < elements.length; i++) {
        var letter = elements[i].substring(0, 1);

        if (letter != letter.toLowerCase()) {
            elements[i] = "XXX";
        }
    }

    var anonymized = elements.join().replace(/,/g, " ");

    if (anonymized[anonymized.length - 1] != ".") {
        anonymized += ".";
    }

    var split = anonymized.split(" ");

    for (var i = 0; i < split.length; i++) {
        if (!isNaN(split[i])) {
            split[i] = "XXX";
        }
    }

    return split.join(" ");
}

module.exports = NonContext;