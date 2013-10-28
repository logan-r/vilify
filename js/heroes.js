/*!
 * Vilify heroes.js
 */

(function(window) {
	/**
	 * Hero object
	 * Store all the data associated with one hero
	 */
	var Hero = function() {
		this.initialize();
	}

	var p = Hero.prototype = new createjs.Container();
	Hero.prototype.Container_initialize = p.initialize;

	Hero.prototype.initialize = function() {
		this.Container_initialize();

		// Hero data
		this.type = null;

		// Hero image
		var image = new createjs.Shape();
		image.graphics.beginFill("#54eb46").drawRect(0, 530, 70, 100);
		this.addChild(image);

		// Update function
		this.tick = function(event) {
			hero.x += event.delta/1000*100;
		}
	}

	window.Hero = Hero;
	window.HEROES = HEROES = []; // List of all active heroes
})(window);
