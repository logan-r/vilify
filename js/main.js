/*!
 * Vilify main.js
 */

(function(window) {

	var Game = window.Game = {

		/**
		 * various settings and objects that will be accessed throughout
		 * stage: CreateJS's version of canvas+context
		 * queue: CreateJS's resource loading mechanism
		 */
		stage: null,
		queue: null,
		data: null,
		fps: 60,

		/**
		 * Load all the assets
		 */
		load: function() {
			Game.queue = new createjs.LoadQueue();

			Game.queue.on("fileload", function(e) {
				Game.data = e.result;
			}, null, true);
			// TODO: Use SpriteSheet
			Game.queue.loadFile("objects.json", true, "game_data/");
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
		init: function(canvasID) {
			Game.stage = new createjs.Stage(canvasID);
		}
	}

	Game.init("canvas");
	Game.load();

})(window);
