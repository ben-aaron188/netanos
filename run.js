
var netanos = require("./Netanos.js");

var val = "Steve and Bill met in New York City at Times Square 25 years ago.";


netanos.anon(val, function(data) {
    console.log(data);
});

console.log(netanos.noncontext(val));
