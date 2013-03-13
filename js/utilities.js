/*!
 * Math and physics functions used in the game
 */

(function( window ) {

/**
 * Extra math functions (not already in Math object)
 */
window.MathEx = {
	/**
	 * Generates a random number between low and high, inclusive.
	 */
	randInt: function( low, high ) {
		return Math.floor( Math.random() * ( high - low + 1 ) ) + low;
	}
};

/**
 * Physics functions
 */
window.Physics = {

};

})( window );