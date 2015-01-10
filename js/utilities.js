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
	},
	/**
	 * Gets the distance between 2 points
	 */
	distance: function(p1x,p1y,p2x,p2y) {
		return Math.round(Math.sqrt((p2x-p1x) * (p2x-p1x) + (p2y-p1y) * (p2y-p1y)));
	}
};

/**
 * Takes a string and sorts the letters
 * fn can be 1) function to sort, or 2) boolean
 * to indicate reverse or not
 */
window.String.prototype.sort = function(fn) {
	var a = this.split("");
	if (typeof(fn) === "boolean" && fn) {
		// Reversed
		a.sort(function(x, y) {
			if (x < y) {
				return 1;
			} else if (x > y) {
				return -1;
			}
			return 0;
		});
	} else {
		a.sort(fn);
	}

	return a.join("");
};

})(window);
