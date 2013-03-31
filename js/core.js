/*!
 * Vilify Core
 */

(function( window ) {

var Game = window.Game;

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
	materialData: null, // Material sprite sheet data
	map: null, // Game map
	sidebar: null // Game sidebar
};

/**
 * Game map class constructor
 * layout: A 2D array of values (see Game.settings.tiles for possible values)
 */
Game.Map = function( layout ) {
	this.layout = layout;
	this.paths = this.getPaths();
};

Game.Map.prototype = {
	/**
	 * Get all the paths through the map
	 */
	getPaths: function() {
		path_q = [];
		startTile = { x: 0, y: 0 };
		endTile = { x: 9, y: 9 };
		initPath = [startTile];
		path_q.push(initPath);
		while ( path_q.length != 0 ) {
			tmpPath = path_q.splice( 0, 1 )[0];
			lastTile = tmpPath[ tmpPath.length - 1];
			if ( lastTile.x == endTile.x && lastTile.y == endTile.y ) {
				for ( i = 0; i < tmpPath.length; i++ ) {
					tmpPath[i].x = tmpPath[i].x * 64 + 32;
					tmpPath[i].y = tmpPath[i].y * 64 + 32;
				}
				return tmpPath;
			}
			adjTiles = [{ x: lastTile.x - 1, y: lastTile.y }, { x: lastTile.x + 1, y: lastTile.y }, { x: lastTile.x, y: lastTile.y - 1 }, { x: lastTile.x, y: lastTile.y + 1 } ];
			for ( i = 0; i < adjTiles.length; i++) {
				adjTile = adjTiles[i];
				if ( adjTile.x < 0 || adjTile.x > 9 || adjTile.y < 0 || adjTile.y > 9 ) {
					continue;
				}
				else if ( this.layout[adjTile.y][adjTile.x] == settings.tiles.UNWALKABLE ) {
					continue;
				}
				alreadyInPath = false;
				for ( j = 0; j < tmpPath.length; j++ ) {
					if ( adjTile.x == tmpPath[j].x  && adjTile.y == tmpPath[j].y ) {
						alreadyInPath = true;
					}
				}
				if ( !alreadyInPath ) {
					newPath = tmpPath;
					newPath.push( adjTile ) 
					path_q.push( newPath );
				}
			}
		}
		// No path
		throw "Map: No possible path!";
	},
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
Game.Tower = function( name, dimension ) {
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
 * @param path - an array of points that the hero walk through e.g. [{x: 64, y: 64}, {x: 128, y: 128}]
 */
Game.Hero = function( name, dimension, path ) {
	if ( settings.objectData.heroes[name] == undefined )
		throw "Hero: Invalid name: " + name;
	
	Game.Entity.call( this, ["heroes", name], dimension, undefined/*Game.assets["Hero Spritesheet"].elem*/, {}/*settings.heroData.frames[settings.objectData.heroes[name].image].frame*/ );
	
	this.path = path;
	this.speed = settings.objectData.heroes[name].speed;
}

// Extends Entity
Game.Hero.prototype = new Game.Entity();

// Override Update Method
Game.Hero.prototype.update = function() {
	// Move towards next point on path
	if ( this.path.length > 0 ) {
		nextPoint = this.path[0];
		
		// Move x
		if ( this.x > nextPoint.x ) {
			this.x -= Math.min( Math.abs(nextPoint.x - this.x), this.speed  / settings.fps * 64 );
		} else if ( this.x < nextPoint.x ) {
			this.x += Math.min( Math.abs(nextPoint.x - this.x), this.speed  / settings.fps * 64 );
		}
		
		// Move y
		if ( this.y > nextPoint.y ) {
			this.y -= Math.min( Math.abs(nextPoint.y - this.y), this.speed  / settings.fps * 64 );
		} else if ( this.y < nextPoint.y ) {
			this.y += Math.min( Math.abs(nextPoint.y - this.y), this.speed  / settings.fps * 64 );
		}
		
		// Check to see if hero has reached nextPoint
		if ( this.x == nextPoint.x && this.y == nextPoint.y ) {
			this.path.splice( 0, 1 ); // Remove nextPoint from path
		}
	}
}

/**
 * Material object constructor
 */
Game.Material = function( name, dimension ) {
	// TODO: Define some basic attributes that all towers can inherit

	if ( settings.objectData.materials[name] == undefined )
		throw "Material: Invalid name: " + name;

	Game.Entity.call( this, ["materials", name], dimension, Game.assets["Material Spritesheet"].elem, settings.materialData.frames[settings.objectData.materials[name].image].frame );
}

// Extend Entity
Game.Material.prototype = new Game.Entity();

// Override clicked method
Game.Material.prototype.clicked = function() {
	Game.Sidebar.getMaterial( this.name );
	Game.killList.push( this );
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
_.bind( window, "resize", windowResize );*/

})( window );
