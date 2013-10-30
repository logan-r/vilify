/*!
 * Vilify monsters.js
 */

(function(window) {
	/**
	 * Monster object
	 * Store all the data associated with one monster
	 */
	var Monster = function() {
		this.initialize();
	}

	var p = Monster.prototype = new createjs.Container();
	Monster.prototype.Container_initialize = p.initialize;

	Monster.prototype.initialize = function() {
		this.Container_initialize();

		// Monster data
		this.type = null;
		this.health = 100;
		this.inCombat = false;

		// Monster position
		this.x = 480;
		this.y = 530;

		// Monster velocity
		this.Vx = 0;

		// Monster image
		var image = new createjs.Shape();
		image.graphics.beginFill("#d61500").drawRect(0, 0, 70, 100);
		this.addChild(image);

		// Update function
		this.tick = function(event) {
			if (!this.inCombat) {
				// Move
				this.x -= event.delta/1000 * this.Vx;
			}
		}

		// Damage the monster
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
			MONSTERS.splice(MONSTERS.indexOf(this), 1);
			this.removeAllChildren();
			Game.stage.removeChild(this);
		}
	}

	window.Monster = Monster;
	window.MONSTERS = MONSTERS = []; // List of all active heroes

	/**
	 * Graveyard object
	 * Where monsters spawn
	 */
	var Graveyard = function() {
		this.initialize();
	}

	var p = Graveyard.prototype = new createjs.Container();
	Graveyard.prototype.Container_initialize = p.initialize;

	Graveyard.prototype.initialize = function() {
		this.Container_initialize();

		// Monster data
		this.type = null;

		// Monster image
		var image = new createjs.Shape();
		image.graphics.beginFill("#d61500").drawRect(700, 620, 120, 20);
		this.addChild(image);
	}

	window.Graveyard = Graveyard;
	window.GRAVEYARD = null;
})(window);
