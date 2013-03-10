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
	width: 650, // Width of the canvas
	height: 650, // Heihgt of the canvas
	FPS: 20, // Frames per second
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

/**
 * Holds game assets (images, music, etc.) and makes sure they are all
 * loaded before the game starts.
 */
function AssetManager() {
	// TODO: Add loading for music

	// Holds assets objects
	// asset:
	//   type: The type of the asset (i.e. "image")
	//   src: The file path of the asset
	this.assets = {};

	// Store the total assets so we know when it is done loading
	this.totalAssets = 0;

	// Store the currently loaded assets so we know when it is done loading
	this.loadedAssets = 0;
};

AssetManager.prototype = {
	/**
	 * Different types of assets require different ways of loading them
	 */
	type: {
		image: function( assetManager, asset, callback ) {
			var img = new Image();
			img.onload = function() {
				if ( callback ) {
					callback();
				}
				AssetManager.prototype.assetLoaded.call( assetManager );
			};
			img.src = asset.src;
			asset.elem = img;
		},
		audio: function( assetManager, asset, callback ) {
			var audio = document.createElement( "audio" );
			audio.onload = function() {
				if ( callback ) {
					callback();
				}
				AssetManager.prototype.assetLoaded.call( assetManager );
			};
			audio.src = asset.src;
			asset.elem = audio;
		},
		// JSON data needed before the game starts is an asset and should
		// be loaded through this class
		json: function( assetManager, asset, callback ) {
			ajax( asset.src, null, function( msg ) {
				asset.elem = JSON.parse( msg );
				if ( callback ) {
					callback( asset.elem );
				}
				AssetManager.prototype.assetLoaded.call( assetManager );
			});
		}
	},

	/**
	 * Adds an asset
	 * name: Name of the asset
	 * type: Type of the asset (specified above)
	 * src: The file path of the asset
	 * callback: A function to call when this individual asset is loaded
	 */
	addAsset: function( name, type, src, callback ) {
		this.assets[name] = {
			type: type,
			src: src,
			callback: callback
		};
		this.totalAssets++;
	},

	/**
	 * Check if all assets are loaded
	 */
	isLoaded: function() {
		return this.totalAssets === this.loadedAssets;
	},

	/**
	 * Called when an asset is loaded
	 */
	assetLoaded: function() {
		this.loadedAssets++;
		if ( this.isLoaded() && this.loadedFn ) {
			this.loadedFn();
		}
	},

	/**
	 * Loads the assets
	 */
	load: function( callback ) {
		// Call the callback function when all assets are loaded
		this.loadedFn = callback;

		// Loop through assets
		for ( var asset in this.assets ) {
			// Make sure property is from assets not object
			if ( this.assets.hasOwnProperty( asset ) ) {
				// Call the appropriate loading function for the type of asset
				this.type[this.assets[asset].type]( this, this.assets[asset], this.assets[asset].callback );
			}
		}
	},

	/**
	 * Get an asset by name
	 */
	getAsset: function( assetName ) {
		return this.assets[assetName];
	}
};

// Create asset manager
Game.assetManager = new AssetManager();

// Fetch object data
Game.assetManager.addAsset( "objects.json", "json", "objects.json", function( data ) {
	settings.objectData = data;
});

// Fetch map data
Game.assetManager.addAsset( "map.json", "json", "map.json", function( data ) {
	settings.mapData = data;
	settings.map = new GameMap( data.map1.mapArray );
	settings.map.waves = data.map1.waves;
});

// Add files to asset manager
Game.assetManager.addAsset( "Walkable Tile", "image", "images/walkable.png" );
Game.assetManager.addAsset( "Unwalkable Tile", "image", "images/unwalkable.png" );
Game.assetManager.addAsset( "Start Tile", "image", "images/start.png" );
Game.assetManager.addAsset( "End Tile", "image", "images/end.png" );

/**
 * Abstract class for representing an entity in the game.
 * This should never be invoked on its own.
 */
function Entity(type, dimension, img) {
	/*
	 * category: the object's category e.g. "monsters" or "towers"
	 * name: the object's name e.g. "Zombie" or "Vampire"
	 * dimension: object that contains x, y, width, height. Ex) {x: 0, y: 0, width: 64, height: 64}
	 * durability: how much life does this entity has.
	 * damage: damage
	 * range: range
	 * rate: rate of fire
	 * materials: materials needed
	 * update: stub method for update. Override recommended
	 * draw: stub method for draw. Override recommended
	 * img: image
	 */
	if ( type ) {
		this.category = type[0];
		this.name = type[1];
		data = settings.objectData[this.category][this.name];
		this.durability = data.durability;
		this.damage = data.damage;
		this.range = data.range;
		this.rate = data.rate;
		this.materials = data.materials;
	}
	if ( dimension ) {
		this.x = dimension.x;
		this.y = dimension.y;
		this.width = dimension.width;
		this.height = dimension.height;
	}
	this.img = img;
}

Entity.prototype = {
	/**
	 * Unclear what this function does. Please specify in this comment.
	 */
	update: function( elapsed ) {
		this.width = MathEx.randInt( 100, 200 );
		this.height = MathEx.randInt( 100, 200 );
	},

	/**
	 * Unclear what this function does. Please specify in this comment.
	 */
	draw: function() {
		if ( img ) {
			stage.drawImage( this.img, this.x, this.y );
		} else {
			stage.fillStyle = "red";
			stage.fillRect( this.x, this.y, this.width, this.height );
		}
	}
};

