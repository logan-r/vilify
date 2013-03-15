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
	},
	/**
	 * Degrees to Radians conversion
	 */
	toRad: function( degrees ) {
		return degrees * Math.PI / 180;
	},
	/**
	 * Radians to Degrees conversion
	 */
	toDeg: function( radian ) {
		return radian * 180 / Math.PI;
	},
	/**
	 * Gets distance between two entities.
	 */
	getDistance: function( x1, y1, x2, y2 ){
		var x = x1 - x2;
		var y = y1 - y2;
		return Math.sqrt( x*x + y*y );
	}
};

/**
 * Physics functions
 */
window.Physics = {

};

})( window );
