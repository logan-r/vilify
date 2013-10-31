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
		 * Load all the assets
		 */
		load: function() {
			Game.queue = new createjs.LoadQueue(false);

			Game.queue.on("fileload", function(e) {
				Game.data = e.result;
			}, null, true);
			Game.queue.on("complete", function(e) {
				Game.init("canvas", SCENES["game"]);
			}, null, true)

			// TODO: Use SpriteSheet
			Game.queue.loadManifest(["basic_tower.png", "curse_tower.png", "dust_tower.png", "flame_tower.png", "ice_tower.png", "poison_tower.png", "poison_tower.png", "ray_tower.png"], true, "images/towers/");
			Game.queue.loadManifest(["end.png", "start.png", "unwalkable.png", "walkable.png"], true, "images/tiles/");
			Game.queue.loadManifest(["battery.png", "circuit_board.png", "microchip.png", "quantum_computer.png", "scrap_metal.png"], true, "images/materials/");
			Game.queue.loadManifest(["talos.png"], true, "images/monsters/");
			Game.queue.loadManifest(["basic_potion.png", "basic2_potion.png", "curse_potion.png", "dust_potion.png", "flame_potion.png", "ice_potion.png", "lightning_potion.png", "poison_potion.png"], true, "images/potions/");
			Game.queue.loadManifest(["attack.png"], true, "images/attacks/");
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

	window.Scene = Scene;

	var SCENES = window.SCENES = {
		"loading": new Scene(
			function() {},
			function(event) {}
		),
		"game": new Scene(
			function() {
				// Create ground
				var GROUND = new Ground();
				Game.stage.addChild(GROUND);

				// Create towers
				for (i = 0; i < 6; i++) {
					tower = new Tower(null, 100+152*i);
					Game.stage.addChild(tower);
					TOWERS.push(tower);
				}

				// Create graveyard
				GRAVEYARD = new Graveyard();
				Game.stage.addChild(GRAVEYARD);

				// Create cannon
				CANNON = new Cannon();
				Game.stage.addChild(CANNON);

				// Create items
				for (i = 0; i < 14; i++) {
					item = new Item(MathEx.randInt(0, 600), MathEx.randInt(0, 600));
					Game.stage.addChild(item);
					ITEMS.push(item);
				}

				// Create hero
				hero = new Hero("Sidekick");
				Game.stage.addChild(hero);
				HEROES.push(hero);
			},
			function(event) {
				// Tick heroes
				for (i = 0; i < HEROES.length; i++) {
					HEROES[i].tick(event);
				}

				// Tick towers
				for (i = 0; i < TOWERS.length; i++) {
					TOWERS[i].tick(event);
				}

				// Tick projectiles
				for (i = 0; i < PROJECTILES.length; i++) {
					PROJECTILES[i].tick(event);
					for (j = 0; j < HEROES.length; j++) {
						if (Physics.collides(HEROES[j].getBox(), PROJECTILES[i].getBox())) {
							PROJECTILES[i].kill();
							HEROES[j].damage(PROJECTILES[i].damage);
						}
					}
				}

				// Tick monsters
				for (i = 0; i < MONSTERS.length; i++) {
					MONSTERS[i].tick(event);
					for (j = 0; j < HEROES.length; j++) {
						if (Physics.collides(HEROES[j].getBox(), MONSTERS[i].getBox())) {
							hero.inCombat = MONSTERS[i];
							monster.inCombat = HEROES[j];
						}
					}
				}

				// Tick items
				for (i = 0; i < ITEMS.length; i++) {
					ITEMS[i].tick(event);
				}
			}
		)
	}

	Game.load();

})(window);
