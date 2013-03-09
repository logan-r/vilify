/**
 * Vilify main.js file
 */

(function(window) {

var Game = window.Game = {
	name: "Vilify",
	version: "1.0.0"
};

// Game settings
var settings = Game.settings = {
	fps: 20, // Frames per second
	time: 0, // To keep track of time elapsed
	TILE_LENGTH: 64, // Tile length (since it is awkward to call it a width or height)
	tiles: {
		WALKABLE: 0,
		UNWALKABLE: 1,
		START: 2,
		END: 3
	},
	canvas: document.getElementById("canvas"), // Our drawing canvas
	objectData: null, // Game object data
	mapData: null, // Game map data
	map: null, // Game map
	entities: [] // Game entities
};

// Our canvas context for drawing
var stage = settings.stage = settings.canvas.getContext("2d");

// Fetch object data
ajax( "objects.json", null, function(msg) {
	settings.objectData = JSON.parse(msg);
});

// Fetch map data
ajax( "map.json", null, function(msg) {
	settings.mapData = JSON.parse(msg);
	settings.map = new GameMap(settings.mapData.map1.mapArray);
	settings.map.waves = settings.mapData.map1.waves;
});

// Create asset manager
Game.assetManager = new AssetManager();

// Add files to asset manager
Game.assetManager.addImage("Walkable Tile", "images/walkable.png");
Game.assetManager.addImage("Unwalkable Tile", "images/unwalkable.png");
Game.assetManager.addImage("Start Tile", "images/start.png");
Game.assetManager.addImage("End Tile", "images/end.png");

/* Object constructors
------------------------------------------------------------------------------------------------------------------*/

function AssetManager() {
	/*
	Holds game assets (images, music, etc.) and makes sure they are all loaded before the game starts
	*/

	// TODO: Add loading for music

	// Holds assets
	this.assets = {};

	// Holds asset file locations before they are loaded
	this.assetFiles = {}

	// Store the total assets so we know when it is done loading
	this.totalAssets = 0;

	// Store the currently loaded assets so we know when it is done loading
	this.loadedAssets = 0;

	// Keep track of if AssetManager is up to date (has loaded all files)
	this.upToDate = true; //starts true because it has loaded all 0 files
}

AssetManager.prototype = {
	/**
	 * Adds an image to the assets
	 * name: A string to get the image
	 * file: The file location of the image
	 */
	addImage: function(name, file) {
		this.assets[imageName] = new Image();
		this.assets[imageName].onLoad = this.imageloaded;
		this.assetFiles[imageName] = imageFile;
		this.totalAssets++;
		this.upToDate = false;
	},

	/**
	 * Called when an image is loaded
	 */
	imageLoaded: function() {
		this.loadedAssets++;
	},

	/**
	 * Loads the assets
	 */
	load: function(callback) {
		// Loop through assets
		for (var asset in this.assets) {
			// Make sure property is from assets not object
			if (this.assets.hasOwnProperty(asset)) {
				this.assets[asset].src = this.assetFiles[asset];
			}
		}

		// Call the callback function
		callback();
	},

	/**
	 * Get an asset by name
	 */
	getAsset: function(assetName) {
		return this.assets[assetName];
	}
};

function Entity(type, dimension, img) {
	/*
	Stub class for representing entity in the game.
	This should never be invoked on its own.
	category: the object's category e.g. "monsters" or "towers"
	name: the object's name e.g. "Zombie" or "Vampire"
	dimension: object that contains x, y, width, height. Ex) {x: 0, y: 0, width: 64, height: 64}
	durability: how much life does this entity has.
	damage: damage
	range: range
	rate: rate of fire
	materials: materials needed
	update: stub method for update. Override recommended
	draw: stub method for draw. Override recommended
	img: image
	*/
	// TODO: images!!!
	if (type) {
		this.category = type[0];
		this.name = type[1];
		data = objectData[this.category][this.name];
		this.durability = data.durability;
		this.damage = data.damage;
		this.range = data.range;
		this.rate = data.rate;
		this.materials = data.materials;
	}
	if (dimension) {
		this.x = dimension.x;
		this.y = dimension.y;
		this.width = dimension.width;
		this.height = dimension.height;
	}
	this.img = img;
}

Entity.prototype.update = function(elapsed) {
	this.width = MathEx.randInt(100, 200);
	this.height = MathEx.randInt(100, 200);
};

Entity.prototype.draw = function() {
	if (img) {
		stage.drawImage(this.img, this.x, this.y);
	} else {
		stage.fillStyle = "red";
		stage.fillRect(this.x, this.y, this.width, this.height);
	}
};


function Tower(name, dimension) { // Tower object constructor
	// TODO: Define some basic attributes that all towers can inherit

	if (objectData.towers[name] == undefined)
		throw "Tower: Invalid name: " + name;

	Entity.call(this, ["towers","name"], dimension);
}

Tower.prototype = new Entity(); // Set up prototype chain.


function Monster(name, dimension) { // Monster object constructor
	// TODO: Define some basic attributes that all monsters can inherit

	if (objectData.monsters[name] == undefined)
		throw "Monster: Invalid name: " + name;

	Entity.call(this, ["monsters",name], dimension);
}

Monster.prototype = new Entity(); // Set up prototype chain.


function Potion(name) { // Potion object constructor
	// TODO: Define some basic attributes that all potions can inherit

	if (objectData.potions[name] == undefined)
		throw "Potion: Invalid name: " + name;

	Entity.call(this, ["potions",name]);
}

Potion.prototype = new Entity(); // Set up prototype chain.


function Hero(name, dimension) { // Hero object constructor
	// TODO: Define some basic attributes that all heroes can inherit

	if (objectData.heroes[name] == undefined)
		throw "Hero: Invalid name: " + name;

	Entity.call(this, ["heroes",name], dimension);
}

Hero.prototype = new Entity(); // Set up prototype chain.


function GameMap(_map) {
	/*
	Game Map Class
	_map: a 2D array, 1 = a tile that can be walked on, 0 = a tile that can't be walked on
	draw: a function that displays the map
	*/
	this._map = _map;
	this.draw = function() {
		//draw border
		stage.fillStyle = "black";
		stage.fillRect(0, 0, this._map.length * settings.TILE_LENGTH + 10, this._map[0].length * settings.TILE_LENGTH + 10);

		for (var row = 0; row < this._map.length; row++) { // Loop through the rows
			for (var column = 0; column < this._map[row].length; column++) { // Loop through the columns
				// get tile type
				var tileImage;
				switch (this._map[row][column]) {
					case settings.tiles.WALKABLE:
						tileImage = Game.assetManager.getAsset("Walkable Tile");
						break;
					case settings.tiles.UNWALKABLE:
						tileImage = Game.assetManager.getAsset("Unwalkable Tile");
						break;
					case settings.tiles.START:
						tileImage = Game.assetManager.getAsset("Start Tile");
						break;
					case settings.tiles.END:
						tileImage = Game.assetManager.getAsset("End Tile");
						break;
					default:
						throw "Invalid map!";
				}

				// draw a 64x64 tile in the correct location
				stage.drawImage(tileImage, column * settings.TILE_LENGTH + 5, row * settings.TILE_LENGTH + 5);
			}
		}
	}
}

// Global functions

/**
 * AJAX function to get resources
 * uri: The uri of the resource
 * settings:
 *   method: Method of request ("GET" or "POST")
 *   data: A map of data to be sent to the server
 *   type: Response text type
 * callback: A function to call when a response is recieved
 */
function ajax(uri, options, callback) {
	options = options || {};

	// Create xhr object
	var xhr = new XMLHttpRequest();

	xhr.open( options.method || "GET", uri );

	// If type is undefined
	if (options.type) {
		xhr.responseType = options.type
	}

	xhr.onload = function() {
		if (typeof callback === "function") {
			callback(xhr.responseText, xhr);
		}
	};

	if (options.data) {
		return xhr.send(options.data);
	}
	xhr.send();
}

function update() {
	// TODO: Update the game entities

	var timeNow = new Date().getTime();
	if (time !== 0) {
		var elapsed = timeNow - time;
		for (var i in settings.entities) {
			settings.entities[i].update(elapsed);
		}
	}
	time = timeNow;
}

function draw() {
	// Clear stage so we can draw over it
	stage.clearRect(0, 0, stage.width, stage.height);

	// Draw background (currently just a solid color)
	stage.fillStyle = "black";
	stage.fillRect(0, 0, stage.width, stage.height);

	// Draw map
	Map.draw();

	// Draw entities
	for (var i in settings.entities) {
		settings.entities[i].draw();
	}

	// Draw menu
	stage.font = "40px Snowburst One";
	stage.fillStyle = "white";
	stage.fillText("Vilify", 485, 50);
}

function tick() {
	update();
	draw();
}

// Load images and start game when done
// Create a timer that calls a function, tick (which updates the game and draw), FPS times per second
setInterval(tick, 1000/FPS);

})(window);
