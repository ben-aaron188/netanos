var assert = require('assert');
var netanos = require('../Netanos.js');
var input = "Max and Ben spent more than 1000 hours on writing the software. They started in August 2016 in Amsterdam.";

/**
 * Test for context-preserving anonymization (netanos.anon): each identified entity is replaced with an indexed
 * generic replacement of the entity type (e.g. Peter -> [PERSON_1], Chicago -> [LOCATION_1]).
 */
describe('Context-preserving anonymization (anon)', function () {
    var anonymized = "[PERSON_1] and [PERSON_2] spent more than [DATE/TIME_1] on writing the software. They started in [DATE/TIME_2] in [LOCATION_1].";

    it('should return ' + anonymized, function (done) {
        netanos.anon(input, function (output) {
            assert.equal(anonymized, output);
            done();
        });
    });
});

/**
 * Test for combined, non-context preserving anonymization (netanos.combined): the non-context preserving replacement
 * and the named entity-based replacement are combined such that each word starting with a capital letter,
 * each numeric value and all identified named entities are replaced with "XXX".
 */
describe('Combined, non-context preserving anonymization (combined)', function () {
    var anonymized = "XXX and XXX spent more than XXX XXX on writing the software. XXX started in XXX XXX in XXX.";

    it('should return ' + anonymized, function (done) {
        netanos.combined(input, function (output) {
            assert.equal(anonymized, output);
            done();
        });
    });
});

/**
 * Non-context preserving anonymization (netanos.noncontext): this approach is not based on named entities
 * and replaces every word starting with a capital letter and every numeric value with "XXX".
 */
describe('Non-context preserving anonymization (noncontext)', function () {
    var anonymized = "XXX and XXX spent more than XXX hours on writing the software. XXX started in XXX XXX in XXX.";

    it('should return ' + anonymized, function () {
        var output = netanos.noncontext(input);

        assert.equal(anonymized, output);
    });
});