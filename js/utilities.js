(function(window) {
/**
 * Extra math functions (not already in Math object)
 */
window.MathEx = {
	/**
	 * Generates a random number between low and high, inclusive.
	 */
	randInt: function(low, high) {
		return Math.floor(Math.random() * (high - low + 1)) + low;
	},
	/**
	 * Degrees to Radians conversion
	 */
	toRad: function(degrees) {
		return degrees * Math.PI / 180;
	},
	/**
	 * Radians to Degrees conversion
	 */
	toDeg: function(radian) {
		return radian * 180 / Math.PI;
	}
};

})(window);
