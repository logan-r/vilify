/*!
 * Vilify Core
 */

(function( window ) {

var Game = window.Game;

// Bitches be trippin'
Game.name = "Vilify";
Game.version = "1.0.0";

var settings = Game.settings = {
	fps: 30,
	tile_length: 64, // Length of the tile
	tiles: {
		WALKABLE: 0,
		UNWALKABLE: 1,
		START: 2,
		END: 3
	},
	objectData: null, // Game object data
	mapData: null, // Game map data
	tileData: null, // Tile sprite sheet data
	towerData: null, // Tower sprite sheet data
	map: null, // Game map
};

/**
 * Game map class constructor
 * layout: A 2D array of values (see Game.settings.tiles for possible values)
 */
Game.Map = function( layout ) {
	this.layout = layout;
};

Game.Map.prototype = {
	/**
	 * Draws the map on the canvas
	 */
	draw: function() {
		var tileSprite = Game.assets["Tile Spritesheet"].elem,
			row = 0,
			col;
		for ( ; row < this.layout.length; row++ ) {
			for ( col = 0; col < this.layout[row].length; col++ ) {
				// Get tile type
				var spriteData;
				switch ( this.layout[row][col] ) {
					case settings.tiles.WALKABLE:
						spriteData = settings.tileData.frames["walkable.png"].frame;
						break;
					case settings.tiles.UNWALKABLE:
						spriteData = settings.tileData.frames["unwalkable.png"].frame;
						break;
					case settings.tiles.START:
						spriteData = settings.tileData.frames["start.png"].frame;
						break;
					case settings.tiles.END:
						spriteData = settings.tileData.frames["end.png"].frame;
						break;
					default:
						throw "Invalid map!";
				}

				// Draw the tile
				Game.ctx.drawImage( tileSprite,
					spriteData.x,
					spriteData.y,
					spriteData.w,
					spriteData.h,
					settings.tile_length * col,
					settings.tile_length * row,
					settings.tile_length,
					settings.tile_length );
			}
		}
	}
};

/**
 * Tower object constructor
 */
Game.Tower = function( name, dimension, img ) {
	// TODO: Define some basic attributes that all towers can inherit

	if ( settings.objectData.towers[name] == undefined )
		throw "Tower: Invalid name: " + name;

	Game.Entity.call( this, ["towers", name], dimension, Game.assets["Tower Spritesheet"].elem, settings.towerData.frames[settings.objectData.towers[name].image].frame );
}

// Extend Entity
Game.Tower.prototype = new Game.Entity();

// Override Update Method
Game.Tower.prototype.update = function() {
	this.angle += Math.PI / settings.fps;
}

/**
 * Monster object constructor
 */
Game.Monster = function( name, dimension ) {
	// TODO: Define some basic attributes that all monsters can inherit

	if ( settings.objectData.monsters[name] == undefined )
		throw "Monster: Invalid name: " + name;

	Game.Entity.call( this, ["monsters", name], dimension );
}

// Extends Entity
Game.Monster.prototype = new Game.Entity();

/**
 * Potion object constructor
 */
Game.Potion = function( name ) {
	// TODO: Define some basic attributes that all potions can inherit

	if ( settings.objectData.potions[name] == undefined )
		throw "Potion: Invalid name: " + name;

	Game.Entity.call( this, ["potions",name] );
}

// Extends Entity
Game.Potion.prototype = new Game.Entity();

/**
 * Hero object constructor
 */
Game.Hero = function( name, dimension ) {
	// TODO: Define some basic attributes that all heroes can inherit

	if ( settings.objectData.heroes[name] == undefined )
		throw "Hero: Invalid name: " + name;

	Game.Entity.call( this, ["heroes", name], dimension );
}

// Extends Entity
Game.Hero.prototype = new Game.Entity();

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
_.bind( window, "resize", windowResize );*/

})( window );