/*!
 * Vilify Core
 */

(function( window ) {

var Game = window.Game;

_.deepCopy( Game, {

	name: "Vilify",
	version: "1.0.0",

	settings: {
		fps: 30,
		map: null,
		sidebar: null
	},

	Tile: {

		/**
		 * The tiles of Vilify
		 */
		tiles: {
			WALKABLE: { id: 0, name: "WALKABLE" },
			UNWALKABLE: { id: 1, name: "UNWALKABLE" },
			START: { id: 2, name: "START" },
			END: { id: 3, name: "END" }
		}
	}
} );

// TODO

// After the game's working
// var windowResize = function() {
// 	var w = window.innerWidth - 3,
// 		h = window.innerHeight - 3,
// 		optimalW = w < h ? w : h;
// 	settings.canvas.style.width = optimalW + "px";
// 	settings.canvas.style.height = optimalW + "px";
// };
// windowResize();
// _.bind( window, "resize", windowResize );

})( window );
