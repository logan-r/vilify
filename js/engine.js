/*!
 * Abstract Game Engine
 */

(function( window ) {

if ( window.Game ) {
	// Don't include this file twice.
	return;
}

/**
 * The abstract Game object.
 * @object Game
 */
var Game = window.Game = {
	/**
	 * Holds game settings. Contains the required default settings.
	 * But additional game settings can be added based on what your
	 * game needs.
	 * @object Game.settings
	 *   @prop fps {Number} Frames per second
	 *   @prop startTime {Number} The start time in milliseconds of the game.
	 *   @prop time {Number} The elapsed time in milliseconds since the game started
	 */
	settings: {
		fps: 30,
		startTime: 0,
		time: 0
	},

	/**
	 * Holds Game assets
	 * @object Game.assets
	 */
	assets: {},

	/**
	 * Holds game entities
	 * @array Game.entities
	 */
	entities: [],

	/**
	 * True of the game is running and false if not.
	 * @bool Game.active
	 */
	active: false,

	/**
	 * Function to call each frame
	 * @function Game.tick
	 */
	tick: function() {
		Game.settings.time = new Date().getTime() - Game.settings.startTime;
		Game.update();
		Game.draw();
	},

	/**
	 * Updates the game state. Should be overridden.
	 * @function Game.update
	 */
	update: function() {
	},

	/**
	 * Draws the current game state to the canvas.
	 * Should be overridden.
	 * @function Game.draw
	 */
	draw: function() {
	},

	/**
	 * Starts the engine
	 * @function Game.start
	 */
	start: function() {
		if ( !this.active ) {
			this.settings.startTime = new Date().getTime();
			setInterval( this.tick, 1000 / ( this.settings.fps || 30 ) );
			this.active = true;
		}
	},

	/**
	 * Stops the engine
	 * @function Game.stop
	 */
	stop: function() {
		clearInterval( this.tick );
		this.active = false;
	}
};


/**
 * Asset object constructor
 * @function Game.Asset
 * @param type {String} The asset's type (defined in Asset.types)
 * @param src {String} The file path of the asset
 */
Game.Asset = function( type, src ) {
	this.type = type;
	this.src = src;
};

/**
 * Asset types
 * @object Game.Asset.types
 *   @prop image {Function} For loading image assets
 *   @prop audio {Function} For loading audio assets
 *   @prop json {Function} For loading JSON assets
 */
Game.Asset.types = {
	image: function( asset, callback ) {
		var img = new Image();
		img.onload = callback;
		img.src = asset.src;
		asset.elem = img;
	},
	audio: function( asset, callback ) {
		var audio = document.createElement( "audio" );
		audio.onload = callback;
		audio.src = asset.src;
		asset.elem = audio;
	},
	json: function( asset, callback ) {
		_.ajax( asset.src, null, function( msg ) {
			asset.elem = JSON.parse( msg );
			if ( callback ) {
				callback( asset.elem );
			}
		});
	}
};

/**
 * Loads this asset
 * @function Game.Asset.prototype.load
 * @param callback {Function, optional} A function to call when the asset is loaded
 */
Game.Asset.prototype.load = function( callback ) {
	Game.Asset.types[this.type]( this, callback );
};


/**
 * Data structure for holding and loading Asset objects
 * @function Game.AssetManager
 * @param assetSrc {Object} An object source to store added Assets to
 */
Game.AssetManager = function( assetSrc ) {
	this.assets = assetSrc || {};

	// Total and loaded assets
	this.totalAssets = 0;
	this.loadedAssets = 0;
};

Game.AssetManager.prototype = {
	/**
	 * Adds an asset to the source object
	 * @function Game.AssetManager.prototype.add
	 * @param name {String} The name of the asset
	 * @param asset {Game.Asset} The asset to be added
	 */
	add: function( name, asset ) {
		this.assets[name] = asset;
		this.totalAssets++;
	},

	/**
	 * Gets an asset
	 * @function Game.AssetManager.prototype.get
	 * @param name {String} The name of the asset
	 */
	get: function( name ) {
		return this.assets[name];
	},

	/**
	 * Checks if all assets in this asset manager have been loaded
	 * @function Game.AssetManager.prototype.loaded
	 */
	loaded: function() {
		return this.totalAssets === this.loadedAssets;
	},

	/**
	 * Loads all assets currently in the asset manager
	 * @function Game.AssetManager.prototype.load
	 * @param callback {Function} A function to call when all assets are loaded
	 */
	load: function( callback ) {
		this.callback = callback;

		var self = this,
			i;
		for ( i in this.assets ) {
			if ( this.assets.hasOwnProperty( i ) ) {
				this.assets[i].load( function() {
					self.assetLoaded();
				});
			}
		}
	},

	/**
	 * A function to call when an asset has loaded
	 */
	assetLoaded: function() {
		this.loadedAssets++;
		if ( this.loaded() && this.callback ) {
			this.callback();
		}
	}
};

/**
 * Abstract class for representing an entity in the game.
 * This should never be invoked on its own.
 * @function Game.Entity
 * @param type {Array} The objects category and name
 * @param dimension {Object} Contains the x, y, width, and height of the entity
 * @param img {Image} The entity's image
 * @param spriteData {Object} Location of the image in the sprite
 */
Game.Entity = function( type, dimension, img, spriteData ) {
	if ( type ) {
		this.category = type[0];
		this.name = type[1];
	}
	if ( dimension ) {
		this.x = dimension.x;
		this.y = dimension.y;
		this.width = dimension.width;
		this.height = dimension.height;
	}
	this.img = img;
	this.spriteData = spriteData;
	this.angle = 0;
};

Game.Entity.prototype = {
	/**
	 * Updates the entity
	 * @function Game.Entity.prototype.update
	 */
	update: function() {
	},

	/**
	 * Draws the entity to the canvas
	 * @function Game.Entity.prototype.draw
	 */
	draw: function( ctx ) {
		if ( this.img ) {
			ctx.save();

			// Rotate the image
			if ( this.angle ) {
				ctx.translate( this.x, this.y );
				ctx.rotate( this.angle );
			}

			// Draw the image
			ctx.drawImage( this.img, this.spriteData.x, this.spriteData.y, this.spriteData.w, this.spriteData.h, -this.width / 2, -this.height / 2, this.width, this.height );

			ctx.restore();
		}
	}
};

/**
 * The default AssetManager for your Game (you can create
 * more if needed).
 * @object {Game.AssetManager} Game.assetManager
 */
Game.assetManager = new Game.AssetManager( Game.assets );

})( window );
