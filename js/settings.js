/**
 * Vilify settings
 */

(function( window ) {

var Game = {
	name: "Vilify",
	version: "1.0.0"
};

window.Game = Game;

// Game settings
Game.settings = {
	width: 650, // Width of the canvas
	height: 650, // Heihgt of the canvas
	FPS: 30, // Frames per second
	time: 0, // To keep track of time elapsed
	TILE_LENGTH: 64, // Tile length (since it is awkward to call it a width or height)
	tiles: {
		WALKABLE: 0,
		UNWALKABLE: 1,
		START: 2,
		END: 3
	},
	canvas: document.getElementById( "canvas" ), // Our drawing canvas
	objectData: null, // Game object data
	mapData: null, // Game map data
	tileData: null, // Tile sprite sheet data
	towerData: null, // Tower sprite sheet data
	map: null, // Game map
	entities: [] // Game entities
};

window.settings = Game.settings;

})( window );
