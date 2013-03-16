/*
 * Contains all the game objects
 */

(function( window ) {

/**
 * Tower object constructor
 */
function Tower( name, dimension ) {
  // TODO: Define some basic attributes that all towers can inherit

	if ( settings.objectData.towers[name] == undefined )
		throw "Tower: Invalid name: " + name;
		
	data = settings.objectData.towers[name];
	this.durability = data.durability;
	this.damage = data.damage;
	this.range = data.range;
	this.rate = data.rate;
	this.effects = data.effects;

	Entity.call( this, name, dimension, Game.assetManager.getAsset( "Tower Sprite Sheet" ).elem, settings.towerData.frames[settings.objectData.towers[name].image].frame );
}

// Extend Entity
Tower.prototype = new Entity();

// Override Update Method
Tower.prototype.update = function( elapsed ) {
	this.rotation += Math.PI * elapsed / 1000;
}

// Build a tower on tile x, y
var buildTower = function (type, x, y) {
	tower = new Tower( type, { x: (64 * x) + 5, y: (64 * y) + 5, width: 64, height: 64 } );
	settings.entities.push( tower );
}

window.Tower = Tower;
window.buildTower = buildTower;


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

window.Monster = Monster;

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

window.Potion = Potion;

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

window.Hero = Hero;

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

		for ( var row = 0; row < this.layout.length; row++ ) { // Loop through the rows
			for ( var column = 0; column < this.layout[row].length; column++ ) { // Loop through the columns
				// get tile type
				var spriteData;
				switch ( this.layout[row][column] ) {
					case settings.tiles.WALKABLE:
						spriteData = settings.tileData["frames"]["walkable.png"]["frame"];
						break;
					case settings.tiles.UNWALKABLE:
						spriteData = settings.tileData["frames"]["unwalkable.png"]["frame"];
						break;
					case settings.tiles.START:
						spriteData = settings.tileData["frames"]["start.png"]["frame"];
						break;
					case settings.tiles.END:
						spriteData = settings.tileData["frames"]["end.png"]["frame"];
						break;
					default:
						throw "Invalid map!";
				}

				// draw a 64x64 tile in the correct location
				stage.drawImage( Game.assetManager.getAsset( "Tile Sprite Sheet" ).elem, spriteData.x, spriteData.y, settings.TILE_LENGTH, settings.TILE_LENGTH, column * settings.TILE_LENGTH + 5, row * settings.TILE_LENGTH + 5, settings.TILE_LENGTH, settings.TILE_LENGTH );
			}
		}
	}
};

window.GameMap = GameMap;

})( window );
