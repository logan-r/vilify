/*!
 * Vilify towers.js
 */

(function(window) {
	/**
	 * Tower object
	 * Store all the data associated with one tower
	 */
	var Tower = function(type, x) {
		this.initialize(type, x);
	}

	var p = Tower.prototype = new createjs.Container();
	Tower.prototype.Container_initialize = p.initialize;

	Tower.prototype.initialize = function(type, x) {
		this.Container_initialize();

		// Tower data
		this.type = type;
		if (this.type != null) {
			this.damage = Game.DATA["towers"][this.type]["damage"];
			this.projectileTimer = Game.fps * 1;  // Timeout between projectiles
		}

		// Tower position
		this.x = x;

		// Tower image
		var color;
		switch (this.type) {
			case "Bullet":
				color = "#d0d0d0";
				break;
			case null:
			default:
				color = "#eee";
				break;
		}
		var image = new createjs.Shape();
		image.graphics.beginFill(color).drawCircle(0, 0, 50);
		this.addChild(image);

		// Update tower
		this.tick = function(event) {
			if (this.type != null) {
				// Fire projectile
				this.projectileTimer -= event.delta/1000 * 100; // Countdown towards next projectile
				if (this.projectileTimer < 0) { // Is it time to fire projectile yet?
					this.projectileTimer = Game.fps * 1;

					// Fire bullet
					bullet = new Bullet(this.x-5, 40, this.damage);
					Game.stage.addChild(bullet);
					PROJECTILES.push(bullet);
				}
			}
		}

		// Upgrade tower
		this.upgrade = function(type) {
			// Update tower data
			this.type = type;
			this.damage = Game.DATA["towers"][this.type]["damage"];
			this.projectileTimer = Game.fps * 1;  // Timeout between projectiles

			// Update tower image
			this.removeAllChildren(); // Clear old image
			var color;
			switch (this.type) {
				case "Bullet":
					color = "#d0d0d0";
					break;
				default:
					color = "#eee";
					break;
			}
			var image = new createjs.Shape();
			image.graphics.beginFill(color).drawCircle(0, 0, 50);
			this.addChild(image);
		}

		// Get bounding box
		this.getBox = function() {
			return {left: this.x, top: 0, width: 100, height: 50};
		}
	}

	window.Tower = Tower;
	window.TOWERS = TOWERS = []; // List of all active heroes


	/**
	 * Bullet object
	 * An object for the bullets that a tower fires
	 */
	var Bullet = function(x, y, damage) {
		this.initialize(x, y, damage);
	}

	var p = Bullet.prototype = new createjs.Container();
	Bullet.prototype.Container_initialize = p.initialize;

	Bullet.prototype.initialize = function(x, y, damage) {
		this.Container_initialize();

		// Bullet data
		this.damage = damage;
		this.x = x;
		this.y = y;
		this.Vx = 50;
		this.Vy = 300;
		this.Ay = 150;

		// Bullet image
		var image = new createjs.Shape();
		image.graphics.beginFill("#444").drawRect(0, 0, 10, 10);
		this.addChild(image);

		// Update function
		this.tick = function(event) {
			this.x += event.delta/1000 * this.Vx;
			this.y += event.delta/1000 * parseInt(this.Vy);
			this.Vy += event.delta/1000 * this.Ay;
			if (this.x < 0 || this.x > 960 || this.y < 0 || this.y > 640) {
				this.kill();
			}
		}

		// Get box of bullet
		this.getBox = function() {
			return {left: this.x, top: this.y, width: 10, height: 10}
		}

		// Remove object
		this.kill = function() {
			PROJECTILES.splice(PROJECTILES.indexOf(this), 1);
			this.removeAllChildren();
			Game.stage.removeChild(this);
		}
	}

	window.Bullet = Bullet;
	window.PROJECTILES = PROJECTILES = []; // List of all active heroes
})(window);
