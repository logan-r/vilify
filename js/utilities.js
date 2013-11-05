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

window.Physics = {
	/**
	 * Checks if two boxes collide
	 * Boxs are objects with left, top, width, and height values
	 */
	collides: function(box1, box2) {
		return !(
			box1.top + box1.height < box2.top ||
			box1.top > box2.top + box2.height ||
			box1.left + box1.width < box2.left ||
			box1.left > box2.left + box2.width
		);
	}
}

/**
 * Takes a string and sorts it alphabetically and then reverses it
 * e.g. "ACB" becomes "CBA"
 */
String.reverseSort =  function(string) {
	stringList = string.split("");
	stringList.sort();
	stringList.reverse();
	string = stringList.join("");
	return string;
}

})(window);
