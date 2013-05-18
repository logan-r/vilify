/**
 * Vilify main.js file
 */

(function( window ) {

var Game = window.Game.init( document.getElementById( "canvas" ) );
var settings = Game.settings;
var canvas = settings.canvas;
var ctx = settings.ctx;

// Fetch data
Game.SpriteManager.add( "tiles" );
Game.SpriteManager.add( "towers" );
Game.SpriteManager.add( "materials" );
// Game.SpriteManager.add( "monsters" );

// Loading Screen
// TODO: Implement loading
Game.StateManager.add( "loading", {
	update: function( delta ) {},
	draw: function( ctx ) {}
}, true );

// TODO: Implement main menu
Game.StateManager.add( "mainmenu", {
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

})( window );
