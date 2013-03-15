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
	getDistance: function(ent1, ent2){
		var x = ent1.x - ent2.x;
		var y = ent1.y - ent2.y;
		return Math.sqrt(x*x + y*y);
	}
};

/**
 * Physics functions
 */
window.Physics = {

};

})( window );