/**
 * Tower object constructor
 */
function Tower( name, dimension ) {
	// TODO: Define some basic attributes that all towers can inherit

	if ( settings.objectData.towers[name] == undefined )
		throw "Tower: Invalid name: " + name;

	Entity.call( this, ["towers", name], dimension );
}

// Extend Entity
Tower.prototype = new Entity();

/**
 * Monster object constructor
 */
function Monster( name, dimension ) {
	// TODO: Define some basic attributes that all monsters can inherit

	if ( settings.objectData.monsters[name] == undefined )
		throw "Monster: Invalid name: " + name;

	Entity.call( this, ["monsters", name], dimension );
}

// Extends Entity
Monster.prototype = new Entity();

/**
 * Potion object constructor
 */
function Potion( name ) {
	// TODO: Define some basic attributes that all potions can inherit

	if ( settings.objectData.potions[name] == undefined )
		throw "Potion: Invalid name: " + name;

	Entity.call( this, ["potions",name] );
}

// Extends Entity
Potion.prototype = new Entity();

/**
 * Hero object constructor
 */
function Hero( name, dimension ) {
	// TODO: Define some basic attributes that all heroes can inherit

	if ( settings.objectData.heroes[name] == undefined )
		throw "Hero: Invalid name: " + name;

	Entity.call( this, ["heroes", name], dimension );
}

// Extends Entity
Hero.prototype = new Entity();

/**
 * Game map class
 * layout: A 2D array of values in the set [0, 1, 2, 3]
 *   0: Tile that can't be walked on
 *   1: Tile that can be walked on
 *   2: Starting tile
 *   3: Ending tile
 */
function GameMap( layout ) {
	this.layout = layout;
}

GameMap.prototype = {
	/**
	 * Draws the map on the canvas
	 */
	draw: function() {
		// draw border
		stage.fillStyle = "black";
		stage.fillRect( 0, 0, this.layout.length * settings.TILE_LENGTH + 10, this.layout[0].length * settings.TILE_LENGTH + 10 );

		for (var row = 0; row < this.layout.length; row++) { // Loop through the rows
			for (var column = 0; column < this.layout[row].length; column++) { // Loop through the columns
				// get tile type
				var tileImage;
				switch (this.layout[row][column]) {
					case settings.tiles.WALKABLE:
						tileImage = Game.assetManager.getAsset( "Walkable Tile" );
						break;
					case settings.tiles.UNWALKABLE:
						tileImage = Game.assetManager.getAsset( "Unwalkable Tile" );
						break;
					case settings.tiles.START:
						tileImage = Game.assetManager.getAsset( "Start Tile" );
						break;
					case settings.tiles.END:
						tileImage = Game.assetManager.getAsset( "End Tile" );
						break;
					default:
						throw "Invalid map!";
				}

				// draw a 64x64 tile in the correct location
				stage.drawImage( tileImage.elem, column * settings.TILE_LENGTH + 5, row * settings.TILE_LENGTH + 5 );
			}
		}
	}
};

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
function ajax( uri, options, callback ) {
	options = options || {};

	// Create xhr object
	var xhr = new XMLHttpRequest();

	xhr.open( options.method || "GET", uri );

	// If type is undefined
	if ( options.type ) {
		xhr.responseType = options.type;
	}

	xhr.onload = function() {
		if (typeof callback === "function") {
			callback(xhr.responseText, xhr);
		}
	};

	if ( options.data ) {
		return xhr.send(options.data);
	}
	xhr.send();
}

/**
 * Updates the game state
 */
Game.update = function() {
	// TODO: Update the game entities

	var timeNow = new Date().getTime();
	if ( settings.time !== 0 ) {
		var elapsed = timeNow - settings.time;
		for ( var i = 0; i < settings.entities.length; i++ ) {
			settings.entities[i].update(elapsed);
		}
	}
	settings.time = timeNow;
}

/**
 * Draws the current game state
 */
Game.draw = function() {
	// Clear stage so we can draw over it
	stage.clearRect( 0, 0, stage.width, stage.height );

	// Draw background (currently just a solid color)
	stage.fillStyle = "black";
	stage.fillRect( 0, 0, stage.width, stage.height );

	// Draw map
	settings.map.draw();

	// Draw entities
	for ( var i = 0; i < settings.entities.length; i++ ) {
		settings.entities[i].draw();
	}
}

/**
 * Function to call each frame
 */
Game.tick = function() {
	Game.update();
	Game.draw();
}

// Load images and start game when done
Game.assetManager.load( function() {
	// Create a timer that calls a function, tick (which updates the game and draw), FPS times per second
	setInterval( Game.tick, 1000 / settings.FPS );
});

/**
 * Binds an event listener to an element
 * elem: The element
 * type: The type of event (i.e. "click")
 * fn: The function to call when the event fires
 */
function bind( elem, type, fn ) {
	elem.addEventListener( type, fn, false );
}

// Resize the canvas when the window is resized
// UPDATE: Test this later. Let's get the game running first
/*var windowResize = function() {
	var w = window.innerWidth - 3,
		h = window.innerHeight - 3,
		optimalW = w < h ? w : h;
	settings.canvas.style.width = optimalW + "px";
	settings.canvas.style.height = optimalW + "px";
};
windowResize();
bind( window, "resize", windowResize );*/

})(window);
