/*!
 * Vilify main.js
 */

(function(window) {

	var Game = window.Game = {

		/**
		 * various settings and objects that will be accessed throughout
		 * stage: CreateJS's version of canvas+context
		 * queue: CreateJS's resource loading mechanism
		 * scene: the current scene being displayed
		 */
		stage: null,
		queue: null,
		data: null,
		fps: 60,
		scene: null,

		/**
		 * variables to hold objects
		 */
		SCENES: {},
		GROUND: null,
		CANNON: null,
		GRAVEYARD: null,
		ITEMS: [],
		TOWERS: [],
		PROJECTILES: [],
		HEROES: [],
		MONSTERS: [],
		EFFECTS: {},

		/**
		 * Load all the assets
		 */
		load: function() {
			Game.queue = new createjs.LoadQueue();

			// Load Game data
			Game.queue.on("fileload", function(e) {
				if (e.item.id === "objects.json") {
					Game.DATA = e.result;
					Game.queue.off("fileload", arguments.callee);
				}
			});
			Game.queue.on("complete", function(e) {
				Game.init("canvas", Game.SCENES["game"]);
			}, null, true);

			Game.queue.loadFile("objects.json", true, "game_data/");
		},

		/**
		 * Initialize CreateJS and all the necessary stuffs
		 */
		init: function(canvasID, scene) {
			Game.stage = new createjs.Stage(canvasID);
			Game.changeScene(scene);
			createjs.Ticker.setFPS(Game.fps);
			createjs.Ticker.addEventListener("tick", Game.tick);
		},

		/**
		 * Called to update the screen
		 */
		tick: function(event) {
			Game.scene.tick(event);
			Game.stage.update();
		},

		/**
		 * Change the active scene
		 */
		changeScene: function(newScene) {
			newScene.init();
			Game.scene = newScene;
		}
	}


	/**
	 * A scene to be displayed upon the canvas
	 * e.g. Loading screen, High score screen, Game screen
	 */
	function Scene(init, tick) {
		this.init = init; // The function that is called to initialize the scene
		this.tick = tick; // The function that is called ever time the game updates, should take one parameter "event"
	}

	Game.Scene = Scene;

	Game.SCENES["loading"] = new Scene(
		function() {},
		function(event) {}
	);

	Game.SCENES["game"]  = new Scene(
		function() {
			// Create ground
			Game.GROUND = new Ground();
			Game.stage.addChild(Game.GROUND);

			// Create towers
			for (i = 0; i < 6; i++) {
				tower = new Tower(null, 100+152*i);
				Game.stage.addChild(tower);
				Game.TOWERS.push(tower);
			}

			// Create graveyard
			Game.GRAVEYARD = new Graveyard();
			Game.stage.addChild(Game.GRAVEYARD);

			// Create cannon
			Game.CANNON = new Cannon();
			Game.stage.addChild(Game.CANNON);

			// Create items
			for (i = 0; i < 14; i++) {
				item = new Item(["tech","chemical","alien"][MathEx.randInt(0,2)], MathEx.randInt(0, 600), MathEx.randInt(0, 600));
				Game.stage.addChild(item);
				Game.ITEMS.push(item);
			}
		},
		function(event) {
			// Tick heroes
			for (i = 0; i < Game.HEROES.length; i++) {
				Game.HEROES[i].tick(event);
			}

			// Tick towers
			for (i = 0; i < Game.TOWERS.length; i++) {
				Game.TOWERS[i].tick(event);
			}

			// Tick projectiles
			for (i = 0; i < Game.PROJECTILES.length; i++) {
				Game.PROJECTILES[i].tick(event);
				for (j = 0; j < Game.HEROES.length; j++) {
					if (Game.PROJECTILES[i].collides(Game.HEROES[j].getBox())) {
						Game.PROJECTILES[i].kill();
						Game.HEROES[j].damage(Game.PROJECTILES[i].damage);
					}
				}
			}

			// Tick monsters
			for (i = 0; i < Game.MONSTERS.length; i++) {
				Game.MONSTERS[i].tick(event);
				for (j = 0; j < Game.HEROES.length; j++) {
					if (Physics.collides(Game.HEROES[j].getBox(), Game.MONSTERS[i].getBox())) {
						hero.inCombat = Game.MONSTERS[i];
						monster.inCombat = Game.HEROES[j];
					}
				}
			}

			// Tick items
			for (i = 0; i < Game.ITEMS.length; i++) {
				Game.ITEMS[i].tick(event);
			}
		}
	);


	/**
	 * Tower object
	 * Store all the data associated with one tower
	 */
	function Tower(type, x) {
		this.initialize(type, x);
	}

	Game.Tower = Tower;

	var p = Tower.prototype = new createjs.Container();
	Tower.prototype.Container_initialize = p.initialize;

	Tower.prototype.initialize = function(type, x) {
		this.Container_initialize();

		// Tower data
		this.type = type;
		if (this.type != null) {
			this.name = Game.DATA["towers"][this.type]["name"];
			this.rate = Game.DATA["towers"][this.type]["rate"];
			this.projectileTimer = Game.fps * this.rate;  // Timeout between projectiles
		}

		// Tower position
		this.x = x;

		// Tower image
		var color;
		if (this.type == null) {
			color = "#eee";
		} else {
			color = Game.DATA["towers"][this.type]["image"];
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
					// Reset timer
					this.projectileTimer = Game.fps * this.rate;

                    // Pick attack to use
					var attack = this.attacks[MathEx.randInt(0, this.attacks.length - 1)]; //TODO: weight attacks

					// Execute attack
					var projectile;
					switch (attack.type) {
					    case "bullet":
        					projectile = new Bullet(this.x, 45, attack.damge);
        					break;
        				case "cloud":
        				    projectile = new Cloud(this.x, 45);
        					break;
        		    }
        		    Game.stage.addChild(projectile);
        			Game.PROJECTILES.push(projectile);
				}
			}
		}

		// Upgrade tower
		this.upgrade = function(type) {
			var newType;
			// Update tower data
			if (this.type == null) {
				newType = type;
			} else {
				newType = (this.type + type).sort(true);
			}

			if (!Game.DATA["towers"][newType]) {
				// Check if the tower truly exists
				return false;
			}

			this.type = newType;
			this.rate = Game.DATA["towers"][this.type]["rate"];
			this.attacks = Game.DATA["towers"][this.type]["attacks"];
			this.projectileTimer = Game.fps * this.rate;  // Timeout between projectiles

			// Update tower image
			this.removeAllChildren(); // Clear old image
			var color;
			if (this.type == null) {
				color = "#eee";
			} else {
				color = Game.DATA["towers"][this.type]["image"];
			}
			var image = new createjs.Shape();
			image.graphics.beginFill(color).drawCircle(0, 0, 50);
			this.addChild(image);

			return true;
		}

		// Get bounding box
		this.getBox = function() {
			return {left: this.x, top: 0, width: 100, height: 50};
		}
	}

    /**
	 * Projectile object
	 * A superclass object for every projectile that the towers and cannon fire
	 */
	function Projectile() {
		this.initialize();
	}
	Game.Projectile = Projectile;

	var p = Projectile.prototype = new createjs.Container();
	Projectile.prototype.Container_initialize = p.initialize;

	Projectile.prototype.initialize = function() {
		this.Container_initialize();

		// Projectile location
		this.x = 0;
		this.y = 0;
		this.Vx = 0;
		this.Vy = 0;
		this.Ax = 0;
		this.Ay = 0;

		/**
		 * Does projectile collide with box?
		 */
		this.collides = function(box) {
		     // Overide me
		     return false;
		}

		// Remove object
		this.kill = function() {
			Game.PROJECTILES.splice(Game.PROJECTILES.indexOf(this), 1);
			this.removeAllChildren();
			Game.stage.removeChild(this);
		}
	}


	/**
	 * Bullet object
	 * An object for the bullets that a tower fires
	 */
	function Bullet(x, y, damage) {
		this.initialize(x, y, damage);
	}

	Game.Bullet = Bullet;

	var p = Bullet.prototype = new Projectile();
	Bullet.prototype.Projectile_initialize = p.initialize;

	Bullet.prototype.initialize = function(x, y, damage) {
		this.Projectile_initialize();

		// Bullet data
		this.damage = damage;
		this.x = x - 5;
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

		/**
		 * Does projectile collide with box?
		 */
		this.collides = function(box) {
		     return Physics.collides(this.getBox(), box);
		}
	}


    /**
	 * Beam object
	 * An object for the bullets that a tower fires
	 */
	function Cloud(x, y) {
		this.initialize(x, y);
	}

	Game.Cloud = Cloud;

	var p = Cloud.prototype = new Projectile();
	Cloud.prototype.Projectile_initialize = p.initialize;

	Cloud.prototype.initialize = function(x, y) {
		this.Projectile_initialize();

		// Cloud position
		this.x = x - 60;
		this.y = y;
		this.Vy = 100;
		this.Ay = 30;

		// Cloud image
		var image = new createjs.Shape();
		image.graphics.beginFill("rgb(224, 218, 148)").drawRect(0, 0, 120, 70);
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
			return {left: this.x, top: this.y, width: 120, height: 70}
		}

		/**
		 * Does projectile collide with box?
		 */
		this.collides = function(box) {
		     return Physics.collides(this.getBox(), box);
		}
	}


	/**
	 * Monster object
	 * Store all the data associated with one monster
	 */
	function Monster(type) {
		this.initialize(type);
	}

	Game.Monster = Monster;

	var p = Monster.prototype = new createjs.Container();
	Monster.prototype.Container_initialize = p.initialize;

	Monster.prototype.initialize = function(type) {
		this.Container_initialize();

		// Monster data
		this.type = type;
		this.health = Game.DATA["monsters"][this.type]["health"];
		this.speed = Game.DATA["monsters"][this.type]["speed"];
		this.flying = Game.DATA["monsters"][this.type]["flying"];
		this.inCombat = false;

		// Monster position
		this.width = 70;
		this.height = 100;
		this.x = Game.GRAVEYARD.x + Game.GRAVEYARD.width / 2 - this.width / 2;
		this.y = Game.GROUND.y - this.height;
		this.goal = [this.x, this.y];

		// Monster velocity
		this.Vx = 0;
		this.Vy = 0;

		// Monster image
		var color;
		if (this.type == null) {
			color = "#eee";
		} else {
			color = Game.DATA["monsters"][this.type]["image"];
		}
		var image = new createjs.Shape();
		image.graphics.beginFill(color).drawRect(0, 0, this.width, this.height);
		this.addChild(image);

		// Update function
		this.tick = function(event) {
			if (!this.inCombat) {
				// Move
				this.x += event.delta/1000 * this.Vx;

				// Check to see if monster has reached goal
				if ((this.goal[0] > this.x && this.Vx < 0) || (this.goal[0] < this.x && this.Vx > 0)) {
				    this.Vx = 0;
				    this.x = this.goal[0];
				}

				if (this.flying) {
				    // Fly
				    this.y += event.delta/1000 * this.Vy;

				    // Check to see if monster has reached goal
    				if ((this.goal[1] > this.y && this.Vy < 0) || (this.goal[1] < this.y && this.Vy > 0)) {
				        this.Vy = 0;
				        this.y = this.goal[1];
				    }
				}
			}
		}

		var handlePressDown = function(event) {
			Game.EFFECTS["monsterMove"] = {image: null};
		}

		var handlePressMove = function(event) {
			// Remove old effect
			Game.stage.removeChild(Game.EFFECTS["monsterMove"].image);

			// Calculate new effect
			var endY;
			if (event.target.parent.flying) {
				endY = event.stageY;
			} else {
				endY = event.target.parent.y + event.target.parent.height / 2;
			}

			// Add new effect
			effect = new createjs.Shape();
			effect.graphics.moveTo(event.target.parent.x + event.target.parent.width / 2, event.target.parent.y + event.target.parent.height / 2);
			effect.graphics.setStrokeStyle(20, "round").beginStroke("rgba(0, 0, 0, 0.2)");
			effect.graphics.lineTo(event.stageX, endY).endStroke();
			Game.EFFECTS["monsterMove"].image = effect;
			Game.stage.addChild(effect);
		}

		// event handlers
		var handlePressUp = function(event) {
			// Clear move effect
			Game.stage.removeChild(Game.EFFECTS["monsterMove"].image);

		    // Ground based movement
			event.target.parent.goal[0] = event.stageX - event.target.parent.width / 2;
			if (event.target.parent.goal[0] < 0) { // Don't let monster go off screen
			    event.target.parent.goal[0] = 0;
			} else if (event.target.parent.goal[0] > 960 - event.target.parent.width) {
			    event.target.parent.goal[0] = 960 - event.target.parent.width;
			}
			if (event.target.parent.goal[0] < event.target.parent.x) {
				event.target.parent.Vx = event.target.parent.speed * -1;
			}
			else if (event.target.parent.goal[0] > event.target.parent.x) {
				event.target.parent.Vx = event.target.parent.speed;
			}

			// Flying
    		if (event.target.parent.flying) {
    			event.target.parent.goal[1] = event.stageY - event.target.parent.height / 2;
    			if (event.target.parent.goal[1] > Game.GROUND.y - event.target.parent.height) { // Don't let monster go below ground
    			    event.target.parent.goal[1] = Game.GROUND.y - event.target.parent.height;
    			}
    			ratio = (event.target.parent.goal[1] - event.target.parent.y) / (event.target.parent.goal[0] - event.target.parent.x);
    			if (ratio < 0) {
    			    ratio = ratio * -1;
    			}
    			if (event.target.parent.goal[1] < event.target.parent.y) {
    				event.target.parent.Vy = ratio * event.target.parent.speed * -1;
    			}
    			else if (event.target.parent.goal[1] > event.target.parent.y) {
    				event.target.parent.Vy = ratio * event.target.parent.speed;
    			}
    		}
		}
		image.addEventListener("mousedown", handlePressDown);
		image.addEventListener("pressmove", handlePressMove);
		image.addEventListener("pressup", handlePressUp);

		// Upgrade monster
		this.upgrade = function(type) {
			// Calculate new monster type
			var newType;
			if (this.type == null) {
				newType = type;
			} else {
				newType = (this.type + type).sort(true);
			}

			// Check if the monster truly exists
			if (!Game.DATA["monsters"][newType]) {
				return false;
			}

			// Update monster data
			this.type = newType;
			this.health = Game.DATA["monsters"][this.type]["health"];
			this.speed = Game.DATA["monsters"][this.type]["speed"];
			this.flying = Game.DATA["monsters"][this.type]["flying"];

			// Update monster image
			this.removeAllChildren(); // Clear old image
			var color;
			if (this.type == null) {
				color = "#eee";
			} else {
				color = Game.DATA["monsters"][this.type]["image"];
			}
			var image = new createjs.Shape();
			image.graphics.beginFill(color).drawRect(0, 0, 70, 100);
			this.addChild(image);

			// Add event handlers
			image.addEventListener("mousedown", handlePressDown);
			image.addEventListener("pressmove", handlePressMove);
			image.addEventListener("pressup", handlePressUp);

			return true;
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
			return {left: this.x, top: this.y, width: this.width, height: this.height};
		}

		// Remove object
		this.kill = function() {
			Game.MONSTERS.splice(Game.MONSTERS.indexOf(this), 1);
			this.removeAllChildren();
			Game.stage.removeChild(this);
		}
	}


	/**
	 * Graveyard object
	 * Where monsters spawn
	 */
	function Graveyard() {
		this.initialize();
	}

	Game.Graveyard = Graveyard;

	var p = Graveyard.prototype = new createjs.Container();
	Graveyard.prototype.Container_initialize = p.initialize;

	Graveyard.prototype.initialize = function() {
		this.Container_initialize();

		// Graveyard position
		this.width = 120;
		this.height = 20;
		this.x = 700;
		this.y = Game.GROUND.y - this.height;

		// Graveyard image
		var image = new createjs.Shape();
		image.graphics.beginFill("#d61500").drawRect(0, 0, this.width, this.height);
		this.addChild(image);

		// Get bounding box
		this.getBox = function() {
			return {left: this.x, top: this.y, width: this.width, height: this.height};
		}
	}


	/**
	 * Cannon object
	 * For the cannon the Mad Scientist fire potion from
	 */
	function Cannon() {
		this.initialize();
	}

	Game.Cannon = Cannon;

	var p = Cannon.prototype = new createjs.Container();
	Cannon.prototype.Container_initialize = p.initialize;

	Cannon.prototype.initialize = function() {
		this.Container_initialize();

		// Cannon position
		this.width = 120;
		this.height = 100;
		this.x = 835;
		this.y = Game.GROUND.y - this.height;

		// Cannon image
		var image = new createjs.Shape();
		image.graphics.beginFill("#111").drawRect(0, 0, this.width, this.height);
		this.addChild(image);
	}


	/**
	 * Hero object
	 * Store all the data associated with one hero
	 */
	function Hero(type) {
		this.initialize(type);
	}

	Game.Hero = Hero;

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
			Game.HEROES.splice(Game.HEROES.indexOf(this), 1);
			this.removeAllChildren();
			Game.stage.removeChild(this);
		}
	}


	/**
	 * Item object
	 * An item that can be used to build or upgrad towers, monsters and potions
	 */
	function Item(type, x, y) {
		this.initialize(type, x, y);
	}

	Game.Item = Item;

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
			// Check if item collides with thing to be built or upgraded
			used = false;
			for (i = 0; i < Game.TOWERS.length; i++) { // Build/upgrade tower?
				if (Physics.collides(Game.TOWERS[i].getBox(), event.target.parent.getBox())) {
					used = Game.TOWERS[i].upgrade(event.target.parent.smallString());
					break;
				}
			}
			if (!used && Physics.collides(Game.GRAVEYARD.getBox(), event.target.parent.getBox())) { // Build monster?
				used = true;

				// Create monster
				monster = new Monster(event.target.parent.smallString());
				Game.stage.addChild(monster);
				Game.MONSTERS.push(monster);
			}
			if (!used) { // Can upgrade monster?
				for (i = 0; i < Game.MONSTERS.length; i++) {
					if (Physics.collides(Game.MONSTERS[i].getBox(), event.target.parent.getBox())) {
						used = Game.MONSTERS[i].upgrade(event.target.parent.smallString());
						break;
					}
				}
			}

			if (!used) { // If it wasn't used, then send it back to list
				event.target.parent.state = "FREE";
				event.target.parent.Vx = 1000;
				event.target.parent.Vy = (event.target.parent.goal[1] - event.target.parent.y) / (event.target.parent.goal[0] - event.target.parent.x) * 1000;
			} else { // If it was used kill it and reorder list
				y = event.target.parent.goal[1];
				event.target.parent.kill();
				ItemsList.free(y);

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

		// Get string form
		this.smallString = function() {
			if (this.type == "tech") return "T";
			else if (this.type == "chemical") return "C";
			else if (this.type == "alien") return "A";
		}

		// Get bounding box
		this.getBox = function() {
			return {left: this.x, top: this.y, width: 30, height: 30};
		}

		// Remove item
		this.kill = function() {
			Game.ITEMS.splice(Game.ITEMS.indexOf(this), 1);
			this.removeAllChildren();
			Game.stage.removeChild(this);
		}
	}

	ItemsList = {
		openPositions: [90, 130, 170, 210, 250, 290, 330, 370],
		book: function() {
			if (this.openPositions.length > 0) {
				y = this.openPositions[0];
				this.openPositions.splice(0, 1);
				return [900, y];
			}
			return [900, 410];
		},
		free: function(y) {
			bankedItemMoved = false;
			for (i = 0; i < Game.ITEMS.length; i++) {
				if (Game.ITEMS[i].y > y && (!bankedItemMoved || !Game.ITEMS[i].y >= 450)) {
					if (Game.ITEMS[i].y >= 450) {
						bankedItemMoved = true;
					}
					Game.ITEMS[i].state = "REORDER";
					Game.ITEMS[i].Vx = 0;
					Game.ITEMS[i].Vy = -1000;
					Game.ITEMS[i].goal[1] = Game.ITEMS[i].y - 40;
				}
			}
		}
	}

	Game.ItemsList = ItemsList; // For debug only; To be removed


	/**
	 * Ground
	 * The floor
	 */
	function Ground() {
		this.initialize();
	}

	Game.Ground = Ground;

	var p = Ground.prototype = new createjs.Container();
	Ground.prototype.Container_initialize = p.initialize;

	Ground.prototype.initialize = function() {
		this.Container_initialize();

		// Ground position
		this.x = 0;
		this.y = 630;

		// Ground image
		var image = new createjs.Shape();
		image.graphics.beginFill("#111").drawRect(0, 0, 960, 10);
		this.addChild(image);
	}

	Game.load();

})(window);
