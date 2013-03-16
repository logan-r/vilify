/**
 * Vilify main.js file
 */

(function( window ) {

// Our canvas context for drawing
var stage = window.stage = settings.stage = settings.canvas.getContext( "2d" );

/**
 * Updates the game state
 */
Game.update = function() {
	// TODO: Update the game entities

	var timeNow = new Date().getTime();
	if ( settings.time !== 0 ) {
		var elapsed = timeNow - settings.time;
		for ( var i = 0; i < settings.entities.length; i++ ) {
			settings.entities[i].update( elapsed );
		}
	}
	settings.time = timeNow;
}

/**
 * Draws the current game state
 */
Game.draw = function() {
	// Clear stage so we can draw over it
	stage.clearRect( 0, 0, stage.width, stage.height );

	// Draw map
	settings.map.draw();
	
	// Draw entities
	for ( var i = 0; i < settings.entities.length; i++ ) {
		settings.entities[i].draw();
	}
}

/**
 * Function to call each frame
 */
Game.tick = function() {
	Game.update();
	Game.draw();
}

// Called when game starts
var startGame = function() {
	// Create a timer that calls a function, tick (which updates the game and draw), FPS times per second
	setInterval( Game.tick, 1000 / settings.FPS );
	
	// Create starting entities
	buildTower( "Basic Tower", 6, 9 );
	buildTower( "Laser Tower", 2, 5 );
	buildTower( "Ice Tower", 2, 1 );
	buildTower( "Dust Tower", 6, 5 );
	buildTower( "Flame Tower", 3, 7 );
	buildTower( "Poison Tower", 7, 7 );
	buildTower( "Lightning Tower", 5, 1 );
	buildTower( "Curse Tower", 8, 3 );
};

window.startGame = startGame;

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
bind( window, "resize", windowResize );*/

})( window );
