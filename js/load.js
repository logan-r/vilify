/*
 * Loads all files and starts game when done
 */

(function( window ) {

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

// Load images and start game when done
Game.assetManager.load( startGame );

})( window );
