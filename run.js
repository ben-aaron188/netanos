var Cocopta = require("./Cocopta.js");

Cocopta.ner("Peter and Brad met in Paris 2 weeks ago.", function(output) {
    console.log(output);
});
