/*!
 * Vilify towers.js
 */

(function(window) {
	/**
	 * Tower object
	 * Store all the data assosiated with one tower
	 */
	var Tower = function(x) {
		this.initialize(x);
	}

	var p = Tower.prototype = new createjs.Container();
	Tower.prototype.Container_initialize = p.initialize;

	Tower.prototype.initialize = function(x) {
		this.Container_initialize();

		// Tower data
		this.type = null;

		// Tower image
		var image = new createjs.Shape();
		image.graphics.beginFill("#e0e0e0").drawCircle(x, 0, 50);
		this.addChild(image);
	}

	window.Tower = Tower;
})(window);
