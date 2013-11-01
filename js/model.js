/*!
 * Vilify model.js
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
		this.flying = Game.DATA["heroes"][this.type]["flying"];
		this.health = Game.DATA["heroes"][this.type]["health"];
		this.inCombat = false;

		// Calculate hero starting y value
		var y = 530;
		var Vy = 0;
		if (this.flying) {
			y = MathEx.randInt(120, 420);
			Vy = this.flying["velocity"];
			this.flyingHeight = this.flying["height"];
		}

		// Hero position
		this.x = -70;
		this.y = y;

		// Hero velocity
		this.Vx = Game.DATA["heroes"][this.type]["speed"];
		this.Vy = Vy;
		this.starty = this.y;

		// Hero image
		var image = new createjs.Shape();
		image.graphics.beginFill("#54eb46").drawRect(0, 0, 70, 100);
		this.addChild(image);

		// Update function
		this.tick = function(event) {
			if (!this.inCombat) {
				// Move
				this.x += event.delta/1000 * this.Vx;

				// Fly
				if (this.flying) {
					this.y += event.delta/1000 * this.Vy;
					if (this.y > this.starty + this.flyingHeight || this.y < this.starty - this.flyingHeight) {
						this.Vy = -1 * this.Vy;
					}
				}
			}
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


	/**
	 * Item object
	 * An item that can be used to build or upgrad towers, monsters and potions
	 */
	var Item = function(type, x, y) {
		this.initialize(type, x, y);
	}

	var p = Item.prototype = new createjs.Container();
	Item.prototype.Container_initialize = p.initialize;

	Item.prototype.initialize = function(type, x, y) {
		this.Container_initialize();

		// Item data
		this.type = type;

		// Item state
		// FREE: item is out of lists and needs to be added
		// LISTED: item is in list
		// DRAGGING: item is being dragged by the player
		// REORDER: item is being reorder in the list
		this.state = "FREE";

		// Item position
		this.x = x;
		this.y = y;

		this.goal = ItemsList.book();
		this.Vx = 1000;
		this.Vy = (this.goal[1] - this.y) / (this.goal[0] - this.x) * 1000;

		// Item image
		var color;
		if (this.type == "tech") {
			color = "#999";
		} else if (this.type == "chemical") {
			color = "#2483ff";
		} else if (this.type == "alien") {
			color = "#61289e";
		}
		var image = new createjs.Shape();
		image.graphics.beginFill(color).drawRect(0, 0, 30, 30);
		this.addChild(image);

		// Add events
		image.addEventListener("pressmove", function(event) {
			event.target.parent.state = "DRAGGED";
			event.target.parent.x = event.stageX;
			event.target.parent.y = event.stageY;
		});
		image.addEventListener("pressup", function(event) {
			used = false;
			for (i = 0; i < TOWERS.length; i++) {
				if (Physics.collides(TOWERS[i].getBox(), event.target.parent.getBox())) {
					used = true;
					TOWERS[i].upgrade("Bullet");
					ItemsList.free(event.target.parent.goal[1]);
					event.target.parent.kill();
				}
			}
			if (!used) {
				event.target.parent.state = "FREE";
				event.target.parent.Vx = 1000;
				event.target.parent.Vy = (event.target.parent.goal[1] - event.target.parent.y) / (event.target.parent.goal[0] - event.target.parent.x) * 1000;
			}
		});

		this.tick = function(event) {
			switch (this.state) {
				case "FREE":
					this.x += event.delta/1000 * this.Vx;
					this.y += event.delta/1000 * this.Vy;
					if (this.x >= this.goal[0]) {
						this.state = "LISTED";
						this.x = this.goal[0];
						this.y = this.goal[1];
					}
					break;
				case "REORDER":
					this.y += event.delta/1000 * this.Vy;
					if (this.y <= this.goal[1]) {
						this.state = "LISTED";
						this.x = this.goal[0];
						this.y = this.goal[1];
					}
					break;
			}
		}

		// Get bounding box
		this.getBox = function() {
			return {left: this.x, top: this.y, width: 30, height: 30};
		}

		// Remove item
		this.kill = function() {
			ITEMS.splice(ITEMS.indexOf(this), 1);
			this.removeAllChildren();
			Game.stage.removeChild(this);
		}
	}

	window.Item = Item;
	window.ITEMS = ITEMS = []; // List of all active items

	ItemsList = {
		openPositions: [90, 130, 170, 210, 250, 290, 330, 370, 410],
		book: function() {
			if (this.openPositions.length > 0) {
				y = this.openPositions[0];
				this.openPositions.splice(0, 1);
				return [900, y];
			}
			return [900, 450];
		},
		free: function(y) {
			bankedItemMoved = false;
			for (i = 0; i < ITEMS.length; i++) {
				if (ITEMS[i].y > y && (!bankedItemMoved || !ITEMS[i].y >= 450)) {
					if (ITEMS[i].y >= 450) {
						bankedItemMoved = true;
					}
					ITEMS[i].state = "REORDER";
					ITEMS[i].Vx = 0;
					ITEMS[i].Vy = -1000;
					ITEMS[i].goal[1] = ITEMS[i].y - 40;
				}
			}
		}
	}
	window.ItemsList = ItemsList; // For debug only; To be removed


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
