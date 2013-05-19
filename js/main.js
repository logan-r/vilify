/*!
 * Vilify main.js file
 */

(function( window ) {

var Game = window.Game.init( document.getElementById( "canvas" ), 30 );
var settings = Game.settings;
var canvas = settings.canvas;
var ctx = settings.ctx;

// Fetch data
Game.SpriteManager.add( "tiles" );
Game.SpriteManager.add( "towers" );
Game.SpriteManager.add( "materials" );
// Game.SpriteManager.add( "monsters" );

// Loading Screen
var startedLoading = false;
Game.StateManager.add( "loading", {
	update: function( delta ) {
		if ( !startedLoading ) {
			startedLoading = true;
			Game.AssetManager.load( function() {
				Game.StateManager.change( "main_menu" );
			}, function(){} );
		}
	},
	draw: function( ctx ) {}
}, true );

// TODO: Implement main menu
Game.StateManager.add( "main_menu", {
	update: function( delta ) {},
	draw: function( ctx ) {}
} );

// TODO: Implement game screen
Game.StateManager.add( "game", {
	update: function( delta ) {},
	draw: function( ctx ) {}
}, true /* For testing purposes */);

// TODO: Implement pause
Game.StateManager.add( "pause", {
	update: function( delta ) {},
	draw: function( ctx ) {}
} );

Game.StateManager.change( "loading" );
Game.start();

})( window );
