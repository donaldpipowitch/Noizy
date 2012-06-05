/**
 * Noizy
 *
 * Version: r2
 * @author: donaldpipowitch
 */

define([
        './ValueNoise',
        './GradientNoise',
        './SimplexNoise'
    ],
    function(ValueNoise, GradientNoise, SimplexNoise) {
        return {
            ValueNoise: ValueNoise,
            GradientNoise: GradientNoise,
            SimplexNoise: SimplexNoise
        }
});
