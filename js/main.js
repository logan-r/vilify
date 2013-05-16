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
Game.addState( "loading", {
	update: function( delta ) {},
	draw: function( ctx ) {}
} );

// TODO: Implement main menu
Game.addState( "mainmenu", {
	update: function( delta ) {},
	draw: function( ctx ) {}
} );

// TODO: Implement game screen
Game.addState( "game", {
	update: function( delta ) {},
	draw: function( ctx ) {}
} );

// TODO: Implement pause
Game.addState( "pause", {
	update: function( delta ) {},
	draw: function( ctx ) {}
} );

})( window );
