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
	}
};

/**
 * Physics functions
 */
window.Physics = {
	/**
	 * Gets distance between two entities.
	 * pos1 and pos2: x, y position vectors
	 */
	getDistance: function( pox1, pos2 ){
		var x = pos1.x - pos2.x;
		var y = pos1.y - pos2.y;
		return Math.sqrt( x*x + y*y );
	},
	/**
	 * gets the x, y velocity vector of a projectile fired from a tower
	 * angle: angle the tower is pointed in radians
	 * velocity: the velocity at which the projectile was fired
	 */
	getVelocity: function( angle, velocity ) {
		newVelocity = { x: 0, y: 0 };
		newVelocity.x = velocity * Math.cos(angle);
		newVelocity.y = velocity * Math.sin(angle);
		return newVelocity;
	}
};

})( window );
