/*!
 * Vilify background.js
 * For background object that are just decorations
 */

(function(window) {
	/**
	 * Ground
	 * The floor
	 */
	var Ground = function() {
		this.initialize();
	}

	var p = Ground.prototype = new createjs.Container();
	Ground.prototype.Container_initialize = p.initialize;

	Ground.prototype.initialize = function() {
		this.Container_initialize();

		// Cannon image
		var image = new createjs.Shape();
		image.graphics.beginFill("#111").drawRect(0, 630, 960, 10);
		this.addChild(image);
	}

	window.Ground = Ground;
	window.GROUND = null;
})(window);
