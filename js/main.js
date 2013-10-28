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
		scene: new Scene(function(){}, function(event){}),

		/**
		 * Load all the assets
		 */
		load: function() {
			Game.queue = new createjs.LoadQueue();

			Game.queue.on("fileload", function(e) {
				Game.data = e.result;
			}, null, true);
			// TODO: Use SpriteSheet
			//Game.queue.loadFile("objects.json", true, "game_data/");
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
	 function Scene (init, tick) {
		this.init = init; // The function that is called to initialize the scene
		this.tick = tick; // The function that is called ever time the game updates, should take one parameter "event"
	}

	var SCENES = window.SCENES = {
		"loading": new Scene(
			function() {
				Game.stage.addChild(new createjs.Shape()).setTransform(100,100).graphics.f("red").dc(0,0,50);
			},
			function(event) {
			}
		)
	}

	Game.init("canvas", SCENES["loading"]);
	Game.load();

})(window);
