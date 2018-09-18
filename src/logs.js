var fs = require('fs');
var dir = '';

function Logs() {
    throw new Error('Logs is a static class!');
}


Logs.write = function (content) {
    var d = new Date();
    wd = dir + d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();

    if (!fs.existsSync(wd)) {
        fs.mkdirSync(wd);
    }

    write_string = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds() + ":  " + content + "\n";

    fs.appendFile(wd + "/work.log", write_string, function (err) {
        if (err) {
            return console.log(err);
        }
    });
}


Logs.write_error = function (content) {
    var d = new Date();
    wd = dir + d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();

    if (!fs.existsSync(wd)) {
        fs.mkdirSync(wd);
    }

    write_string = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds() + ":  " + content + "\n";

    fs.appendFile(wd + "/error.log", write_string, function (err) {
        if (err) {
            return console.log(err);
        }
    });
}


module.exports = Logs;
