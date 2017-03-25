# Cocopta

Computer-automated context-preserving text anonymization.

## Summary
cocopta (**Co**mputer-automated **co**ntext-**p**reserving **t**ext **a**nonymization) is a natural language processing software that anonymizes texts by identifying and replacing named entities. The key feature of cocopta is that the anonymization preserves context that allow linguistic analyses on anonymized texts.

## Dependencies
cocopta relies on Stanford's Named Entity Recognizer (Finkel, J. R., Grenager, T. & Manning, C., 2005), a library written in Java. Therefore, this library is required to use cocopta. You can download it [here](https://nlp.stanford.edu/software/CRF-NER.shtml). Once you have it downloaded, the Stanford NER needs to be executed before cocopta can be used. This can be done as follows (with Stanford NER running on port 8080 (as an example)):

```
$ java -mx1000m -cp "$scriptdir/stanford-ner.jar:$scriptdir/lib/*" edu.stanford.nlp.ie.NERServer  -loadClassifier $scriptdir/classifiers/english.muc.7class.distsim.crf.ser.gz -port 8080 -outputFormat inlineXML
```

where `$scriptidr` is the path to the library.

Furthermore, cocopta relies on the following node.js-dependencies:

* **ner** (https://github.com/niksrc/ner)
* **promise** (https://github.com/then/promise)

## Installation & Usage
cocopta can easily be installed via npm. **NOT YET** 

```
$ npm install cocopta
```

The integration is illustrated below. The anonymization function takes the input string and a callback function as arguments and returns the anonymized string via the callback. 

```javascript
var cocopta = require("cocopta");
var input = "Peter and Brad met in Paris 2 weeks ago.";

cocopta.ner(input, function(output) {
    console.log(output);
});

/*
"Mario and Elton met in Valencia 2 weeks ago."
*/
```

Alternatively, the cocopta source-code can be integrated manually with the `Cocopta.js` file as user endpoint:  

```javascript
var cocopta = require("./Cocopta.js");
var input = "Peter and Brad met in Paris 2 weeks ago.";

cocopta.ner(input, function(output) {
    console.log(output);
});

/*
"Mario and Elton met in Valencia 2 weeks ago."
*/
```

## Documentation
cocopta offers the following functionality:

1. **Context-preserving replacement (key feature)**: each identified entity will be replaced with a numbered generic replacement depending on the entity type (e.g. Peter -> [PERSON_1], Chicago -> [LOCATION\_1]). Usage:

```javascript
var input = "Max and Ben spent more than 1000 hours on writing the software. They started in August 2016 in Amsterdam.";

cocopta.anon(input, function(output) {
    console.log(output);
});

/*
"[PERSON1] and [PERSON2] spent more than [DATE/TIME1] on writing the software. They started in [DATE/TIME2] in [LOCATION_1]."
*/
```
2. **Named entity-based replacement**: each identified entity will be replaced with a different entity of the same type (e.g. Peter -> Alfred, Chicago -> London). Usage:

```javascript
var input = "Max and Ben spent more than 1000 hours on writing the software. They started in August 2016 in Amsterdam.";

cocopta.ner(input, function(output) {
    console.log(output);
});

/*
“Barry and Rick spent more than 1000 hours on writing the software. They started in January 14 2016 in Odessa.”
*/
```
3. **Non-context preserving replacement**: this approach is not based on named entities and replaces every word starting with a capital letter and every numeric word with "XXX" instead. Usage:

```javascript
var input = "Max and Ben spent more than 1000 hours on writing the software. They started in August 2016 in Amsterdam.";

/* 
Note that the non-context preserving replacement is not asynchronous as it does not rely on the named entitiy recognition.
*/
var anonymized = cocopta.noncontext(input);

console.log(anonymized);

/*
“XXX and XXX spent more than XXX hours on writing the software. XXX started in XXX XXX in XXX.”
*/
```
4. **Combined, non-context preserving anonymization**: here the non-context preserving replacement and the named entity-based replacement are combined such that each word starting with a capital letter, each numeric word and all identified named entities are being replaced with "XXX". Usage:

```javascript
var input = "Max and Ben spent more than 1000 hours on writing the software. They started in August 2016 in Amsterdam.";

cocopta.combined(input, function(output) {
  	console.log(output);
});

/*
“XXX and XXX spent more than XXX XXX on writing the software. XXX started in XXX XXX in XXX.”
*/
```

## References

* Finkel, J. R., Grenager, T. & Manning, C. (2005, June). _Incorporating non-local information into information extraction systems by gibbs sampling_. In Proceedings of the 43rd annual meeting on association for computational linguistics (pp. 363-370). Association for Computational Linguistics.

## License

GNU © [Bennett Kleinberg](http://bkleinberg.net) & [Maximilian Mozes](http://mmozes.net)





