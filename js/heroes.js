/*!
 * Vilify heroes.js
 */

(function(window) {
	/**
	 * Hero object
	 * Store all the data associated with one hero
	 */
	var Hero = function(type) {
		this.initialize(type);
	}

	var p = Hero.prototype = new createjs.Container();
	Hero.prototype.Container_initialize = p.initialize;

	Hero.prototype.initialize = function(type) {
		this.Container_initialize();

		// Hero data
		this.type = type;
		this.speed = GAME_DATA["heroes"][this.type]["speed"];
		this.flying = GAME_DATA["heroes"][this.type]["flying"];

		// Calculate hero starting y value
		var y = 530;
		if (this.flying) {
			y = MathEx.randInt(120, 420);
		}

		// Hero image
		var image = new createjs.Shape();
		image.graphics.beginFill("#54eb46").drawRect(-70, y, 70, 100);
		this.addChild(image);

		// Update function
		this.tick = function(event) {
			hero.x += event.delta/1000*this.speed;
		}
	}

	window.Hero = Hero;
	window.HEROES = HEROES = []; // List of all active heroes
})(window);
