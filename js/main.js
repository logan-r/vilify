/**
 * Vilify main.js file
 */

(function( window ) {

// Our canvas context for drawing
var stage = window.stage = settings.stage = settings.canvas.getContext( "2d" );

// Create asset manager
Game.assetManager = new AssetManager();

// Fetch object data
Game.assetManager.addAsset( "objects.json", "json", "game_data/objects.json", function( data ) {
	settings.objectData = data;
});

// Fetch map data
Game.assetManager.addAsset( "maps.json", "json", "game_data/maps.json", function( data ) {
	settings.mapData = data;
	settings.map = new GameMap( data.map1.mapArray );
	settings.map.waves = data.map1.waves;
});

// Fetch tile sprite sheet data
Game.assetManager.addAsset( "tiles.json", "json", "images/tiles.json", function( data ) {
	settings.tileData = data;
});

// Fetch tower sprite sheet data
Game.assetManager.addAsset( "towers.json", "json", "images/towers.json", function( data ) {
	settings.towerData = data;
});

// Add files to asset manager
Game.assetManager.addAsset( "Tile Sprite Sheet", "image", "images/tiles.png" );
Game.assetManager.addAsset( "Tower Sprite Sheet", "image", "images/towers.png" );

// Global functions

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

	// Draw background (currently just a solid color)
	stage.fillStyle = "black";
	stage.fillRect( 0, 0, stage.width, stage.height );

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

// Load images and start game when done
Game.assetManager.load( function() {
	// Create a timer that calls a function, tick (which updates the game and draw), FPS times per second
	setInterval( Game.tick, 1000 / settings.FPS );
	
	// Create starting entities
	basicTower = new Tower( "Basic Tower", { x: (64 * 3) + 5, y: (64 * 7) + 5, width: 64, height: 64 } );
	settings.entities.push( basicTower );
	laserTower = new Tower( "Laser Tower", { x: (64 * 5) + 5, y: (64 * 1) + 5, width: 64, height: 64 } );
	settings.entities.push( laserTower );
});

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
