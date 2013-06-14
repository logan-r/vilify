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
Game.AssetManager.add( "logo.png", _.make( Game.Asset ).init(
	Game.AssetManager.assetType.image,
	"images/logo.png",
	function() {}
) );

mainFont = _.make( Game.Font ).init( 32, "Happy Monkey" );
var newGameButton = _.make( Game.Button ).init( "New Game", mainFont, 300, 300, 20, 20, "#2DB42A", "#222" );
newGameButton.click = function() {
	Game.StateManager.change( "game" );
};
Game.entities.push( newGameButton );

// Loading Screen
var startedLoading = false;
Game.StateManager.add( "loading", {
	update: function( delta ) {
		if ( !startedLoading ) { // Don't start multiple loading processes
			startedLoading = true;
			Game.AssetManager.load( function() {
				Game.StateManager.state.update();
				window.setTimeout( function() {
					Game.StateManager.change( "main_menu" );
				}, 500 );
			}, function() {} );
		}
		
		return false;
	},
	draw: function( ctx ) {
		// Draw background
		ctx.fillStyle = "#000";
		ctx.fillRect( 0, 0, canvas.width, canvas.height );

		// Draw loading bar
		ctx.lineWidth = "5";
		ctx.strokeStyle = "#2DB42A";
		ctx.fillStyle = "#2DB42A";
		ctx.strokeRect( canvas.width / 2 - 300 / 2 - 10, canvas.height / 2 - 50 / 2 - 10, 300 + 10, 50 + 10 );
		ctx.stroke();
		ctx.fillRect( canvas.width / 2 - 300 / 2 - 10 / 2, canvas.height / 2 - 50 / 2 - 10 / 2, 300 * Game.AssetManager.loadedCount / Game.AssetManager.assetCount, 50 );
		
		return false;
	}
}, true );

// TODO: Implement main menu
Game.StateManager.add( "main_menu", {
	update: function( delta ) {
		return true;
	},
	draw: function( ctx ) {
		// Draw background
		ctx.fillStyle = "#000";
		ctx.fillRect( 0, 0, canvas.width, canvas.height );

		// Draw logo
		ctx.drawImage( Game.AssetManager.assets["logo.png"].content, canvas.width / 2 - Game.AssetManager.assets["logo.png"].content.width / 2, 20 );
		
		return true;
	}
} );

// TODO: Implement game screen
Game.StateManager.add( "game", {
	update: function( delta ) {
		// Draw background
		ctx.fillStyle = "#000";
		ctx.fillRect( 0, 0, canvas.width, canvas.height );
	},
	draw: function( ctx ) {}
} );

// TODO: Implement pause
Game.StateManager.add( "pause", {
	update: function( delta ) {},
	draw: function( ctx ) {}
} );

Game.start();

})( window );
