/**
 * Pseudo random number geneator (PRNG)
 *
 * Robert Jenkins' 32 bit integer hash function.
 * src: http://stackoverflow.com/questions/3428136/javascript-integer-math-incorrect-results/3428186#3428186
 *
 * Returns values from 0 to -1.
 * Use static functions PRNG.hash | PRNG.random
 * or create a new PRNG instance with specific seed (optional).
 *
 * Version: r1
 * @author: donaldpipowitch
 */

define(function() {

    // returns values from 0 to 1
    var PRNG = function(seed) {

        // specific seed or default seed
        var _seed = seed ? seed : 49734321;

        // get pseudo random
        PRNG.prototype.random = function() {
            _seed = ((_seed + 0x7ed55d16) + (_seed << 12))  & 0xffffffff;
            _seed = ((_seed ^ 0xc761c23c) ^ (_seed >>> 19)) & 0xffffffff;
            _seed = ((_seed + 0x165667b1) + (_seed << 5))   & 0xffffffff;
            _seed = ((_seed + 0xd3a2646c) ^ (_seed << 9))   & 0xffffffff;
            _seed = ((_seed + 0xfd7046c5) + (_seed << 3))   & 0xffffffff;
            _seed = ((_seed ^ 0xb55a4f09) ^ (_seed >>> 16)) & 0xffffffff;
            return (_seed & 0xfffffff) / 0x10000000;
        };

    };

    // static function: returns pseudo random value from PRNG singleton (default seed)
    PRNG.random = (function() {
        var prng = new PRNG();
        return prng.random;
    })();

    // static function: simple hash
    PRNG.hash = function(x) {
        x = ((x + 0x7ed55d16) + (x << 12))  & 0xffffffff;
        x = ((x ^ 0xc761c23c) ^ (x >>> 19)) & 0xffffffff;
        x = ((x + 0x165667b1) + (x << 5))   & 0xffffffff;
        x = ((x + 0xd3a2646c) ^ (x << 9))   & 0xffffffff;
        x = ((x + 0xfd7046c5) + (x << 3))   & 0xffffffff;
        x = ((x ^ 0xb55a4f09) ^ (x >>> 16)) & 0xffffffff;
        return (x & 0xfffffff) / 0x10000000;
    };

    return PRNG;
});
