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
		this.health = GAME_DATA["heroes"][this.type]["health"];

		// Calculate hero starting y value
		var y = 530;
		if (this.flying) {
			y = MathEx.randInt(120, 420);
		}

		// Hero position
		this.x = -70;
		this.y = y;

		// Hero image
		var image = new createjs.Shape();
		image.graphics.beginFill("#54eb46").drawRect(0, 0, 70, 100);
		this.addChild(image);

		// Update function
		this.tick = function(event) {
			this.x += event.delta/1000*this.speed;
		}

		// Damage the hero
		this.damage = function(amount) {
			this.health -= amount;
			if (this.health <= 0) {
				this.kill();
			}
		}

		// Get bounding box
		this.getBox = function() {
			return {left: this.x, top: this.y, width: 70, height: 100};
		}

		// Remove object
		this.kill = function() {
			HEROES.splice(HEROES.indexOf(this), 1);
			this.removeAllChildren();
			Game.stage.removeChild(this);
		}
	}

	window.Hero = Hero;
	window.HEROES = HEROES = []; // List of all active heroes
})(window);
