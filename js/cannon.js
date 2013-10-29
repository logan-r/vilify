/*!
 * Vilify cannon.js
 */

(function(window) {
	/**
	 * Cannon object
	 * For the cannon the Mad Scientist fire potion from
	 */
	var Cannon = function() {
		this.initialize();
	}

	var p = Cannon.prototype = new createjs.Container();
	Cannon.prototype.Container_initialize = p.initialize;

	Cannon.prototype.initialize = function() {
		this.Container_initialize();

		// Cannon image
		var image = new createjs.Shape();
		image.graphics.beginFill("#111").drawRect(835, 535, 120, 100);
		this.addChild(image);
	}

	window.Cannon = Cannon;
	window.CANNON = null;
})(window);
