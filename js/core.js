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
