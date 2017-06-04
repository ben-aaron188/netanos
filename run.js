var netanos = require("./Netanos.js");
var input = "Max and Ben spent more than 1000 hours on writing the software. They started in August 2016 in Amsterdam.";

netanos.ner(input, function(output) {
    console.log(output);
});
